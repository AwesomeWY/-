import React, { useState } from 'react';
import {
  X,
  ExternalLink,
  HelpCircle,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  Zap,
  Bike,
  Recycle,
  Droplets,
  UtensilsCrossed,
  Trees,
} from 'lucide-react';
import { Category, Mission } from '../../types';

interface CategoryDetailModalProps {
  category: Category | null;
  missions: Mission[];
  completedMissionIdsToday: string[];
  onClose: () => void;
  onSelectMission: (mission: Mission) => void;
  onAnswerQuiz: (quizId: string, isCorrect: boolean) => Promise<{ firstCorrectBonus: boolean; xpGained: number }>;
  isCategoryQuizAnswered: boolean;
}

const iconMap: Record<string, React.ElementType> = {
  Zap,
  Bike,
  Recycle,
  Droplets,
  UtensilsCrossed,
  Trees,
};

export const CategoryDetailModal: React.FC<CategoryDetailModalProps> = ({
  category,
  missions,
  completedMissionIdsToday,
  onClose,
  onSelectMission,
  onAnswerQuiz,
  isCategoryQuizAnswered,
}) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(isCategoryQuizAnswered);
  const [quizBonusGained, setQuizBonusGained] = useState<number | null>(null);

  if (!category) return null;

  const CategoryIcon = iconMap[category.iconName] || Zap;

  const handleQuizOptionClick = async (idx: number) => {
    if (quizSubmitted) return;
    setSelectedOption(idx);
    setQuizSubmitted(true);

    const isCorrect = idx === category.categoryQuiz.answerIndex;
    const res = await onAnswerQuiz(`category_${category.id}`, isCorrect);
    if (res.firstCorrectBonus) {
      setQuizBonusGained(res.xpGained);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="relative w-full sm:max-w-xl max-h-[92vh] flex flex-col rounded-t-3xl sm:rounded-3xl bg-white border border-stone-200 shadow-2xl overflow-hidden">
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4 border-b border-stone-100"
          style={{ backgroundColor: category.lightColor }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-xs"
              style={{ backgroundColor: category.color }}
            >
              <CategoryIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-900">
                {category.name}
              </h2>
              <p className="text-xs text-stone-600 line-clamp-1">
                {category.description}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center text-stone-600 hover:text-stone-900 rounded-xl"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
          {/* Cause and Effect Card */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-700 space-y-2 leading-relaxed">
            <h3 className="font-bold text-stone-900 text-sm">
              🔍 기후문제 원인과 영향
            </h3>
            <p>{category.causeAndEffect}</p>
            <div className="pt-2 border-t border-stone-200/80">
              <span className="font-semibold text-emerald-900">
                🌱 일상 속 해결 실천 방안:
              </span>{' '}
              <span>{category.actionsOverview}</span>
            </div>
          </div>

          {/* Category Quiz Card */}
          <div className="border border-amber-200/90 rounded-2xl p-4 bg-amber-50/50">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-amber-950 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-amber-700" />
                <span>분야 핵심 퀴즈</span>
              </h3>
              <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                정답 시 +5 XP
              </span>
            </div>

            <p className="text-xs font-semibold text-stone-800 mb-3">
              Q. {category.categoryQuiz.question}
            </p>

            <div className="space-y-1.5">
              {category.categoryQuiz.options.map((option, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === category.categoryQuiz.answerIndex;
                let btnStyle = 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50';

                if (quizSubmitted) {
                  if (isCorrect) {
                    btnStyle = 'bg-emerald-100 border-emerald-400 text-emerald-950 font-bold';
                  } else if (isSelected) {
                    btnStyle = 'bg-rose-100 border-rose-300 text-rose-950';
                  } else {
                    btnStyle = 'bg-stone-50 border-stone-100 text-stone-400 opacity-60';
                  }
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={quizSubmitted}
                    onClick={() => handleQuizOptionClick(idx)}
                    className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all ${btnStyle}`}
                  >
                    <span className="font-mono mr-1.5">{idx + 1}.</span>
                    <span>{option}</span>
                  </button>
                );
              })}
            </div>

            {quizSubmitted && (
              <div className="mt-3 p-2.5 rounded-xl bg-white border border-amber-200 text-xs text-stone-700 animate-in fade-in duration-200">
                <p className="font-semibold text-emerald-800 mb-0.5">
                  {selectedOption === category.categoryQuiz.answerIndex
                    ? '🎉 정답입니다!'
                    : '💡 정답 해설:'}
                </p>
                <p className="text-stone-600 text-[11px]">
                  {category.categoryQuiz.explanation}
                </p>
                {quizBonusGained !== null && (
                  <div className="mt-1.5 flex items-center gap-1 text-emerald-700 font-bold text-[11px]">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>퀴즈 보너스 +{quizBonusGained} XP가 적립되었습니다!</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Missions List (5 missions) */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-stone-900">
                실천 미션 ({missions.length}개)
              </h3>
              <span className="text-xs text-stone-500">
                터치하여 학습하고 실천하기
              </span>
            </div>

            <div className="space-y-2.5">
              {missions.map((m) => {
                const isCompleted = completedMissionIdsToday.includes(m.id);

                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => onSelectMission(m)}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                      isCompleted
                        ? 'bg-emerald-50/70 border-emerald-200 shadow-xs'
                        : 'bg-white border-stone-200 hover:border-emerald-300 hover:shadow-xs'
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-stone-900 truncate">
                          {m.title}
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 shrink-0">
                          +{m.xpReward} XP
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 line-clamp-1">
                        {m.shortDescription}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {isCompleted ? (
                        <div className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-white px-2.5 py-1 rounded-xl border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>완료</span>
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-xl bg-stone-100 flex items-center justify-center text-stone-500 group-hover:bg-emerald-100 group-hover:text-emerald-800 transition-colors">
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Official Source */}
          <div className="flex items-center justify-between text-xs text-stone-500 pt-2 border-t border-stone-200">
            <span>출처: {category.sourceName}</span>
            <a
              href={category.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-emerald-700 hover:underline"
            >
              <span>자료 확인</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
