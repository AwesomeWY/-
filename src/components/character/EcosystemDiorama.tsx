import React from 'react';
import { EarthCharacter } from './EarthCharacter';
import { LevelInfo } from '../../types';

interface EcosystemDioramaProps {
  levelInfo: LevelInfo;
  totalXp: number;
  xpInCurrentLevel: number;
  xpNeededForNext: number;
  progressPercent: number;
  onCharacterClick?: () => void;
}

export const EcosystemDiorama: React.FC<EcosystemDioramaProps> = ({
  levelInfo,
  totalXp,
  xpInCurrentLevel,
  xpNeededForNext,
  progressPercent,
  onCharacterClick,
}) => {
  const level = levelInfo.level;

  // Background sky gradients according to level
  const getSkyGradient = () => {
    switch (level) {
      case 1:
        return 'from-amber-100 via-stone-100 to-emerald-50'; // quiet twilight / dawn
      case 2:
        return 'from-sky-100 via-emerald-50 to-amber-50'; // morning sunshine
      case 3:
        return 'from-sky-200 via-teal-100 to-emerald-100'; // fresh clear sky
      case 4:
        return 'from-cyan-200 via-sky-100 to-emerald-100'; // bright vibrant noon
      case 5:
        return 'from-blue-200 via-emerald-100 to-green-100'; // lush green ecosystem
      case 6:
      default:
        return 'from-indigo-200 via-sky-200 to-emerald-200'; // paradise blue earth
    }
  };

  return (
    <div className={`relative overflow-hidden rounded-3xl border border-stone-200/80 bg-gradient-to-b ${getSkyGradient()} p-6 shadow-sm transition-all duration-700`}>
      {/* Sun / Sky elements */}
      <div className="absolute top-4 right-6 pointer-events-none">
        {level <= 2 ? (
          // Soft morning sun
          <div className="w-12 h-12 rounded-full bg-amber-200/60 blur-xs flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-amber-300" />
          </div>
        ) : level <= 4 ? (
          // Bright radiating sun
          <div className="relative">
            <div className="w-14 h-14 rounded-full bg-amber-400/30 animate-pulse" />
            <div className="absolute inset-2 rounded-full bg-amber-400" />
          </div>
        ) : (
          // Solar glow with rays
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-amber-300/40 animate-spin duration-1000" />
            <div className="absolute inset-2.5 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-200 shadow-md" />
          </div>
        )}
      </div>

      {/* Clouds */}
      <div className="absolute top-6 left-6 opacity-60 pointer-events-none">
        <svg width="64" height="24" viewBox="0 0 64 24" fill="#FFFFFF">
          <path d="M 12 18 A 10 10 0 0 1 28 12 A 12 12 0 0 1 48 10 A 9 9 0 0 1 58 18 Z" />
        </svg>
      </div>
      {level >= 3 && (
        <div className="absolute top-12 right-24 opacity-50 pointer-events-none">
          <svg width="48" height="18" viewBox="0 0 48 18" fill="#FFFFFF">
            <path d="M 8 14 A 8 8 0 0 1 22 10 A 10 10 0 0 1 38 8 A 7 7 0 0 1 44 14 Z" />
          </svg>
        </div>
      )}

      {/* Floating Rainbow for Level 6 */}
      {level === 6 && (
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-72 h-36 border-t-8 border-rose-300/60 rounded-t-full pointer-events-none">
          <div className="w-full h-full border-t-8 border-amber-300/60 rounded-t-full mt-1">
            <div className="w-full h-full border-t-8 border-emerald-300/60 rounded-t-full mt-1" />
          </div>
        </div>
      )}

      {/* Stage Badge & Title */}
      <div className="relative z-10 flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-800 text-white shadow-xs">
            Lv.{levelInfo.level}
          </span>
          <h2 className="text-base font-bold text-stone-900 tracking-tight">
            {levelInfo.name}
          </h2>
        </div>
        <div className="text-right">
          <span className="text-xs font-semibold text-emerald-900">
            총 {totalXp.toLocaleString()} XP
          </span>
        </div>
      </div>

      {/* Center Character Area */}
      <div
        onClick={onCharacterClick}
        className="relative z-10 flex flex-col items-center justify-center py-2 cursor-pointer group"
        title="캐릭터를 터치해 보세요!"
      >
        <EarthCharacter
          level={level}
          size="lg"
          className="transition-transform duration-300 group-hover:scale-105 active:scale-95"
        />

        {/* Character Title / Speech bubble */}
        <div className="mt-3 text-center">
          <p className="text-sm font-semibold text-stone-800">
            "{levelInfo.characterTitle}"
          </p>
          <p className="text-xs text-stone-600 mt-0.5 max-w-xs mx-auto line-clamp-1">
            {levelInfo.description}
          </p>
        </div>
      </div>

      {/* Dynamic Ground & Flora Decor */}
      <div className="relative z-0 mt-3 pt-3 border-t border-stone-200/50">
        <div className="flex items-center justify-between text-xs text-stone-600 mb-1.5 font-medium">
          <span>성장 진행률</span>
          <span className="font-mono tabular-nums">
            {levelInfo.nextRequiredXp
              ? `${xpInCurrentLevel} / ${xpNeededForNext} XP (${progressPercent}%)`
              : '최고 레벨 달성!'}
          </span>
        </div>

        {/* XP Progress Bar */}
        <div className="w-full h-3.5 bg-stone-200/80 rounded-full overflow-hidden p-0.5 shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-emerald-600 via-green-500 to-lime-400 rounded-full transition-all duration-500 shadow-xs"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Decorative Environmental Details at bottom */}
      <div className="mt-3 flex items-center justify-around text-xs text-stone-600 pt-1">
        <div className="flex items-center gap-1">
          <span className="text-emerald-700">🌱</span>
          <span>생태계 건강도 {Math.min(100, Math.round((totalXp / 1000) * 100))}%</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-sky-700">💧</span>
          <span>맑은 공기·물 {level >= 3 ? '풍부함' : '회복 중'}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-amber-700">🦋</span>
          <span>생물다양성 {level >= 5 ? '번성' : level >= 2 ? '발견' : '잠자는 중'}</span>
        </div>
      </div>
    </div>
  );
};
