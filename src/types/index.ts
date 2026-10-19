export type Difficulty = 'easy' | 'medium' | 'hard';
export type ImpactType = 'mitigation' | 'adaptation';

export interface QuizQuestion {
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

export interface LearningContent {
  easy: string;
  detailed: string;
  deep: string;
  deepLink?: string;
}

export interface Mission {
  id: string;
  categoryId: string;
  title: string;
  shortDescription: string;
  climateProblem: string;
  explanation: string;
  actionSteps: string[];
  difficulty: Difficulty;
  xpReward: number; // 10, 15, or 20
  impactType: ImpactType; // 'mitigation' (감축) vs 'adaptation' (적응)
  estimatedTime: string;
  learningContent: LearningContent;
  quiz: QuizQuestion;
  sourceUrl: string;
  sourceName: string;
}

export interface Category {
  id: string;
  name: string;
  iconName: string;
  color: string;
  lightColor: string;
  description: string;
  causeAndEffect: string;
  actionsOverview: string;
  categoryQuiz: QuizQuestion;
  sourceUrl: string;
  sourceName: string;
}

export interface ActionLog {
  id: string;
  missionId: string;
  categoryId: string;
  dateString: string; // YYYY-MM-DD
  timestamp: number;
  xpGained: number;
  reflectionNote?: string;
}

export interface QuizLog {
  quizId: string;
  dateString: string;
  isCorrect: boolean;
  xpGained: number;
  timestamp: number;
}

export interface UserProfile {
  nickname: string;
  createdAt: string;
  soundEnabled: boolean;
  favoriteCategory?: string;
}

export interface LevelInfo {
  level: number;
  name: string;
  requiredXp: number;
  nextRequiredXp: number | null;
  description: string;
  characterTitle: string;
  unlockMessage: string;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  iconName: string;
  color: string;
}

export interface DailyReflection {
  dateString: string;
  note: string;
  timestamp: number;
}

export interface AppExportData {
  version: number;
  exportDate: string;
  profile: UserProfile;
  actionLogs: ActionLog[];
  quizLogs: QuizLog[];
  reflections: DailyReflection[];
}

export type ActiveTab = 'home' | 'explore' | 'record' | 'buddy';
