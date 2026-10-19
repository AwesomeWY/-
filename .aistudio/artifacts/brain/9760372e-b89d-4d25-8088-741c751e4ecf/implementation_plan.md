# 지구편 (Team Earth) - 게임형 기후변화 실천 웹앱

초등학생부터 성인까지 누구나 기후변화 문제를 즐겁게 배우고, 일상 속 작은 친환경 행동을 실천하며 자신만의 귀여운 지구 캐릭터를 단계별로 성장시키는 게이미피케이션 실천 웹 애플리케이션입니다.

### User Review & Critical Decisions

> [!IMPORTANT]
> 사전 질의응답을 통해 확정된 결정 사항과 기본 설계 원칙입니다.
> - **공식 서비스명**: **지구편 (Team Earth)** (설정 파일 `src/config/appConfig.ts`에서 브랜드명, 슬로건, 기본 메타데이터 중앙 관리)
> - **캐릭터 아트 디렉션**: 귀여운 새싹/묘목/지구 버디 벡터 일러스트레이션 (씨앗 → 새싹 → 잎사귀 → 작은 나무 → 큰 나무 → 푸른 지구 6단계 진화 및 단계별 주변 환경 바이옴 시각화)
> - **오디오 피드백**: 브라우저 Web Audio API 기반의 합성 사운드 효과음 (퀘스트 완료음, 레벨업 팡파르, 퀴즈 정답/오답음) 탑재 및 상단 오디오 음소거/켜기 토글 지원
> - **환경 안내 고지**: 앱 내 획득 XP 및 레벨은 게이미피케이션 상징 점수이며, 국가 탄소중립포인트나 법적 감축량과 구분됨을 안내 배너로 명시

---

### 1. Overview & Core Concept

- **목적 및 가치**: 기후변화에 대한 막연한 불안감이나 무력감을 해소하고, "1분 학습 → 미션 선택 → 일상 실천 → 경험치(XP) 획득 → 지구 캐릭터 진화"라는 보상 루프를 통해 지속 가능한 친환경 생활 습관을 유도합니다.
- **타깃 사용자**: 환경 교육을 받는 초·중·고등학생부터 친환경 실천에 관심 있는 성인 및 가정.
- **핵심 게임 사이클**:
  1. **탐색 & 학습**: 6대 기후 분야(에너지, 교통, 자원, 물, 식생활, 숲) 중 관심 영역 선택 후 쉬운 설명/상세 설명/심화 탐구 3단계 학습 및 1분 퀴즈 풀기.
  2. **미션 퀘스트 수행**: 난이도별(쉬움 +10XP, 보통 +15XP, 도전 +20XP) 총 30개 검증된 미션 중 실천 후 원클릭 기록.
  3. **성장과 보상**: 실시간 누적 XP 반영, 레벨업(Lv.1 씨앗 ~ Lv.6 푸른 지구) 팝업, 축하 효과, 5대 업적 배지 획득.
  4. **지속적 회고**: 월간 캘린더 잔디 및 통계, 주간 챌린지(3개 카테고리 실천 시 +20XP 보너스), 데일리 추천 미션 2~3개.

---

### 2. User Experience & Visual Design

#### Key User Flows
1. **첫 방문 & 온보딩**: 회원가입 없이 닉네임 입력 후 Lv.1 '씨앗' 버디와 함께 시작.
2. **홈 화면 (대시보드)**:
   - 오늘의 따뜻한 인사말과 현재 레벨/XP 게이지.
   - 중앙의 반응형 가상 지구 환경과 귀여운 캐릭터 (레벨에 따라 꽃, 나무, 맑은 하늘이 살아남).
   - 오늘의 추천 퀘스트 2~3개 (즉시 실천 완료 가능).
   - 주간 챌린지 달성 현황(서로 다른 카테고리 실천 카운트) 및 오늘의 실천 현황 요약.
   - '오늘의 지구 미션 시작하기' 메인 CTA.
