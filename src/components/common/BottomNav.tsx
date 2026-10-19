import React from 'react';
import { Home, Compass, CalendarCheck, Sparkles } from 'lucide-react';
import { ActiveTab } from '../../types';

interface BottomNavProps {
  activeTab: ActiveTab;
  onChangeTab: (tab: ActiveTab) => void;
  todayCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onChangeTab,
  todayCount,
}) => {
  const tabs = [
    {
      id: 'home' as ActiveTab,
      label: '홈',
      icon: Home,
    },
    {
      id: 'explore' as ActiveTab,
      label: '기후 탐험',
      icon: Compass,
    },
    {
      id: 'record' as ActiveTab,
      label: '실천 기록',
      icon: CalendarCheck,
      badge: todayCount > 0 ? todayCount : undefined,
    },
    {
      id: 'buddy' as ActiveTab,
      label: '나의 지구버디',
      icon: Sparkles,
    },
  ];

  return (
    <nav
      aria-label="하단 주 메뉴"
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#F8F7F0]/95 backdrop-blur-md border-t border-stone-200/80 pb-[env(safe-area-inset-bottom)]"
    >
      <div className="max-w-md mx-auto grid grid-cols-4 h-16 items-center px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChangeTab(tab.id)}
              className={`relative min-h-[48px] flex flex-col items-center justify-center rounded-2xl transition-all duration-200 ${
                isActive
                  ? 'text-[#347A52] font-bold'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'scale-110 stroke-[2.5]' : 'stroke-[1.8]'
                  }`}
                />
                {tab.badge !== undefined && (
                  <span className="absolute -top-1 -right-2 min-w-4 h-4 px-1 rounded-full bg-emerald-700 text-white text-[10px] font-bold flex items-center justify-center leading-none">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] mt-1 tracking-tight">
                {tab.label}
              </span>
              {isActive && (
                <div className="absolute bottom-1 w-4 h-1 rounded-full bg-[#347A52]" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
