import React, { useState } from 'react';
import { Info, X } from 'lucide-react';

export const NoticeBanner: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-amber-50/90 border border-amber-200/80 rounded-2xl p-3 text-xs text-amber-900 flex items-start gap-2.5 shadow-xs">
      <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
      <div className="flex-1 leading-relaxed">
        <p className="font-semibold text-amber-950">
          안내: 게임형 실천 보상 시스템
        </p>
        <p className="text-amber-800/90 mt-0.5 text-[11px]">
          앱 내에서 획득하는 경험치(XP)와 지구 환경의 변화는 지속 가능한 습관 형성을 위한 게임 속 상징적 보상이며, 실제 탄소감축량이나 정부 탄소중립포인트 법정 실적과 구분됩니다.
        </p>
      </div>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label="안내 닫기"
        className="text-amber-700 hover:text-amber-950 p-1 rounded-lg"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