3. **기후 탐험 화면**:
   - 6개 기후 카테고리 그리드 (폭염·에너지, 이동·교통, 쓰레기·자원, 물·가뭄, 음식·식생활, 숲·생태계).
   - 카테고리 상세 모달/뷰: 기후문제 발생 원인 및 영향, 감축(Mitigation)과 적응(Adaptation) 구분, 1분 퀴즈(최초 정답 시 +5XP), 카테고리별 5개 실천 미션(총 30개) 카드 및 UN ActNow / IPCC / 기상청 공식 출처 링크.
4. **실천 기록 화면**:
   - 인터랙티브 월간 캘린더 (실천한 날짜에 에코 스탬프 표시).
   - 선택한 날짜의 실천 미션 타임라인.
   - 통계 지표: 연속 실천일(Streak), 누적 미션 수, 카테고리별 레이더/바 분포.
   - 오늘을 돌아보는 1줄 성찰 메모 기능.
   - 데이터 관리(JSON 내보내기/가져오기 및 초기화).
5. **나의 지구버디 (도감 및 룸)**:
   - 6단계 캐릭터 진화 도감 (씨앗, 새싹, 잎사귀, 작은 나무, 큰 나무, 푸른 지구).
   - 5대 업적 배지 룸 (지구팀 합류, 3일 도전자, 에너지 수호자, 육지와 바다의 친구, 지구탐험 대원) 및 획득/잠금 상세.
   - 가상 지구 환경 디오라마 뷰.

#### Visual Identity & Theme
- **Color Tokens**:
  - Dominant Neutral (60%): 크림 베이지 `#F8F7F0`, 청정 백색 `#FFFFFF`, 소프트 텍스트 `#2D3748`.
  - Structural Surfaces (30%): 포레스트 그린 `#347A52`, 세이지 민트 `#A8CEAC`, 오션 블루 `#A9D8EE`.
  - Focal Accents (10%): 선샤인 옐로우 `#F3CF70`, 알림/경고 피치코랄 `#E9A293`.
- **Typography**: Pretendard / Noto Sans KR 시스템 폰트 기반. 가독성 높은 헤드라인, 큰 터치 타깃($\ge 44\text{px}$), 숫자 데이터의 `font-mono tabular-nums`.
- **Motion & Sound**:
  - 미션 완료 시 경쾌한 팅글 사운드와 함께 화면 중앙 마이크로 파티클 팝업.
  - 레벨업 시 팡파르 멜로디 및 축하 카드 모달.
  - 모션 축소 모드(`prefers-reduced-motion`) 대응.

---

### 3. Key Product Decisions & Trade-Offs

1. **로컬 스토리지 & IndexedDB 기반 무계험 온보딩**:
   - *결정*: 별도 서버 회원가입 없이 브라우저 `IndexedDB` (idb/kv 래퍼)와 `localStorage`를 결합하여 데이터를 영구 보존.
   - *이유*: 초등학생 등 전 연령층이 개인정보 입력 없이 즉시 플레이 가능하며, 네트워크 단절 상태에서도 완벽 동작.
   - *데이터 백업*: 언제든 기기를 옮길 수 있도록 원클릭 JSON 내보내기 및 복구 기능 기본 내장.
2. **트랜잭션 기반 XP 재계산 엔진 (Event-Sourced Score Integrity)**:
   - *결정*: 단순 단일 숫자가 아닌 `action_logs` 배열을 원천 진실(Single Source of Truth)로 삼아 XP, 레벨, 배지, 연속 실천일을 자동 계산.
   - *이유*: 미션 취소, 중복 클릭 시도, 날짜 변경 시에도 경험치가 어긋나지 않고 100% 정합성을 보장.
   - *어뷰징 방지*: 동일 미션은 1일 1회만 XP 지급, 퀴즈는 문제별 최초 정답 1회만 XP 지급.
3. **Web Audio API 프로그래밍 방식 사운드 생성**:
   - *결정*: 외부 대용량 MP3 파일에 의존하지 않고 Web Audio API 오실레이터(Sine/Triangle)로 맑고 경쾌한 8비트/차임 효과음을 합성.
   - *이유*: 외부 네트워크 리소스 로딩 지연 및 실패 위험이 0%이며, 볼륨/음소거 제어가 즉각적.

