import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Flame,
  Award,
  Calendar,
  CheckCircle2,
  RotateCcw,
  BookOpen,
  Send,
  Download,
} from 'lucide-react';
import { ActionLog, DailyReflection, Mission } from '../../types';
import { CATEGORIES_DATA } from '../../data/categoriesData';
import { getTodayString } from '../../services/storage';

interface RecordViewProps {
  actionLogs: ActionLog[];
  reflections: DailyReflection[];
  missions: Mission[];
  streakDays: number;
  onCancelAction: (logId: string) => void;
  onSaveReflection: (dateStr: string, note: string) => void;
  onOpenBackup: () => void;
}

export const RecordView: React.FC<RecordViewProps> = ({
  actionLogs,
  reflections,
  missions,
  streakDays,
  onCancelAction,
  onSaveReflection,
  onOpenBackup,
}) => {
  const todayStr = getTodayString();
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedDateStr, setSelectedDateStr] = useState<string>(todayStr);
  const [reflectionInput, setReflectionInput] = useState('');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed

  // Calendar dates math
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0: Sun, 1: Mon
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Create dates set for quick lookup
  const actionDatesSet = new Set(actionLogs.map((l) => l.dateString));

  // Current selected day's logs
  const selectedDayLogs = actionLogs.filter((l) => l.dateString === selectedDateStr);

  // Current selected day's reflection
  const currentReflection = reflections.find((r) => r.dateString === selectedDateStr);

  // Month navigation
  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleSaveReflection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reflectionInput.trim()) return;
    onSaveReflection(selectedDateStr, reflectionInput.trim());
    setReflectionInput('');
  };

  // Category counts
  const catCountMap: Record<string, number> = {};
  for (const log of actionLogs) {
    catCountMap[log.categoryId] = (catCountMap[log.categoryId] || 0) + 1;
  }

  // Monthly stats
  const currentMonthPrefix = `${year}-${String(month + 1).padStart(2, '0')}`;
  const thisMonthLogsCount = actionLogs.filter((l) =>
    l.dateString.startsWith(currentMonthPrefix)
  ).length;

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Title & Streak Badge */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-stone-900 tracking-tight">
            나의 실천 기록 & 달력
          </h2>
          <p className="text-xs text-stone-600 mt-0.5">
            지구를 위해 행동한 하루하루를 에코 스탬프로 기록해요.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenBackup}
          className="min-h-[40px] px-3 py-1.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-xs font-semibold text-stone-700 flex items-center gap-1.5 shadow-2xs"
        >
          <Download className="w-3.5 h-3.5 text-emerald-700" />
          <span>백업</span>
        </button>
      </div>

      {/* Overview Stat Strip */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="p-3 rounded-2xl bg-white border border-stone-200 shadow-2xs text-center">
          <div className="flex items-center justify-center gap-1 text-amber-500 mb-0.5">
            <Flame className="w-4 h-4 fill-amber-400" />
            <span className="text-xs font-bold text-amber-950">연속 실천</span>
          </div>
          <p className="text-lg font-bold text-stone-900 font-mono tabular-nums">
            {streakDays}일
          </p>
        </div>

        <div className="p-3 rounded-2xl bg-white border border-stone-200 shadow-2xs text-center">
          <div className="flex items-center justify-center gap-1 text-emerald-600 mb-0.5">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-xs font-bold text-emerald-950">이번 달</span>
          </div>
          <p className="text-lg font-bold text-stone-900 font-mono tabular-nums">
            {thisMonthLogsCount}회
          </p>
        </div>

        <div className="p-3 rounded-2xl bg-white border border-stone-200 shadow-2xs text-center">
          <div className="flex items-center justify-center gap-1 text-sky-600 mb-0.5">
            <Award className="w-4 h-4" />
            <span className="text-xs font-bold text-sky-950">총 누적</span>
          </div>
          <p className="text-lg font-bold text-stone-900 font-mono tabular-nums">
            {actionLogs.length}회
          </p>
        </div>
      </div>

      {/* Calendar Card */}
      <div className="p-5 rounded-3xl bg-white border border-stone-200/90 shadow-2xs">
        {/* Month Header Navigation */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-700" />
            <h3 className="text-base font-bold text-stone-900 font-mono">
              {year}년 {month + 1}월
            </h3>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={prevMonth}
              aria-label="이전 달"
              className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl text-stone-600 hover:bg-stone-100 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={nextMonth}
              aria-label="다음 달"
              className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl text-stone-600 hover:bg-stone-100 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Days of Week Header */}
        <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-stone-400 mb-2">
          <span className="text-rose-400">일</span>
          <span>월</span>
          <span>화</span>
          <span>수</span>
          <span>목</span>
          <span>금</span>
          <span className="text-sky-400">토</span>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Empty cells before month start */}
          {Array.from({ length: firstDayOfMonth }).map((_, idx) => (
            <div key={`empty-${idx}`} className="h-10" />
          ))}

          {/* Actual days */}
          {Array.from({ length: daysInMonth }).map((_, idx) => {
            const dayNum = idx + 1;
            const dayStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
            const hasAction = actionDatesSet.has(dayStr);
            const isSelected = selectedDateStr === dayStr;
            const isToday = todayStr === dayStr;

            return (
              <button
                key={dayNum}
                type="button"
                onClick={() => setSelectedDateStr(dayStr)}
                className={`relative h-11 rounded-2xl flex flex-col items-center justify-center text-xs transition-all ${
                  isSelected
                    ? 'bg-stone-900 text-white font-bold shadow-xs'
                    : isToday
                    ? 'bg-emerald-50 text-emerald-900 font-bold border border-emerald-300'
                    : 'text-stone-700 hover:bg-stone-100'
                }`}
              >
                <span>{dayNum}</span>

                {/* Eco Stamp Indicator */}
                {hasAction && (
                  <span
                    className={`w-1.5 h-1.5 rounded-full mt-0.5 ${
                      isSelected ? 'bg-emerald-400' : 'bg-emerald-600'
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day's Mission Log Details */}
      <div className="p-5 rounded-3xl bg-white border border-stone-200/90 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-stone-900">
              {selectedDateStr === todayStr ? '오늘' : selectedDateStr}의 실천
            </span>
            <span className="text-xs font-mono font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md tabular-nums">
              {selectedDayLogs.length}개 완료
            </span>
          </div>
        </div>

        {selectedDayLogs.length === 0 ? (
          <div className="text-center py-6 text-stone-500 text-xs space-y-1">
            <p className="font-semibold text-stone-700">
              이 날짜에는 아직 실천 기록이 없어요.
            </p>
            <p className="text-stone-400 text-[11px]">
              오늘의 기후 탐험에서 작은 행동 하나를 실천해 볼까요?
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {selectedDayLogs.map((log) => {
              const mission = missions.find((m) => m.id === log.missionId);
              const category = CATEGORIES_DATA.find((c) => c.id === log.categoryId);

              return (
                <div
                  key={log.id}
                  className="p-3 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-[10px] font-semibold text-stone-600">
                        {category?.name || '기후실천'}
                      </span>
                      <span className="text-stone-300">·</span>
                      <span className="text-[10px] font-bold text-emerald-800">
                        +{log.xpGained} XP
                      </span>
                    </div>
                    <p className="font-bold text-stone-900 truncate">
                      {mission?.title || '완료된 미션'}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => onCancelAction(log.id)}
                    title="기록 취소하기"
                    className="p-2 rounded-xl text-stone-400 hover:text-rose-600 hover:bg-stone-200/60 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Daily Reflection Note */}
        <div className="pt-3 border-t border-stone-100 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-stone-800">
            <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
            <span>오늘의 자기 성찰 한마디</span>
          </div>

          {currentReflection ? (
            <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-950">
              <p className="leading-relaxed">"{currentReflection.note}"</p>
            </div>
          ) : (
            <form onSubmit={handleSaveReflection} className="flex gap-2">
              <input
                type="text"
                value={reflectionInput}
                onChange={(e) => setReflectionInput(e.target.value)}
                placeholder="오늘 실천하며 느낀 점이나 다짐을 한 줄로 적어보세요."
                className="flex-1 px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
              />
              <button
                type="submit"
                disabled={!reflectionInput.trim()}
                className="px-3 py-2 rounded-xl bg-stone-900 text-white font-semibold text-xs hover:bg-stone-800 disabled:opacity-40 transition-colors flex items-center gap-1"
              >
                <Send className="w-3 h-3" />
                <span>저장</span>
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Category Distribution Breakdown */}
      <div className="p-5 rounded-3xl bg-white border border-stone-200/90 shadow-2xs space-y-3">
        <h3 className="text-sm font-bold text-stone-900">
          분야별 실천 분포
        </h3>

        <div className="space-y-2.5">
          {CATEGORIES_DATA.map((cat) => {
            const count = catCountMap[cat.id] || 0;
            const maxCount = Math.max(1, ...Object.values(catCountMap));
            const barWidth = Math.round((count / maxCount) * 100);

            return (
              <div key={cat.id} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-stone-700">{cat.name}</span>
                  <span className="font-mono font-bold text-stone-900 tabular-nums">
                    {count}회
                  </span>
                </div>
                <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${barWidth}%`,
                      backgroundColor: cat.color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
