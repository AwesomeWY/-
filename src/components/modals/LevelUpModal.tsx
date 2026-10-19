import React, { useEffect } from 'react';
import { Sparkles, Trophy, ArrowRight } from 'lucide-react';
import { LevelInfo } from '../../types';
import { EarthCharacter } from '../character/EarthCharacter';
import { triggerEcoConfetti } from '../../utils/confetti';

interface LevelUpModalProps {
  levelInfo: LevelInfo | null;
  onClose: () => void;
}

export const LevelUpModal: React.FC<LevelUpModalProps> = ({ levelInfo, onClose }) => {
  useEffect(() => {
    if (levelInfo) {
      triggerEcoConfetti();
    }
  }, [levelInfo]);

  if (!levelInfo) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="levelup-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-sm rounded-3xl bg-white border border-stone-200 shadow-2xl p-6 text-center overflow-hidden">
        {/* Decorative Top Sunburst */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-48 bg-gradient-to-b from-amber-200/40 via-emerald-100/30 to-transparent rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold mb-3">
            <Trophy className="w-3.5 h-3.5 text-amber-600" />
            <span>레벨 업 축하합니다!</span>
          </div>

          <h3 id="levelup-title" className="text-xl font-extrabold text-stone-900">
            Lv.{levelInfo.level} {levelInfo.name}
          </h3>

          <p className="text-xs text-emerald-800 font-semibold mt-1">
            "{levelInfo.characterTitle}"
          </p>

          {/* New Character Illustration */}
          <div className="my-5 flex justify-center">
            <div className="w-36 h-36 rounded-full bg-gradient-to-tr from-emerald-50 to-teal-50 border-2 border-emerald-200/80 p-2 flex items-center justify-center shadow-inner">
              <EarthCharacter level={levelInfo.level} size="lg" animate={true} />
            </div>
          </div>

          <p className="text-xs text-stone-600 leading-relaxed px-2 bg-stone-50 border border-stone-100 rounded-2xl p-3 mb-5">
            {levelInfo.unlockMessage}
          </p>

          <button
            type="button"
            onClick={onClose}
            className="w-full min-h-[48px] px-4 py-3 rounded-2xl bg-[#347A52] hover:bg-[#2b6443] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-[0.98] transition-all"
          >
            <span>멋져요! 계속 실천하기</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
