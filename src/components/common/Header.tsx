import React from 'react';
import { Volume2, VolumeX, Settings, Sparkles } from 'lucide-react';
import { APP_CONFIG } from '../../config/appConfig';
import { LevelInfo } from '../../types';

interface HeaderProps {
  levelInfo: LevelInfo;
  totalXp: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  levelInfo,
  totalXp,
  soundEnabled,
  onToggleSound,
  onOpenSettings,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#F8F7F0]/95 backdrop-blur-md border-b border-stone-200/80 px-4 py-3 sm:px-6">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-xl bg-[#347A52] flex items-center justify-center text-white shadow-xs font-bold text-sm">
            🌱
          </div>
          <div>
            <h1 className="text-base font-bold text-stone-900 leading-tight">
              {APP_CONFIG.appName}
            </h1>
            <p className="text-[10px] text-stone-500 font-medium">
              {APP_CONFIG.appNameEnglish}
            </p>
          </div>
        </div>

        {/* Zone 2: Level & XP HUD Badge */}
        <div className="flex items-center gap-2 bg-white/90 border border-stone-200/80 rounded-full px-3 py-1 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span className="text-xs font-bold text-emerald-800">
            Lv.{levelInfo.level}
          </span>
          <span className="text-stone-300">·</span>
          <span className="text-xs font-mono font-semibold text-stone-700 tabular-nums">
            {totalXp.toLocaleString()} XP
          </span>
        </div>

        {/* Zone 3: Actions (Sound toggle & Settings) */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={onToggleSound}
            aria-label={soundEnabled ? '효과음 끄기' : '효과음 켜기'}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-200/60 transition-colors"
          >
            {soundEnabled ? (
              <Volume2 className="w-5 h-5 text-emerald-700" />
            ) : (
              <VolumeX className="w-5 h-5 text-stone-400" />
            )}
          </button>

          <button
            type="button"
            onClick={onOpenSettings}
            aria-label="데이터 관리 및 설정"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-200/60 transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
