import React, { useState } from 'react';
import {
  Zap,
  Bike,
  Recycle,
  Droplets,
  UtensilsCrossed,
  Trees,
  Search,
  ChevronRight,
  ShieldAlert,
  Leaf,
  CheckCircle2,
} from 'lucide-react';
import { Category, Mission } from '../../types';
import { CATEGORIES_DATA } from '../../data/categoriesData';

interface ExploreViewProps {
  missions: Mission[];
  completedMissionIdsToday: string[];
  onSelectCategory: (category: Category) => void;
  onSelectMission: (mission: Mission) => void;
}

const iconMap: Record<string, React.ElementType> = {
  Zap,
  Bike,
  Recycle,
  Droplets,
  UtensilsCrossed,
  Trees,
};

export const ExploreView: React.FC<ExploreViewProps> = ({
  missions,
  completedMissionIdsToday,
  onSelectCategory,
  onSelectMission,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'mitigation' | 'adaptation'>('all');

  // Filtered missions for search
  const filteredMissions = missions.filter((m) => {
    const matchesSearch =
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || m.impactType === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Title & Introduction */}
      <div>
        <h2 className="text-xl font-extrabold text-stone-900 tracking-tight">
          기후 탐험 & 30대 실천
        </h2>
        <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">
          6대 핵심 기후 위기 분야를 배우고 일상 속 30개 검증된 행동 퀘스트를 실천해 보세요.
        </p>
      </div>

      {/* Search & Filter Controls */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="미션 또는 기후 키워드 검색 (예: 텀블러, 에어컨, 걷기)"
            className="w-full pl-9 pr-3 py-2.5 text-xs bg-white border border-stone-200 rounded-2xl focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
          />
        </div>

        {/* Impact Type Filter */}
        <div className="flex items-center gap-1.5 p-1 bg-stone-200/70 rounded-xl text-xs font-medium">
          <button
            type="button"
            onClick={() => setFilterType('all')}
            className={`flex-1 py-1.5 px-3 rounded-lg text-center transition-colors ${
              filterType === 'all'
                ? 'bg-white text-stone-900 shadow-2xs font-bold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            전체 분야
          </button>
          <button
            type="button"
            onClick={() => setFilterType('mitigation')}
            className={`flex-1 py-1.5 px-3 rounded-lg text-center transition-colors flex items-center justify-center gap-1 ${
              filterType === 'mitigation'
                ? 'bg-white text-emerald-900 shadow-2xs font-bold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Leaf className="w-3 h-3 text-emerald-600" />
            <span>온실가스 감축</span>
          </button>
          <button
            type="button"
            onClick={() => setFilterType('adaptation')}
            className={`flex-1 py-1.5 px-3 rounded-lg text-center transition-colors flex items-center justify-center gap-1 ${
              filterType === 'adaptation'
                ? 'bg-white text-sky-900 shadow-2xs font-bold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <ShieldAlert className="w-3 h-3 text-sky-600" />
            <span>기후변화 적응</span>
          </button>
        </div>
      </div>

      {/* When search active, show filtered missions list */}
      {searchQuery || filterType !== 'all' ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-stone-600">
            <span>검색 결과: {filteredMissions.length}개 미션</span>
            {(searchQuery || filterType !== 'all') && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setFilterType('all');
                }}
                className="text-emerald-700 font-semibold hover:underline"
              >
                필터 초기화
              </button>
            )}
          </div>

          {filteredMissions.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-3xl border border-stone-200 text-stone-500 text-xs">
              검색 조건에 맞는 실천 미션이 없습니다.
            </div>
          ) : (
            <div className="space-y-2">
              {filteredMissions.map((m) => {
                const isCompleted = completedMissionIdsToday.includes(m.id);
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => onSelectMission(m)}
                    className="w-full text-left p-3.5 rounded-2xl bg-white border border-stone-200 hover:border-emerald-300 transition-all flex items-center justify-between gap-3 shadow-2xs"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs font-bold text-stone-900 truncate">
                          {m.title}
                        </span>
                        <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                          +{m.xpReward} XP
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 line-clamp-1">
                        {m.shortDescription}
                      </p>
                    </div>

                    {isCompleted ? (
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg shrink-0 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>완료</span>
                      </span>
                    ) : (
                      <ChevronRight className="w-4 h-4 text-stone-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* Default: 6 Categories Grid */
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-stone-900">
            6대 기후·환경 카테고리
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {CATEGORIES_DATA.map((cat) => {
              const Icon = iconMap[cat.iconName] || Zap;
              const catMissions = missions.filter((m) => m.categoryId === cat.id);
              const completedCount = catMissions.filter((m) =>
                completedMissionIdsToday.includes(m.id)
              ).length;

              return (
                <div
                  key={cat.id}
                  onClick={() => onSelectCategory(cat)}
                  className="group relative p-4 rounded-3xl bg-white border border-stone-200/90 hover:border-stone-400/80 shadow-2xs hover:shadow-xs cursor-pointer transition-all flex flex-col justify-between overflow-hidden"
                >
                  {/* Subtle Accent Glow */}
                  <div
                    className="absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-20 pointer-events-none"
                    style={{ backgroundColor: cat.color }}
                  />

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform"
                        style={{ backgroundColor: cat.color }}
                      >
                        <Icon className="w-6 h-6" />
                      </div>

                      <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-full bg-stone-100 text-stone-700 tabular-nums">
                        {completedCount} / {catMissions.length} 완료
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-stone-900 group-hover:text-emerald-800 transition-colors">
                      {cat.name}
                    </h4>

                    <p className="text-xs text-stone-600 mt-1 leading-relaxed line-clamp-2">
                      {cat.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-emerald-800">
                    <span>1분 학습 & 5개 퀘스트 보기</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
