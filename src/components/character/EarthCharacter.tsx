import React from 'react';

interface EarthCharacterProps {
  level: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  animate?: boolean;
}

export const EarthCharacter: React.FC<EarthCharacterProps> = ({
  level,
  size = 'md',
  className = '',
  animate = true,
}) => {
  const sizeMap = {
    sm: 'w-16 h-16',
    md: 'w-28 h-28',
    lg: 'w-44 h-44',
    xl: 'w-60 h-60',
  };

  const animClass = animate ? 'animate-bounce duration-1000' : '';

  // Render SVG based on level (1 to 6)
  const renderIllustration = () => {
    switch (level) {
      case 1:
        // Lv 1: 귀여운 씨앗 (Seed)
        return (
          <svg viewBox="0 0 160 160" className="w-full h-full drop-shadow-md">
            {/* Ground shadow */}
            <ellipse cx="80" cy="142" rx="35" ry="8" fill="#D7D3C5" />
            
            {/* Soil patch */}
            <path d="M 45 135 Q 80 148 115 135 Q 80 125 45 135" fill="#8C6D58" />

            {/* Seed Body */}
            <path
              d="M 80 45 C 50 75 48 120 80 135 C 112 120 110 75 80 45 Z"
              fill="#A27B5C"
              stroke="#6B4F3B"
              strokeWidth="4"
              strokeLinejoin="round"
            />
            {/* Seed Belly patch */}
            <path
              d="M 80 65 C 62 88 60 115 80 126 C 100 115 98 88 80 65 Z"
              fill="#DCD7C9"
            />

            {/* Tiny green top sprout bud */}
            <path
              d="M 80 45 C 80 30 70 20 62 24 C 60 35 75 42 80 45 Z"
              fill="#65A30D"
              stroke="#4D7C0F"
              strokeWidth="2.5"
            />
            <path
              d="M 80 45 C 83 28 95 24 98 32 C 95 40 85 43 80 45 Z"
              fill="#84CC16"
              stroke="#4D7C0F"
              strokeWidth="2.5"
            />

            {/* Eyes (Happy sleepy / smiling) */}
            <path
              d="M 68 92 Q 74 97 78 92"
              fill="none"
              stroke="#2D241E"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            <path
              d="M 82 92 Q 86 97 92 92"
              fill="none"
              stroke="#2D241E"
              strokeWidth="3.5"
              strokeLinecap="round"
            />

            {/* Cheeks */}
            <circle cx="62" cy="98" r="5" fill="#F472B6" opacity="0.6" />
            <circle cx="98" cy="98" r="5" fill="#F472B6" opacity="0.6" />

            {/* Small Mouth */}
            <path
              d="M 77 104 Q 80 108 83 104"
              fill="none"
              stroke="#2D241E"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        );

      case 2:
        // Lv 2: 새싹 (Sprout)
        return (
          <svg viewBox="0 0 160 160" className="w-full h-full drop-shadow-md">
            {/* Ground shadow */}
            <ellipse cx="80" cy="144" rx="40" ry="8" fill="#D7D3C5" />

            {/* Sprout Stem */}
            <path
              d="M 80 140 Q 80 105 80 85"
              stroke="#4D7C0F"
              strokeWidth="12"
              strokeLinecap="round"
            />

            {/* Left Leaf */}
            <path
              d="M 78 90 C 45 80 32 50 48 38 C 66 32 78 65 78 90 Z"
              fill="#84CC16"
              stroke="#4D7C0F"
              strokeWidth="3"
            />
            {/* Left Leaf vein */}
            <path d="M 76 80 Q 56 62 48 44" stroke="#4D7C0F" strokeWidth="2" fill="none" />

            {/* Right Leaf */}
            <path
              d="M 82 90 C 115 80 128 50 112 38 C 94 32 82 65 82 90 Z"
              fill="#A3E635"
              stroke="#4D7C0F"
              strokeWidth="3"
            />
            {/* Right Leaf vein */}
            <path d="M 84 80 Q 104 62 112 44" stroke="#4D7C0F" strokeWidth="2" fill="none" />

            {/* Sprout Head (cute round buddy) */}
            <circle cx="80" cy="105" r="28" fill="#FACC15" stroke="#CA8A04" strokeWidth="3.5" />

            {/* Eyes */}
            <circle cx="70" cy="102" r="3.5" fill="#1E293B" />
            <circle cx="72" cy="100.5" r="1.2" fill="#FFFFFF" />
            <circle cx="90" cy="102" r="3.5" fill="#1E293B" />
            <circle cx="92" cy="100.5" r="1.2" fill="#FFFFFF" />

            {/* Cheeks */}
            <circle cx="63" cy="110" r="5" fill="#FB7185" opacity="0.65" />
            <circle cx="97" cy="110" r="5" fill="#FB7185" opacity="0.65" />

            {/* Joyful open mouth */}
            <path
              d="M 75 112 Q 80 120 85 112 Z"
              fill="#DC2626"
            />
          </svg>
        );

      case 3:
        // Lv 3: 잎사귀 (Leaf)
        return (
          <svg viewBox="0 0 160 160" className="w-full h-full drop-shadow-md">
            {/* Ground shadow */}
            <ellipse cx="80" cy="144" rx="42" ry="9" fill="#D7D3C5" />

            {/* Plant Pot / Soil */}
            <path
              d="M 52 142 L 60 112 L 100 112 L 108 142 Z"
              fill="#A27B5C"
              stroke="#6B4F3B"
              strokeWidth="3"
            />
            <ellipse cx="80" cy="112" rx="22" ry="5" fill="#583E26" />

            {/* Big Leaf Body */}
            <path
              d="M 80 110 C 35 90 40 35 80 18 C 120 35 125 90 80 110 Z"
              fill="#22C55E"
              stroke="#15803D"
              strokeWidth="4"
              strokeLinejoin="round"
            />
            {/* Leaf Veins */}
            <path d="M 80 25 L 80 105" stroke="#16A34A" strokeWidth="3" fill="none" />
            <path d="M 80 45 Q 60 40 50 35" stroke="#16A34A" strokeWidth="2.5" fill="none" />
            <path d="M 80 45 Q 100 40 110 35" stroke="#16A34A" strokeWidth="2.5" fill="none" />
            <path d="M 80 65 Q 58 60 46 55" stroke="#16A34A" strokeWidth="2.5" fill="none" />
            <path d="M 80 65 Q 102 60 114 55" stroke="#16A34A" strokeWidth="2.5" fill="none" />
            <path d="M 80 85 Q 62 82 55 78" stroke="#16A34A" strokeWidth="2.5" fill="none" />
            <path d="M 80 85 Q 98 82 105 78" stroke="#16A34A" strokeWidth="2.5" fill="none" />

            {/* Morning Dewdrop */}
            <circle cx="102" cy="45" r="4.5" fill="#67E8F9" stroke="#0891B2" strokeWidth="1.5" />
            <circle cx="100.5" cy="43.5" r="1.5" fill="#FFFFFF" />

            {/* Face in center of leaf */}
            <circle cx="71" cy="68" r="4" fill="#0F172A" />
            <circle cx="73" cy="66.5" r="1.5" fill="#FFFFFF" />
            <circle cx="89" cy="68" r="4" fill="#0F172A" />
            <circle cx="91" cy="66.5" r="1.5" fill="#FFFFFF" />

            {/* Rosy Cheeks */}
            <circle cx="62" cy="74" r="5.5" fill="#F472B6" opacity="0.75" />
            <circle cx="98" cy="74" r="5.5" fill="#F472B6" opacity="0.75" />

            {/* Smiling mouth */}
            <path
              d="M 75 76 Q 80 84 85 76"
              fill="none"
              stroke="#0F172A"
              strokeWidth="2.8"
              strokeLinecap="round"
            />
          </svg>
        );

      case 4:
        // Lv 4: 작은 나무 (Sapling)
        return (
          <svg viewBox="0 0 160 160" className="w-full h-full drop-shadow-md">
            {/* Ground shadow */}
            <ellipse cx="80" cy="144" rx="46" ry="10" fill="#D7D3C5" />

            {/* Tree Trunk & Roots */}
            <path
              d="M 70 142 L 72 95 Q 80 92 88 95 L 90 142 Z"
              fill="#854D0E"
              stroke="#713F12"
              strokeWidth="3"
            />
            <path d="M 72 135 Q 60 142 55 144" stroke="#713F12" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M 88 135 Q 100 142 105 144" stroke="#713F12" strokeWidth="3" fill="none" strokeLinecap="round" />

            {/* Foliage Clusters (Lush Green Puff) */}
            <circle cx="58" cy="68" r="24" fill="#16A34A" />
            <circle cx="102" cy="68" r="24" fill="#16A34A" />
            <circle cx="80" cy="46" r="28" fill="#22C55E" />
            <circle cx="80" cy="72" r="28" fill="#4ADE80" stroke="#15803D" strokeWidth="3.5" />

            {/* Cute Flowers in hair/crown */}
            <circle cx="56" cy="48" r="5" fill="#F43F5E" />
            <circle cx="56" cy="48" r="2" fill="#FDE047" />
            <circle cx="104" cy="50" r="5" fill="#38BDF8" />
            <circle cx="104" cy="50" r="2" fill="#FDE047" />

            {/* Face on Tree Crown */}
            <circle cx="70" cy="74" r="4.5" fill="#0F172A" />
            <circle cx="72" cy="72" r="1.5" fill="#FFFFFF" />
            <circle cx="90" cy="74" r="4.5" fill="#0F172A" />
            <circle cx="92" cy="72" r="1.5" fill="#FFFFFF" />

            <circle cx="61" cy="80" r="5" fill="#FB7185" opacity="0.7" />
            <circle cx="99" cy="80" r="5" fill="#FB7185" opacity="0.7" />

            {/* W-Smile */}
            <path
              d="M 74 81 Q 77 86 80 82 Q 83 86 86 81"
              fill="none"
              stroke="#0F172A"
              strokeWidth="2.8"
              strokeLinecap="round"
            />
          </svg>
        );

      case 5:
        // Lv 5: 큰 나무 (Big Tree Guardian)
        return (
          <svg viewBox="0 0 160 160" className="w-full h-full drop-shadow-lg">
            {/* Ground shadow */}
            <ellipse cx="80" cy="146" rx="52" ry="10" fill="#D7D3C5" />

            {/* Strong Ancient Trunk */}
            <path
              d="M 64 144 L 68 85 Q 80 80 92 85 L 96 144 Z"
              fill="#78350F"
              stroke="#451A03"
              strokeWidth="3.5"
            />
            {/* Trunk Wood Rings / Texture */}
            <path d="M 75 100 Q 80 108 85 100" stroke="#92400E" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M 74 120 Q 80 128 86 120" stroke="#92400E" strokeWidth="2" fill="none" strokeLinecap="round" />
            
            {/* Branches */}
            <path d="M 68 95 Q 46 88 40 75" stroke="#78350F" strokeWidth="7" fill="none" strokeLinecap="round" />
            <path d="M 92 95 Q 114 88 120 75" stroke="#78350F" strokeWidth="7" fill="none" strokeLinecap="round" />

            {/* Little bird resting on branch */}
            <ellipse cx="38" cy="70" rx="6" ry="4.5" fill="#38BDF8" />
            <circle cx="35" cy="67" r="3.5" fill="#0284C7" />
            <polygon points="31,67 28,68 31,70" fill="#F59E0B" />

            {/* Massive Lush Canopy */}
            <circle cx="48" cy="60" r="26" fill="#15803D" />
            <circle cx="112" cy="60" r="26" fill="#15803D" />
            <circle cx="80" cy="38" r="32" fill="#16A34A" />
            <circle cx="58" cy="42" r="25" fill="#22C55E" />
            <circle cx="102" cy="42" r="25" fill="#22C55E" />
            <circle cx="80" cy="62" r="32" fill="#4ADE80" stroke="#166534" strokeWidth="3.5" />

            {/* Guardian Wise Eyes */}
            <circle cx="70" cy="62" r="4.5" fill="#0F172A" />
            <circle cx="72" cy="60" r="1.5" fill="#FFFFFF" />
            <circle cx="90" cy="62" r="4.5" fill="#0F172A" />
            <circle cx="92" cy="60" r="1.5" fill="#FFFFFF" />

            <circle cx="60" cy="68" r="6" fill="#F472B6" opacity="0.6" />
            <circle cx="100" cy="68" r="6" fill="#F472B6" opacity="0.6" />

            {/* Warm Friendly Smile */}
            <path
              d="M 72 70 Q 80 82 88 70"
              fill="none"
              stroke="#0F172A"
              strokeWidth="3.2"
              strokeLinecap="round"
            />

            {/* Golden Leaf Crown Halo */}
            <polygon points="80,14 82,18 86,18 83,21 84,25 80,23 76,25 77,21 74,18 78,18" fill="#FACC15" />
          </svg>
        );

      case 6:
      default:
        // Lv 6: 푸른 지구 (Blue Earth Champion)
        return (
          <svg viewBox="0 0 160 160" className="w-full h-full drop-shadow-xl">
            {/* Sparkling Aura Ring */}
            <circle cx="80" cy="80" r="68" fill="none" stroke="#67E8F9" strokeWidth="3" strokeDasharray="6 4" opacity="0.75" />
            <circle cx="80" cy="80" r="62" fill="#BAE6FD" opacity="0.3" />

            {/* Earth Planet Base (Oceans) */}
            <circle
              cx="80"
              cy="80"
              r="54"
              fill="#0284C7"
              stroke="#0369A1"
              strokeWidth="4"
            />

            {/* Continents (Lush Green Lands) */}
            {/* Top Continent */}
            <path
              d="M 50 55 Q 65 42 85 45 Q 100 48 108 58 Q 112 72 95 72 Q 80 75 70 65 Z"
              fill="#22C55E"
            />
            {/* Bottom Right Continent */}
            <path
              d="M 90 92 Q 105 85 118 95 Q 124 110 110 120 Q 95 125 88 112 Z"
              fill="#16A34A"
            />
            {/* Left Small Island */}
            <ellipse cx="45" cy="88" rx="8" ry="6" fill="#4ADE80" />

            {/* Polar Ice Cap (Healthy Arctic & Antarctic) */}
            <path d="M 68 28 Q 80 34 92 28 Q 80 26 68 28" fill="#F0F9FF" />
            <path d="M 66 132 Q 80 126 94 132 Q 80 134 66 132" fill="#F0F9FF" />

            {/* Crown of Leaves and Flowers */}
            <path
              d="M 60 32 C 60 20 72 15 80 26 C 88 15 100 20 100 32 Z"
              fill="#84CC16"
              stroke="#4D7C0F"
              strokeWidth="2"
            />
            <circle cx="80" cy="22" r="4.5" fill="#F59E0B" />
            <circle cx="80" cy="22" r="2" fill="#FEF08A" />

            {/* Expressive Friendly Face */}
            <circle cx="68" cy="82" r="5" fill="#0F172A" />
            <circle cx="70.5" cy="79.5" r="2" fill="#FFFFFF" />
            <circle cx="92" cy="82" r="5" fill="#0F172A" />
            <circle cx="94.5" cy="79.5" r="2" fill="#FFFFFF" />

            {/* Rosy Peach Cheeks */}
            <circle cx="58" cy="90" r="7" fill="#F43F5E" opacity="0.6" />
            <circle cx="102" cy="90" r="7" fill="#F43F5E" opacity="0.6" />

            {/* Beaming Joyful Smile */}
            <path
              d="M 72 92 Q 80 104 88 92"
              fill="none"
              stroke="#0F172A"
              strokeWidth="3.5"
              strokeLinecap="round"
            />

            {/* Little Stars / Sparkles around Earth */}
            <polygon points="32,38 34,42 38,42 35,45 36,49 32,47 28,49 29,45 26,42 30,42" fill="#FACC15" />
            <polygon points="128,42 130,45 133,45 131,48 132,51 128,49 125,51 126,48 123,45 126,45" fill="#FACC15" />
            <polygon points="124,118 126,121 129,121 127,123 128,126 124,124 121,126 122,123 120,121 122,121" fill="#38BDF8" />
          </svg>
        );
    }
  };

  return (
    <div className={`relative inline-flex items-center justify-center ${sizeMap[size]} ${className}`}>
      <div className={`w-full h-full ${animClass}`}>
        {renderIllustration()}
      </div>
    </div>
  );
};