---

### 4. Technical Architecture & Data Strategy

```
┌─────────────────────────────────────────────────────────────────┐
│                      지구편 (Team Earth) App                    │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ Navigation Header: Brand Wordmark · Audio Mute · Level HUD│  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ Active View Router (4 Core Tabs)                          │  │
│  │  1. HomeScreen: Virtual Earth · Daily Quests · Weekly Bar │  │
│  │  2. ExploreScreen: 6 Climate Categories · 30 Missions     │  │
│  │  3. LogScreen: Monthly Calendar · Streak · JSON Backup    │  │
│  │  4. BuddyScreen: Character Evolution Dex · Badges Gallery │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ State & Gamification Engine (Event-Sourced Actions)       │  │
│  │  • Action Logs (date, missionId, xp, categoryId)          │  │
│  │  • Quiz Answers (quizId, correct, date)                   │  │
│  │  • Daily & Weekly Challenge Evaluator                     │  │
│  │  • Level & Badge Resolver (50, 150, 350, 650, 1000 XP)    │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                │                                │
│                                ▼                                │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ Persistence Layer: IndexedDB Storage + JSON Backup/Export │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                │                                │
│                                ▼                                │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ Sound Engine: Web Audio API Synthesizer (Success/Levelup) │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ Bottom Navigation Bar (Home · Explore · Records · Buddy)  │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

#### Core Data Models
- **Mission**: `id`, `categoryId`, `title`, `shortDescription`, `climateProblem`, `explanation`, `actionSteps[]`, `difficulty` ('easy'|'medium'|'hard'), `xpReward` (10|15|20), `impactType` ('mitigation'|'adaptation'), `estimatedTime`, `learningContent` (easy, detailed, deep), `quiz` (question, options, answerIndex, explanation), `sourceUrl`.
- **Category**: `id`, `name`, `iconName`, `color`, `description`, `causeAndEffect`, `actionsOverview`.
- **ActionRecord**: `id`, `missionId`, `categoryId`, `timestamp`, `dateString` (YYYY-MM-DD), `xpGained`, `reflectionNote?`.
- **UserProfile**: `nickname`, `joinedDate`, `soundEnabled`, `activeCharacterTheme`.
- **Badge**: `id`, `title`, `description`, `icon`, `isUnlocked(state)`.

---

### 5. Implementation Phases & Verification Steps

1. **설정 및 데이터 에셋 (`src/config`, `src/data`)**:
   - `appConfig.ts`: 앱 명칭, 슬로건, 레벨별 XP 테이블 (50, 150, 350, 650, 1000 XP).
   - `categoriesData.ts` & `missionsData.ts`: 6대 기후 카테고리 및 정확한 과학적 근거/출처를 가진 30개 실천 미션 (1분 학습 및 퀴즈 포함).
   - `soundEffects.ts`: Web Audio API 효과음 엔진.
2. **저장소 및 게임 로직 엔진 (`src/services`, `src/hooks`)**:
   - IndexedDB 영구 저장 및 리스너.
   - XP, 레벨업, 연속 실천일, 주간 챌린지 계산기.
   - 레벨업 팝업 및 배지 획득 감지기.
3. **컴포넌트 구현 (`src/components`)**:
   - 헤더 및 반응형 하단 탭 내비게이션.
   - 지구 캐릭터 및 가상 생태계 비주얼 SVG 렌더러.
   - 4개 주요 화면: `HomeView`, `ExploreView`, `RecordView`, `BuddyView`.
   - 상세 모달: 미션 실천 및 1분 학습 모달, 레벨업 축하 모달, 퀴즈 모달.
4. **검증 및 빌드 테스트**:
   - 새로고침 후 데이터 유지 및 복원 확인.
   - 퀴즈 최초 정답 시만 5 XP 지급 확인.
   - 일일 미션 1회 제한 및 취소 시 정합성 확인.
   - JSON 내보내기/불러오기 무결성 검증.
   - `compile_applet` 통과 확인.
