import React, { useState } from 'react';
import {
  Trophy,
  Award,
  Sparkles,
  Lock,
  CheckCircle2,
  Edit3,
  Check,
  Zap,
  Flame,
  Compass,
} from 'lucide-react';
import { UserProfile, Badge } from '../../types';
import { APP_CONFIG } from '../../config/appConfig';
import { GameStats } from '../../services/storage';
import { EarthCharacter } from '../character/EarthCharacter';

interface BuddyViewProps {
  stats: GameStats;
  profile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
  onOpenBadge: (badge: Badge) => void;
}

const badgeIconMap: Record<string, React.ElementType> = {
  Sparkles,
  Flame,
  Zap,
  Compass,
  Award,
};

export const BuddyView: React.FC<BuddyViewProps> = ({
  stats,
  profile,
  onUpdateProfile,
  onOpenBadge,
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(profile.nickname);

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) return;
    onUpdateProfile({ ...profile, nickname: nameInput.trim() });
    setIsEditingName(false);
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* 1. Main Buddy Showcase Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-emerald-100/70 via-stone-50 to-white border border-stone-200/90 p-6 shadow-2xs text-center">
        {/* Top Nickname edit */}
        <div className="flex items-center justify-center gap-1.5 mb-2">
          {isEditingName ? (
            <form onSubmit={handleSaveName} className="flex items-center gap-1.5">
              <input
                type="text"
                maxLength={12}
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="px-2.5 py-1 text-xs border border-stone-300 rounded-lg text-center font-bold"
                autoFocus
              />
              <button
                type="submit"
                className="p-1 rounded-lg bg-stone-900 text-white"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
            </form>
          ) : (
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-extrabold text-stone-900">
                {profile.nickname}의 파트너
              </span>
              <button
                type="button"
                onClick={() => setIsEditingName(true)}
                aria-label="닉네임 수정"
                className="text-stone-400 hover:text-stone-700 p-1"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Large Character Avatar */}
        <div className="my-3 flex justify-center">
          <div className="w-40 h-40 rounded-full bg-white/90 border-2 border-emerald-200 p-3 flex items-center justify-center shadow-xs">
            <EarthCharacter level={stats.currentLevel.level} size="xl" animate={true} />
          </div>
        </div>

        {/* Level & Title */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#347A52] text-white text-xs font-bold">
            <Trophy className="w-3.5 h-3.5" />
            <span>Lv.{stats.currentLevel.level} {stats.currentLevel.name}</span>
          </div>
          <h3 className="text-base font-bold text-stone-900 mt-1">
            "{stats.currentLevel.characterTitle}"
          </h3>
          <p className="text-xs text-stone-600 max-w-sm mx-auto leading-relaxed">
            {stats.currentLevel.description}
          </p>
        </div>

        {/* Level XP Bar */}
        <div className="mt-5 p-4 rounded-2xl bg-white border border-stone-200/80 text-left space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-stone-700">경험치 진행률</span>
            <span className="font-mono font-bold text-emerald-800 tabular-nums">
              {stats.nextLevel
                ? `${stats.xpInCurrentLevel} / ${stats.xpNeededForNext} XP (${stats.progressPercent}%)`
                : '최고 레벨 (푸른 지구)'}
            </span>
          </div>

          <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-gradient-to-r from-emerald-600 to-lime-500 rounded-full transition-all duration-500"
              style={{ width: `${stats.progressPercent}%` }}
            />
          </div>

          <p className="text-[11px] text-stone-500 text-center font-mono tabular-nums">
            {stats.nextLevel
              ? `다음 레벨(${stats.nextLevel.name})까지 ${stats.xpNeededForNext - stats.xpInCurrentLevel} XP 남음`
              : '모든 환경 진화를 완료했습니다!'}
          </p>
        </div>
      </div>

      {/* 2. Character Evolution Dex (6 Stages) */}
      <div className="p-5 rounded-3xl bg-white border border-stone-200/90 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-700" />
            <span>캐릭터 성장 도감</span>
          </h3>
          <span className="text-xs font-mono font-bold text-stone-500 tabular-nums">
            {stats.currentLevel.level} / 6 단계 해금
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {APP_CONFIG.levels.map((lvl) => {
            const isUnlocked = stats.totalXp >= lvl.requiredXp;
            const isCurrent = stats.currentLevel.level === lvl.level;

            return (
              <div
                key={lvl.level}
                className={`p-3 rounded-2xl border text-center relative transition-all ${
                  isCurrent
                    ? 'bg-emerald-50/70 border-emerald-400 ring-2 ring-emerald-500/20'
                    : isUnlocked
                    ? 'bg-white border-stone-200'
                    : 'bg-stone-50 border-stone-200 opacity-60'
                }`}
              >
                <div className="w-16 h-16 mx-auto mb-2 flex items-center justify-center">
                  {isUnlocked ? (
                    <EarthCharacter level={lvl.level} size="sm" animate={false} />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-stone-200 flex items-center justify-center text-stone-400">
                      <Lock className="w-5 h-5" />
                    </div>
                  )}
                </div>

                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold text-emerald-800 font-mono">
                    Lv.{lvl.level}
                  </span>
                  <p className="text-xs font-bold text-stone-900 truncate">
                    {lvl.name.split(' ')[0]}
                  </p>
                  <p className="text-[10px] text-stone-500 font-mono tabular-nums">
                    {lvl.requiredXp} XP
                  </p>
                </div>

                {isUnlocked && (
                  <div className="absolute top-2 right-2 text-emerald-600">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Achievement Badges Gallery (5 Badges) */}
      <div className="p-5 rounded-3xl bg-white border border-stone-200/90 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-600" />
            <span>업적 배지 갤러리</span>
          </h3>
          <span className="text-xs font-mono font-bold text-amber-800 tabular-nums">
            {stats.unlockedBadgeIds.length} / {APP_CONFIG.badges.length} 획득
          </span>
        </div>

        <div className="space-y-2">
          {APP_CONFIG.badges.map((b) => {
            const isUnlocked = stats.unlockedBadgeIds.includes(b.id);
            const Icon = badgeIconMap[b.iconName] || Award;

            return (
              <div
                key={b.id}
                onClick={() => onOpenBadge(b)}
                className={`p-3.5 rounded-2xl border transition-all flex items-center gap-3.5 cursor-pointer ${
                  isUnlocked
                    ? 'bg-amber-50/50 border-amber-200/90 hover:bg-amber-50 shadow-2xs'
                    : 'bg-stone-50/60 border-stone-200 opacity-60 hover:opacity-80'
                }`}
              >
                <div
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-xs ${
                    isUnlocked
                      ? 'bg-gradient-to-tr from-amber-400 to-yellow-300 text-stone-900'
                      : 'bg-stone-200 text-stone-400'
                  }`}
                >
                  {isUnlocked ? (
                    <Icon className="w-5 h-5" />
                  ) : (
                    <Lock className="w-4 h-4" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h4 className="text-xs font-bold text-stone-900">
                      {b.title}
                    </h4>
                    {isUnlocked ? (
                      <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded-md">
                        달성
                      </span>
                    ) : (
                      <span className="text-[10px] text-stone-400">
                        잠김
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-stone-500 line-clamp-1">
                    {b.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
