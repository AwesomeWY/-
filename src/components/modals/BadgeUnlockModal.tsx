import React, { useEffect } from 'react';
import { Award, Sparkles, X } from 'lucide-react';
import { Badge } from '../../types';
import { triggerEcoConfetti } from '../../utils/confetti';

interface BadgeUnlockModalProps {
  badge: Badge | null;
  onClose: () => void;
}

export const BadgeUnlockModal: React.FC<BadgeUnlockModalProps> = ({ badge, onClose }) => {
  useEffect(() => {
    if (badge) {
      triggerEcoConfetti();
    }
  }, [badge]);

  if (!badge) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-sm rounded-3xl bg-white border border-stone-200 shadow-2xl p-6 text-center overflow-hidden">
        <button
          type="button"
          onClick={onClose}
          aria-label="닫기"
          className="absolute top-4 right-4 min-h-[44px] min-w-[44px] flex items-center justify-center text-stone-400 hover:text-stone-700"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold mb-3">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>새로운 배지 획득!</span>
        </div>

        <div className="my-4 flex justify-center">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-amber-50 to-emerald-50 border-2 border-amber-300 p-4 flex items-center justify-center shadow-md animate-bounce duration-700">
            <Award className="w-12 h-12 text-[#347A52]" />
          </div>
        </div>

        <h3 className="text-xl font-extrabold text-stone-900">
          {badge.title}
        </h3>

        <p className="text-xs text-stone-600 leading-relaxed mt-2 mb-6 px-4">
          {badge.description}
        </p>

        <button
          type="button"
          onClick={onClose}
          className="w-full min-h-[48px] px-4 py-3 rounded-2xl bg-[#347A52] text-white font-bold text-sm shadow-md hover:bg-[#2b6443] active:scale-[0.98] transition-all"
        >
          확인
        </button>
      </div>
    </div>
  );
};
