import React from 'react';
import {
  Sparkles,
  Trophy,
  ArrowRight,
  Flame,
  CheckCircle2,
  Calendar,
  Compass,
  Check,
} from 'lucide-react';
import { Mission, UserProfile, ActiveTab } from '../../types';
import { EcosystemDiorama } from '../character/EcosystemDiorama';
import { GameStats } from '../../services/storage';
import { CATEGORIES_DATA } from '../../data/categoriesData';

interface HomeViewProps {
  stats: GameStats;
  profile: UserProfile;
  dailyMissions: Mission[];
  completedMissionIdsToday: string[];
  onSelectMission: (mission: Mission) => void;
  onQuickCompleteMission: (mission: Mission) => void;
  onChangeTab: (tab: ActiveTab) => void;
  onCharacterClick: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  stats,
  profile,
  dailyMissions,
  completedMissionIdsToday,
  onSelectMission,
  onQuickCompleteMission,
  onChangeTab,
  onCharacterClick,
}) => {
  // Today's greeting based on hour
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 11) return '상쾌한 아침이에요';
    if (hour < 17) return '활기찬 오후예요';
    return '편안한 저녁이에요';
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* 1. Header Greeting & Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold text-emerald-800">
            {getGreeting()} 🌱
          </span>
          <h2 className="text-xl font-extrabold text-stone-900 tracking-tight">
            {profile.nickname}님, 오늘도 지구편!
          </h2>
        </div>

        {/* Streak Indicator */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-amber-50 border border-amber-200/90 shadow-2xs">
          <Flame className="w-4 h-4 text-amber-500 fill-amber-400" />
          <span className="text-xs font-bold text-amber-900 font-mono tabular-nums">
            {stats.streakDays}일 연속
          </span>
        </div>
      </div>

      {/* 2. Virtual Earth & Character Diorama */}
      <EcosystemDiorama
        levelInfo={stats.currentLevel}
        totalXp={stats.totalXp}
        xpInCurrentLevel={stats.xpInCurrentLevel}
        xpNeededForNext={stats.xpNeededForNext}
        progressPercent={stats.progressPercent}
        onCharacterClick={onCharacterClick}
      />

      {/* 3. Quick Stats Ribbon */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3.5 rounded-2xl bg-white border border-stone-200/80 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-stone-500">오늘 완료한 미션</p>
            <p className="text-base font-bold text-stone-900 font-mono tabular-nums">
              {stats.todayMissionsCount}개
            </p>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-stone-200/80 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-stone-500">이번 주 실천 횟수</p>
            <p className="text-base font-bold text-stone-900 font-mono tabular-nums">
              {stats.thisWeekMissionsCount}회
            </p>
          </div>
        </div>
      </div>

      {/* 4. Weekly Challenge Card (+20 XP) */}
      <div className="p-4 rounded-3xl bg-gradient-to-r from-emerald-50 via-teal-50/60 to-amber-50/50 border border-emerald-200/90 shadow-2xs">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-700 text-white flex items-center justify-center text-xs font-bold">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-stone-900">
                주간 챌린지: 3개 분야 탐험
              </h3>
              <p className="text-[10px] text-stone-500">
                월~일 서로 다른 3개 카테고리 실천 시 +20 XP 보너스
              </p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-800 tabular-nums">
            {stats.completedCategoryIdsThisWeek.length} / 3 분야
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2.5 bg-stone-200 rounded-full overflow-hidden p-0.5 mt-2">
          <div
            className="h-full bg-[#347A52] rounded-full transition-all duration-300"
            style={{
              width: `${Math.min(100, (stats.completedCategoryIdsThisWeek.length / 3) * 100)}%`,
            }}
          />
        </div>

        {/* Category icons completed this week */}
        <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
          {CATEGORIES_DATA.map((cat) => {
            const isDone = stats.completedCategoryIdsThisWeek.includes(cat.id);
            return (
              <span
                key={cat.id}
                className={`text-[10px] px-2 py-0.5 rounded-md border flex items-center gap-1 ${
                  isDone
                    ? 'bg-emerald-100/80 border-emerald-300 text-emerald-900 font-semibold'
                    : 'bg-white/60 border-stone-200 text-stone-400'
                }`}
              >
                {isDone && <Check className="w-2.5 h-2.5" />}
                <span>{cat.name.split('·')[0]}</span>
              </span>
            );
          })}
        </div>

        {stats.isWeeklyBonusEarnedThisWeek && (
          <div className="mt-2 text-[11px] font-bold text-emerald-800 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>이번 주 주간 챌린지 달성 완료! (+20 XP 지급됨)</span>
          </div>
        )}
      </div>

      {/* 5. Daily Recommended Quests (2-3 items) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-bold text-stone-900">
              오늘의 추천 퀘스트
            </h3>
          </div>
          <span className="text-xs text-stone-500">
            매일 새로운 실천
          </span>
        </div>

        <div className="space-y-2.5">
          {dailyMissions.map((m) => {
            const isCompleted = completedMissionIdsToday.includes(m.id);
            const category = CATEGORIES_DATA.find((c) => c.id === m.categoryId);

            return (
              <div
                key={m.id}
                className={`p-3.5 rounded-2xl border transition-all ${
                  isCompleted
                    ? 'bg-emerald-50/50 border-emerald-200/90'
                    : 'bg-white border-stone-200 hover:border-emerald-300 shadow-2xs'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div
                    onClick={() => onSelectMission(m)}
                    className="flex-1 cursor-pointer"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                        {category?.name || '친환경'}
                      </span>
                      <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded-md">
                        +{m.xpReward} XP
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-stone-900 leading-snug hover:text-emerald-800 transition-colors">
                      {m.title}
                    </h4>
                    <p className="text-xs text-stone-500 mt-0.5 line-clamp-1">
                      {m.shortDescription}
                    </p>
                  </div>

                  <div className="shrink-0 flex items-center">
                    {isCompleted ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-100/80 px-2.5 py-1.5 rounded-xl border border-emerald-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>완료됨</span>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onQuickCompleteMission(m)}
                        className="min-h-[38px] px-3 py-1.5 rounded-xl bg-[#347A52] hover:bg-[#2b6443] text-white font-bold text-xs flex items-center gap-1 shadow-xs active:scale-95 transition-all"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>실천 완료</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. Primary Action CTA Button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={() => onChangeTab('explore')}
          className="w-full min-h-[50px] px-5 py-3.5 rounded-2xl bg-[#347A52] hover:bg-[#2b6443] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-[0.98] transition-all"
        >
          <Compass className="w-5 h-5" />
          <span>오늘의 지구 미션 시작하기</span>
          <ArrowRight className="w-4 h-4 ml-1" />
        </button>
      </div>
    </div>
  );
};
