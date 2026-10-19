import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  ActionLog,
  QuizLog,
  UserProfile,
  DailyReflection,
  Mission,
  Category,
  Badge,
  ActiveTab,
  LevelInfo,
} from './types';
import { MISSIONS_DATA } from './data/missionsData';
import { CATEGORIES_DATA } from './data/categoriesData';
import {
  StorageService,
  computeGameStats,
  getTodayString,
  DEFAULT_PROFILE,
} from './services/storage';
import {
  playSuccessSound,
  playLevelUpFanfare,
  playQuizCorrectSound,
  playQuizWrongSound,
  playTapSound,
} from './utils/audio';
import { APP_CONFIG } from './config/appConfig';

import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { NoticeBanner } from './components/common/NoticeBanner';

import { HomeView } from './components/views/HomeView';
import { ExploreView } from './components/views/ExploreView';
import { RecordView } from './components/views/RecordView';
import { BuddyView } from './components/views/BuddyView';

import { MissionDetailModal } from './components/modals/MissionDetailModal';
import { CategoryDetailModal } from './components/modals/CategoryDetailModal';
import { LevelUpModal } from './components/modals/LevelUpModal';
import { BadgeUnlockModal } from './components/modals/BadgeUnlockModal';
import { BackupModal } from './components/modals/BackupModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [actionLogs, setActionLogs] = useState<ActionLog[]>([]);
  const [quizLogs, setQuizLogs] = useState<QuizLog[]>([]);
  const [reflections, setReflections] = useState<DailyReflection[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Active Modals state
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [levelUpModalInfo, setLevelUpModalInfo] = useState<LevelInfo | null>(null);
  const [badgeUnlockModalInfo, setBadgeUnlockModalInfo] = useState<Badge | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Load all initial data from IndexedDB
  const reloadData = useCallback(async () => {
    try {
      const [loadedProfile, loadedLogs, loadedQuizzes, loadedReflections] =
        await Promise.all([
          StorageService.getProfile(),
          StorageService.getActionLogs(),
          StorageService.getQuizLogs(),
          StorageService.getReflections(),
        ]);
      setProfile(loadedProfile);
      setActionLogs(loadedLogs);
      setQuizLogs(loadedQuizzes);
      setReflections(loadedReflections);
      setIsLoaded(true);
    } catch {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    reloadData();
  }, [reloadData]);

  // Compute game stats (Event-sourced from actionLogs + quizLogs)
  const stats = useMemo(() => {
    return computeGameStats(actionLogs, quizLogs);
  }, [actionLogs, quizLogs]);

  const today = getTodayString();

  // Completed mission IDs today
  const completedMissionIdsToday = useMemo(() => {
    return actionLogs
      .filter((l) => l.dateString === today)
      .map((l) => l.missionId);
  }, [actionLogs, today]);

  // Daily Recommended Quests (3 curated missions based on day of week)
  const dailyMissions = useMemo(() => {
    const dayOfWeek = new Date().getDay(); // 0-6
    // Rotate 3 missions across categories each day
    const rec1 = MISSIONS_DATA[dayOfWeek % 10]; // Energy or mobility
    const rec2 = MISSIONS_DATA[10 + ((dayOfWeek * 2) % 10)]; // Waste or water
    const rec3 = MISSIONS_DATA[20 + ((dayOfWeek * 3) % 10)]; // Food or forest
    return [rec1, rec2, rec3].filter(Boolean);
  }, []);

  // Check for level-up or new badges
  const checkProgressTriggers = (
    prevTotalXp: number,
    prevBadgeIds: string[],
    newLogs: ActionLog[],
    newQuizzes: QuizLog[]
  ) => {
    const prevStats = computeGameStats(actionLogs, quizLogs);
    const newStats = computeGameStats(newLogs, newQuizzes);

    // 1. Level up check
    if (newStats.currentLevel.level > prevStats.currentLevel.level) {
      playLevelUpFanfare(profile.soundEnabled);
      setLevelUpModalInfo(newStats.currentLevel);
    }

    // 2. New badge check
    const newlyUnlocked = newStats.unlockedBadgeIds.filter(
      (bId) => !prevStats.unlockedBadgeIds.includes(bId)
    );
    if (newlyUnlocked.length > 0) {
      const badgeObj = APP_CONFIG.badges.find((b) => b.id === newlyUnlocked[0]);
      if (badgeObj && newStats.currentLevel.level <= prevStats.currentLevel.level) {
        // Show badge unlock if not currently showing level up
        setBadgeUnlockModalInfo(badgeObj);
      }
    }
  };

  // Complete a mission
  const handleCompleteMission = async (mission: Mission) => {
    const alreadyDone = completedMissionIdsToday.includes(mission.id);
    if (alreadyDone) return;

    const newLog: ActionLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      missionId: mission.id,
      categoryId: mission.categoryId,
      dateString: today,
      timestamp: Date.now(),
      xpGained: mission.xpReward,
    };

    const nextLogs = [...actionLogs, newLog];
    await StorageService.addActionLog(newLog);

    playSuccessSound(profile.soundEnabled);
    checkProgressTriggers(stats.totalXp, stats.unlockedBadgeIds, nextLogs, quizLogs);

    setActionLogs(nextLogs);
  };

  // Cancel mission completion
  const handleCancelMission = async (identifier: string) => {
    // identifier can be logId or missionId
    const targetLog = actionLogs.find(
      (l) =>
        l.id === identifier ||
        (l.missionId === identifier && l.dateString === today)
    );

    if (!targetLog) return;

    const nextLogs = actionLogs.filter((l) => l.id !== targetLog.id);
    await StorageService.removeActionLog(targetLog.id);
    setActionLogs(nextLogs);
    playTapSound(profile.soundEnabled);
  };

  // Answer Quiz
  const handleAnswerQuiz = async (
    quizId: string,
    isCorrect: boolean
  ): Promise<{ firstCorrectBonus: boolean; xpGained: number }> => {
    if (isCorrect) {
      playQuizCorrectSound(profile.soundEnabled);
    } else {
      playQuizWrongSound(profile.soundEnabled);
    }

    const res = await StorageService.recordQuizAnswer(quizId, isCorrect);

    if (res.firstCorrectBonus) {
      const updatedQuizzes = await StorageService.getQuizLogs();
      checkProgressTriggers(stats.totalXp, stats.unlockedBadgeIds, actionLogs, updatedQuizzes);
      setQuizLogs(updatedQuizzes);
    }

    return res;
  };

  // Reflection save
  const handleSaveReflection = async (dateStr: string, note: string) => {
    await StorageService.saveReflection(dateStr, note);
    const updated = await StorageService.getReflections();
    setReflections(updated);
    playTapSound(profile.soundEnabled);
  };

  // Profile update
  const handleUpdateProfile = async (newProfile: UserProfile) => {
    await StorageService.saveProfile(newProfile);
    setProfile(newProfile);
  };

  // Sound toggle
  const handleToggleSound = () => {
    const updated = { ...profile, soundEnabled: !profile.soundEnabled };
    handleUpdateProfile(updated);
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#F8F7F0] flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#347A52] flex items-center justify-center text-white text-xl animate-pulse">
            🌱
          </div>
          <p className="text-xs font-semibold text-stone-600">
            지구편을 준비하고 있어요...
          </p>
        </div>
      </div>
    );
  }

  // Selected mission category lookup
  const selectedMissionCategory = selectedMission
    ? CATEGORIES_DATA.find((c) => c.id === selectedMission.categoryId) || null
    : null;

  const isSelectedMissionCompletedToday = selectedMission
    ? completedMissionIdsToday.includes(selectedMission.id)
    : false;

  const isSelectedMissionQuizAnswered = selectedMission
    ? quizLogs.some((q) => q.quizId === `mission_${selectedMission.id}`)
    : false;

  return (
    <div className="min-h-screen bg-[#F8F7F0] text-stone-900 font-sans selection:bg-emerald-200">
      {/* 1. Header (Stick to Top Bar contract) */}
      <Header
        levelInfo={stats.currentLevel}
        totalXp={stats.totalXp}
        soundEnabled={profile.soundEnabled}
        onToggleSound={handleToggleSound}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* 2. Main Content Container */}
      <main className="max-w-xl mx-auto px-4 pt-4 pb-28 space-y-4">
        {/* Notice Disclaimer Banner */}
        <NoticeBanner />

        {/* Tab 1: 홈 */}
        {activeTab === 'home' && (
          <HomeView
            stats={stats}
            profile={profile}
            dailyMissions={dailyMissions}
            completedMissionIdsToday={completedMissionIdsToday}
            onSelectMission={(m) => setSelectedMission(m)}
            onQuickCompleteMission={handleCompleteMission}
            onChangeTab={setActiveTab}
            onCharacterClick={() => setActiveTab('buddy')}
          />
        )}

        {/* Tab 2: 기후 탐험 */}
        {activeTab === 'explore' && (
          <ExploreView
            missions={MISSIONS_DATA}
            completedMissionIdsToday={completedMissionIdsToday}
            onSelectCategory={(cat) => setSelectedCategory(cat)}
            onSelectMission={(m) => setSelectedMission(m)}
          />
        )}

        {/* Tab 3: 실천 기록 */}
        {activeTab === 'record' && (
          <RecordView
            actionLogs={actionLogs}
            reflections={reflections}
            missions={MISSIONS_DATA}
            streakDays={stats.streakDays}
            onCancelAction={handleCancelMission}
            onSaveReflection={handleSaveReflection}
            onOpenBackup={() => setIsSettingsOpen(true)}
          />
        )}

        {/* Tab 4: 나의 지구버디 */}
        {activeTab === 'buddy' && (
          <BuddyView
            stats={stats}
            profile={profile}
            onUpdateProfile={handleUpdateProfile}
            onOpenBadge={(b) => setBadgeUnlockModalInfo(b)}
          />
        )}
      </main>

      {/* 3. Bottom Navigation Bar */}
      <BottomNav
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        todayCount={completedMissionIdsToday.length}
      />

      {/* 4. Modals */}
      {/* Mission Detail Modal */}
      <MissionDetailModal
        mission={selectedMission}
        category={selectedMissionCategory}
        isCompletedToday={isSelectedMissionCompletedToday}
        onClose={() => setSelectedMission(null)}
        onComplete={(m) => {
          handleCompleteMission(m);
        }}
        onCancelComplete={(id) => {
          handleCancelMission(id);
        }}
        onAnswerQuiz={handleAnswerQuiz}
        isQuizAnswered={isSelectedMissionQuizAnswered}
      />

      {/* Category Detail Modal */}
      <CategoryDetailModal
        category={selectedCategory}
        missions={
          selectedCategory
            ? MISSIONS_DATA.filter((m) => m.categoryId === selectedCategory.id)
            : []
        }
        completedMissionIdsToday={completedMissionIdsToday}
        onClose={() => setSelectedCategory(null)}
        onSelectMission={(m) => setSelectedMission(m)}
        onAnswerQuiz={handleAnswerQuiz}
        isCategoryQuizAnswered={
          selectedCategory
            ? quizLogs.some((q) => q.quizId === `category_${selectedCategory.id}`)
            : false
        }
      />

      {/* Level Up Celebration Modal */}
      <LevelUpModal
        levelInfo={levelUpModalInfo}
        onClose={() => setLevelUpModalInfo(null)}
      />

      {/* Badge Unlock Modal */}
      <BadgeUnlockModal
        badge={badgeUnlockModalInfo}
        onClose={() => setBadgeUnlockModalInfo(null)}
      />

      {/* Settings & Backup Modal */}
      {isSettingsOpen && (
        <BackupModal
          profile={profile}
          onClose={() => setIsSettingsOpen(false)}
          onDataChanged={reloadData}
          onUpdateProfile={handleUpdateProfile}
        />
      )}
    </div>
  );
}
