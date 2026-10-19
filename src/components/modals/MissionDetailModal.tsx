import React, { useState } from 'react';
import {
  X,
  Clock,
  ExternalLink,
  CheckCircle2,
  BookOpen,
  HelpCircle,
  Sparkles,
  ChevronDown,
  RotateCcw,
} from 'lucide-react';
import { Mission, Category } from '../../types';

interface MissionDetailModalProps {
  mission: Mission | null;
  category: Category | null;
  isCompletedToday: boolean;
  onClose: () => void;
  onComplete: (mission: Mission) => void;
  onCancelComplete: (missionId: string) => void;
  onAnswerQuiz: (quizId: string, isCorrect: boolean) => Promise<{ firstCorrectBonus: boolean; xpGained: number }>;
  isQuizAnswered: boolean;
}

export const MissionDetailModal: React.FC<MissionDetailModalProps> = ({
  mission,
  category,
  isCompletedToday,
  onClose,
  onComplete,
  onCancelComplete,
  onAnswerQuiz,
  isQuizAnswered,
}) => {
  const [activeLearningTab, setActiveLearningTab] = useState<'easy' | 'detailed' | 'deep'>('easy');
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(isQuizAnswered);
  const [quizBonusGained, setQuizBonusGained] = useState<number | null>(null);
  const [checkedSteps, setCheckedSteps] = useState<Record<number, boolean>>({});

  if (!mission) return null;

  const toggleStep = (idx: number) => {
    setCheckedSteps((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleOptionClick = async (idx: number) => {
    if (quizSubmitted) return;
    setSelectedOption(idx);
    setQuizSubmitted(true);

    const isCorrect = idx === mission.quiz.answerIndex;
    const res = await onAnswerQuiz(`mission_${mission.id}`, isCorrect);
    if (res.firstCorrectBonus) {
      setQuizBonusGained(res.xpGained);
    }
  };

  const difficultyLabel = {
    easy: '쉬움 (+10 XP)',
    medium: '보통 (+15 XP)',
    hard: '도전 (+20 XP)',
  }[mission.difficulty];

  const difficultyColor = {
    easy: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    medium: 'text-amber-700 bg-amber-50 border-amber-200',
    hard: 'text-rose-700 bg-rose-50 border-rose-200',
  }[mission.difficulty];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="mission-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="relative w-full sm:max-w-xl max-h-[92vh] flex flex-col rounded-t-3xl sm:rounded-3xl bg-white border border-stone-200 shadow-2xl overflow-hidden">
        {/* Sticky Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100 bg-[#F8F7F0]/90">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-800">
              {category?.name || '기후 실천'}
            </span>
            <span className="text-stone-300">·</span>
            <span
              className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${difficultyColor}`}
            >
              {difficultyLabel}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center text-stone-400 hover:text-stone-700 rounded-xl"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
          {/* Title & Core Problem */}
          <div>
            <h2 id="mission-title" className="text-xl font-bold text-stone-900 tracking-tight">
              {mission.title}
            </h2>
            <p className="text-sm text-stone-600 mt-1 leading-relaxed">
              {mission.shortDescription}
            </p>

            <div className="flex flex-wrap items-center gap-2 mt-3">
              <span className="inline-flex items-center gap-1 text-xs text-stone-500 bg-stone-100 px-2.5 py-1 rounded-lg">
                <Clock className="w-3.5 h-3.5" />
                <span>예상 소요시간: {mission.estimatedTime}</span>
              </span>

              <span
                className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg font-medium ${
                  mission.impactType === 'mitigation'
                    ? 'bg-emerald-100/70 text-emerald-900 border border-emerald-200'
                    : 'bg-sky-100/70 text-sky-900 border border-sky-200'
                }`}
              >
                <span>
                  {mission.impactType === 'mitigation'
                    ? '🌱 온실가스 감축 (Mitigation)'
                    : '🛡️ 기후변화 적응 (Adaptation)'}
                </span>
              </span>
            </div>
          </div>

          {/* Impact Explainer */}
          <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-xs text-emerald-950 leading-relaxed">
            <p className="font-semibold text-emerald-900 mb-1">
              💡 왜 이 실천이 지구에 필요할까요?
            </p>
            <p>{mission.explanation}</p>
          </div>

          {/* Action Steps */}
          <div>
            <h3 className="text-sm font-bold text-stone-900 mb-2 flex items-center gap-1.5">
              <span>실천 행동 가이드</span>
              <span className="text-xs font-normal text-stone-500">
                (직접 확인해 보세요)
              </span>
            </h3>
            <div className="space-y-2">
              {mission.actionSteps.map((step, idx) => {
                const isChecked = !!checkedSteps[idx];
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => toggleStep(idx)}
                    className={`w-full text-left p-3 rounded-xl border text-xs flex items-start gap-2.5 transition-colors ${
                      isChecked
                        ? 'bg-emerald-50/80 border-emerald-300 text-emerald-900 font-medium'
                        : 'bg-stone-50/80 border-stone-200 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    <CheckCircle2
                      className={`w-4 h-4 mt-0.5 shrink-0 ${
                        isChecked ? 'text-emerald-700' : 'text-stone-300'
                      }`}
                    />
                    <span className="leading-snug">{step}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3-Level Learning Content */}
          <div className="border border-stone-200 rounded-2xl p-4 bg-stone-50/50">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-emerald-700" />
                <span>1분 기후 학습</span>
              </h3>
              {/* Level Segmented Selector */}
              <div className="flex items-center gap-1 bg-stone-200/70 p-1 rounded-xl text-xs font-medium">
                <button
                  type="button"
                  onClick={() => setActiveLearningTab('easy')}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    activeLearningTab === 'easy'
                      ? 'bg-white text-stone-900 shadow-xs font-bold'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  쉬운 설명
                </button>
                <button
                  type="button"
                  onClick={() => setActiveLearningTab('detailed')}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    activeLearningTab === 'detailed'
                      ? 'bg-white text-stone-900 shadow-xs font-bold'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  자세한 설명
                </button>
                <button
                  type="button"
                  onClick={() => setActiveLearningTab('deep')}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    activeLearningTab === 'deep'
                      ? 'bg-white text-stone-900 shadow-xs font-bold'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  심화 탐구
                </button>
              </div>
            </div>

            <div className="text-xs text-stone-700 leading-relaxed min-h-[60px]">
              {activeLearningTab === 'easy' && (
                <p className="bg-white p-3 rounded-xl border border-stone-200/80">
                  {mission.learningContent.easy}
                </p>
              )}
              {activeLearningTab === 'detailed' && (
                <p className="bg-white p-3 rounded-xl border border-stone-200/80">
                  {mission.learningContent.detailed}
                </p>
              )}
              {activeLearningTab === 'deep' && (
                <div className="bg-white p-3 rounded-xl border border-stone-200/80 space-y-2">
                  <p>{mission.learningContent.deep}</p>
                  <a
                    href={mission.learningContent.deepLink || mission.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-semibold hover:underline"
                  >
                    <span>공식 과학 보고서 및 자료 보기</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* 1-Minute Quiz */}
          <div className="border border-amber-200/90 rounded-2xl p-4 bg-amber-50/40">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-amber-950 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-amber-700" />
                <span>1분 이해도 퀴즈</span>
              </h3>
              <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                정답 시 +5 XP
              </span>
            </div>

            <p className="text-xs font-semibold text-stone-800 mb-3">
              Q. {mission.quiz.question}
            </p>

            <div className="space-y-1.5">
              {mission.quiz.options.map((option, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === mission.quiz.answerIndex;
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
                    onClick={() => handleOptionClick(idx)}
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
                  {selectedOption === mission.quiz.answerIndex
                    ? '🎉 정답입니다!'
                    : '💡 정답 해설을 확인해 보세요:'}
                </p>
                <p className="text-stone-600 text-[11px]">
                  {mission.quiz.explanation}
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

          {/* Official Source Reference */}
          <div className="flex items-center justify-between text-xs text-stone-500 pt-1">
            <span>출처: {mission.sourceName}</span>
            <a
              href={mission.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-emerald-700 hover:underline"
            >
              <span>원문 링크</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Fixed Footer CTA */}
        <div className="px-5 py-4 border-t border-stone-200 bg-white">
          {isCompletedToday ? (
            <div className="flex items-center gap-2">
              <div className="flex-1 min-h-[48px] px-4 py-3 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-900 font-bold text-xs flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>오늘 이미 실천 완료되었습니다!</span>
              </div>
              <button
                type="button"
                onClick={() => onCancelComplete(mission.id)}
                title="실천 기록 취소하기"
                className="min-h-[48px] px-3 py-3 rounded-2xl border border-stone-200 bg-stone-50 text-stone-600 hover:text-stone-900 text-xs flex items-center gap-1 font-medium transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>취소</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => onComplete(mission)}
              className="w-full min-h-[50px] px-4 py-3 rounded-2xl bg-[#347A52] hover:bg-[#2b6443] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-[0.98] transition-all"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>오늘의 행동 실천 완료 (+{mission.xpReward} XP)</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
