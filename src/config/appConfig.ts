import { LevelInfo, Badge } from '../types';

export const APP_CONFIG = {
  // 앱 서비스명 및 기본 정보 (추후 변경 시 이 파일의 값을 변경)
  appName: '지구편',
  appNameEnglish: 'Team Earth',
  fullAppName: '지구편 (Team Earth)',
  slogan: '작은 실천으로 지구의 편이 되자!',
  description: '기후변화 문제를 배우고 일상 속 작은 행동을 실천하며 지구 캐릭터를 성장시키는 게임형 기후행동 웹앱',
  targetAudience: '초등학생부터 성인까지 전 연령',
  
  // 색상 팔레트 상수
  colors: {
    primary: '#347A52',      // 포레스트 그린
    secondary: '#A8CEAC',    // 세이지 민트
    background: '#F8F7F0',   // 크림 아이보리
    accent: '#F3CF70',       // 선샤인 옐로우
    ocean: '#A9D8EE',        // 클린 스카이/오션
    alert: '#E9A293',        // 피치 코랄 경고
    textDark: '#1E293B',
    textMuted: '#64748B',
  },

  // 경험치 지급 정책
  xpRewards: {
    quizCorrect: 5,           // 퀴즈 정답 (+5 XP, 최초 1회)
    missionEasy: 10,          // 쉬운 미션 (+10 XP)
    missionMedium: 15,        // 보통 미션 (+15 XP)
    missionHard: 20,          // 도전 미션 (+20 XP)
    weeklyChallengeBonus: 20, // 주간 3개 카테고리 실천 보너스 (+20 XP)
  },

  // 레벨 단계별 필요 누적 경험치 및 메타데이터
  levels: [
    {
      level: 1,
      name: '씨앗 (Seed)',
      characterTitle: '희망을 품은 작은 씨앗',
      requiredXp: 0,
      nextRequiredXp: 50,
      description: '아직은 땅속에 있지만, 지구를 지키겠다는 따뜻한 마음이 싹틀 준비를 마쳤어요.',
      unlockMessage: '지구편의 첫 걸음을 뗀 당신! 작은 씨앗에서 큰 생명이 자라납니다.',
    },
    {
      level: 2,
      name: '새싹 (Sprout)',
      characterTitle: '햇살을 마주한 파릇한 새싹',
      requiredXp: 50,
      nextRequiredXp: 150,
      description: '부지런한 첫 실천들 덕분에 초록빛 여린 새싹이 흙을 뚫고 솟아올랐어요!',
      unlockMessage: '축하합니다! 새싹이 돋아나 작은 탄소를 흡수하기 시작했습니다.',
    },
    {
      level: 3,
      name: '잎사귀 (Leaf)',
      characterTitle: '바람에 춤추는 싱그러운 잎사귀',
      requiredXp: 150,
      nextRequiredXp: 350,
      description: '광합성을 하며 산소를 뿜어내는 잎사귀들이 무성해지고 주변 환경이 맑아집니다.',
      unlockMessage: '대단해요! 튼튼한 잎사귀가 자라 시원한 그늘과 맑은 공기를 만듭니다.',
    },
    {
      level: 4,
      name: '작은 나무 (Sapling)',
      characterTitle: '뿌리를 깊게 내린 작은 묘목',
      requiredXp: 350,
      nextRequiredXp: 650,
      description: '단단한 줄기를 세우고 동물 친구들에게 쉼터가 되어주는 듬직한 묘목입니다.',
      unlockMessage: '멋져요! 작은 묘목이 되어 더 많은 이산화탄소를 흡수하고 숲의 터전을 닦습니다.',
    },
    {
      level: 5,
      name: '큰 나무 (Big Tree)',
      characterTitle: '숲을 품은 커다란 수호 나무',
      requiredXp: 650,
      nextRequiredXp: 1000,
      description: '깊은 뿌리와 풍성한 나뭇가지로 가뭄과 폭염을 막아주는 믿음직한 숲의 수호자입니다.',
      unlockMessage: '놀라워요! 거대한 수호목이 되어 마을과 자연 생태계를 지켜주고 있습니다.',
    },
    {
      level: 6,
      name: '푸른 지구 (Blue Earth)',
      characterTitle: '살아 숨 쉬는 찬란한 푸른 지구',
      requiredXp: 1000,
      nextRequiredXp: null,
      description: '당신의 꾸준한 실천으로 가상 지구의 바다와 숲이 가장 건강하고 푸르게 빛납니다.',
      unlockMessage: '최고 레벨 달성! 당신은 진정한 지구편(Team Earth)의 명예 환경 챔피언입니다!',
    },
  ] as LevelInfo[],

  // 배지 정의
  badges: [
    {
      id: 'team_join',
      title: '지구팀 합류',
      description: '생애 첫 친환경 실천 미션을 완료했습니다.',
      iconName: 'Sparkles',
      color: '#347A52',
    },
    {
      id: 'streak_3days',
      title: '3일 도전자',
      description: '서로 다른 3일에 걸쳐 꾸준히 실천했습니다.',
      iconName: 'Flame',
      color: '#F3CF70',
    },
    {
      id: 'energy_guardian',
      title: '에너지 수호자',
      description: '폭염·에너지 관련 미션을 5회 이상 실천했습니다.',
      iconName: 'Zap',
      color: '#E9A293',
    },
    {
      id: 'land_and_sea',
      title: '육지와 바다의 친구',
      description: '3개 이상의 서로 다른 분야에서 실천을 완료했습니다.',
      iconName: 'Compass',
      color: '#A9D8EE',
    },
    {
      id: 'earth_explorer',
      title: '지구탐험 대원',
      description: '6개 기후 카테고리의 모든 분야에서 실천을 달성했습니다.',
      iconName: 'Award',
      color: '#347A52',
    },
  ] as Badge[],

  // 신뢰할 수 있는 공식 참고 기관
  officialSources: [
    { name: 'UN ActNow (유엔 기후행동 10대 실천)', url: 'https://www.un.org/en/actnow/ten-actions' },
    { name: 'IPCC (기후변화에 관한 정부간 협의체)', url: 'https://www.ipcc.ch/' },
    { name: '기상청 기후정보포털', url: 'https://www.climate.go.kr/' },
    { name: '환경부 탄소중립포인트', url: 'https://cpoint.or.kr/netzero/main.do' },
  ],
};
