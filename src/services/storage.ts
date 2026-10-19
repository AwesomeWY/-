import {
  ActionLog,
  QuizLog,
  UserProfile,
  DailyReflection,
  AppExportData,
  LevelInfo,
} from '../types';
import { APP_CONFIG } from '../config/appConfig';

const DB_NAME = 'TeamEarthDB';
const DB_VERSION = 1;
const STORE_LOGS = 'action_logs';
const STORE_QUIZZES = 'quiz_logs';
const STORE_PROFILE = 'user_profile';
const STORE_REFLECTIONS = 'reflections';

// Helper: Open IndexedDB with graceful fallback
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_LOGS)) {
        const store = db.createObjectStore(STORE_LOGS, { keyPath: 'id' });
        store.createIndex('dateString', 'dateString', { unique: false });
        store.createIndex('missionId', 'missionId', { unique: false });
      }
      if (!db.objectStoreNames.contains(STORE_QUIZZES)) {
        db.createObjectStore(STORE_QUIZZES, { keyPath: 'quizId' });
      }
      if (!db.objectStoreNames.contains(STORE_PROFILE)) {
        db.createObjectStore(STORE_PROFILE, { keyPath: 'key' });
      }
      if (!db.objectStoreNames.contains(STORE_REFLECTIONS)) {
        db.createObjectStore(STORE_REFLECTIONS, { keyPath: 'dateString' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// LocalStorage Fallback keys
const LS_LOGS = 'team_earth_action_logs';
const LS_QUIZZES = 'team_earth_quiz_logs';
const LS_PROFILE = 'team_earth_user_profile';
const LS_REFLECTIONS = 'team_earth_reflections';

export function getTodayString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getWeekRangeKey(dateStr: string): string {
  // Returns week identifier starting on Monday: e.g. "2026-W42"
  const d = new Date(dateStr + 'T12:00:00');
  const day = d.getDay();
  // distance to Monday: if day === 0 (Sunday), diff is -6, else 1 - day
  const diff = day === 0 ? -6 : 1 - day;
  const monday = new Date(d);
  monday.setDate(d.getDate() + diff);
  const mYear = monday.getFullYear();
  const mMonth = String(monday.getMonth() + 1).padStart(2, '0');
  const mDay = String(monday.getDate()).padStart(2, '0');
  return `${mYear}-${mMonth}-${mDay}`;
}

// Default initial profile
export const DEFAULT_PROFILE: UserProfile = {
  nickname: '초록버디',
  createdAt: new Date().toISOString(),
  soundEnabled: true,
};

// Storage Service API
export class StorageService {
  // --- Profile ---
  static async getProfile(): Promise<UserProfile> {
    try {
      const db = await openDB();
      return new Promise((resolve) => {
        const tx = db.transaction(STORE_PROFILE, 'readonly');
        const store = tx.objectStore(STORE_PROFILE);
        const req = store.get('current_user');
        req.onsuccess = () => {
          if (req.result?.data) {
            resolve(req.result.data);
          } else {
            const fromLs = localStorage.getItem(LS_PROFILE);
            if (fromLs) {
              resolve(JSON.parse(fromLs));
            } else {
              resolve(DEFAULT_PROFILE);
            }
          }
        };
        req.onerror = () => resolve(DEFAULT_PROFILE);
      });
    } catch {
      const fromLs = localStorage.getItem(LS_PROFILE);
      return fromLs ? JSON.parse(fromLs) : DEFAULT_PROFILE;
    }
  }

  static async saveProfile(profile: UserProfile): Promise<void> {
    localStorage.setItem(LS_PROFILE, JSON.stringify(profile));
    try {
      const db = await openDB();
      const tx = db.transaction(STORE_PROFILE, 'readwrite');
      tx.objectStore(STORE_PROFILE).put({ key: 'current_user', data: profile });
    } catch {
      // Fallback is already saved to localStorage
    }
  }

  // --- Action Logs ---
  static async getActionLogs(): Promise<ActionLog[]> {
    try {
      const db = await openDB();
      return new Promise((resolve) => {
        const tx = db.transaction(STORE_LOGS, 'readonly');
        const req = tx.objectStore(STORE_LOGS).getAll();
        req.onsuccess = () => {
          const list = (req.result as ActionLog[]) || [];
          if (list.length === 0) {
            const fromLs = localStorage.getItem(LS_LOGS);
            resolve(fromLs ? JSON.parse(fromLs) : []);
          } else {
            resolve(list);
          }
        };
        req.onerror = () => {
          const fromLs = localStorage.getItem(LS_LOGS);
          resolve(fromLs ? JSON.parse(fromLs) : []);
        };
      });
    } catch {
      const fromLs = localStorage.getItem(LS_LOGS);
      return fromLs ? JSON.parse(fromLs) : [];
    }
  }

  static async saveActionLogs(logs: ActionLog[]): Promise<void> {
    localStorage.setItem(LS_LOGS, JSON.stringify(logs));
    try {
      const db = await openDB();
      const tx = db.transaction(STORE_LOGS, 'readwrite');
      const store = tx.objectStore(STORE_LOGS);
      await new Promise<void>((resolve, reject) => {
        const clearReq = store.clear();
        clearReq.onsuccess = () => {
          for (const item of logs) {
            store.put(item);
          }
          resolve();
        };
        clearReq.onerror = () => reject(clearReq.error);
      });
    } catch {
      // localStorage already updated
    }
  }

  static async addActionLog(log: ActionLog): Promise<void> {
    const current = await this.getActionLogs();
    // Prevent duplicate completion of same mission on the same day
    const alreadyCompletedToday = current.some(
      (l) => l.missionId === log.missionId && l.dateString === log.dateString
    );
    if (alreadyCompletedToday) {
      return;
    }
    const updated = [...current, log];
    await this.saveActionLogs(updated);
  }

  static async removeActionLog(id: string): Promise<void> {
    const current = await this.getActionLogs();
    const updated = current.filter((l) => l.id !== id);
    await this.saveActionLogs(updated);
  }

  // --- Quiz Logs ---
  static async getQuizLogs(): Promise<QuizLog[]> {
    try {
      const db = await openDB();
      return new Promise((resolve) => {
        const tx = db.transaction(STORE_QUIZZES, 'readonly');
        const req = tx.objectStore(STORE_QUIZZES).getAll();
        req.onsuccess = () => {
          const list = (req.result as QuizLog[]) || [];
          if (list.length === 0) {
            const fromLs = localStorage.getItem(LS_QUIZZES);
            resolve(fromLs ? JSON.parse(fromLs) : []);
          } else {
            resolve(list);
          }
        };
        req.onerror = () => {
          const fromLs = localStorage.getItem(LS_QUIZZES);
          resolve(fromLs ? JSON.parse(fromLs) : []);
        };
      });
    } catch {
      const fromLs = localStorage.getItem(LS_QUIZZES);
      return fromLs ? JSON.parse(fromLs) : [];
    }
  }

  static async recordQuizAnswer(quizId: string, isCorrect: boolean): Promise<{ firstCorrectBonus: boolean; xpGained: number }> {
    const current = await this.getQuizLogs();
    const existing = current.find((q) => q.quizId === quizId);

    // Only grant XP on the very first correct answer
    const alreadyCorrect = existing && existing.isCorrect;
    const shouldGrantXp = isCorrect && !alreadyCorrect;
    const xpGained = shouldGrantXp ? APP_CONFIG.xpRewards.quizCorrect : 0;

    const newLog: QuizLog = {
      quizId,
      dateString: getTodayString(),
      isCorrect,
      xpGained,
      timestamp: Date.now(),
    };

    const updated = current.filter((q) => q.quizId !== quizId).concat(newLog);
    localStorage.setItem(LS_QUIZZES, JSON.stringify(updated));

    try {
      const db = await openDB();
      const tx = db.transaction(STORE_QUIZZES, 'readwrite');
      tx.objectStore(STORE_QUIZZES).put(newLog);
    } catch {
      // fallback handled
    }

    return { firstCorrectBonus: shouldGrantXp, xpGained };
  }

  // --- Reflections ---
  static async getReflections(): Promise<DailyReflection[]> {
    try {
      const db = await openDB();
      return new Promise((resolve) => {
        const tx = db.transaction(STORE_REFLECTIONS, 'readonly');
        const req = tx.objectStore(STORE_REFLECTIONS).getAll();
        req.onsuccess = () => {
          const list = (req.result as DailyReflection[]) || [];
          if (list.length === 0) {
            const fromLs = localStorage.getItem(LS_REFLECTIONS);
            resolve(fromLs ? JSON.parse(fromLs) : []);
          } else {
            resolve(list);
          }
        };
        req.onerror = () => {
          const fromLs = localStorage.getItem(LS_REFLECTIONS);
          resolve(fromLs ? JSON.parse(fromLs) : []);
        };
      });
    } catch {
      const fromLs = localStorage.getItem(LS_REFLECTIONS);
      return fromLs ? JSON.parse(fromLs) : [];
    }
  }

  static async saveReflection(dateString: string, note: string): Promise<void> {
    const current = await this.getReflections();
    const item: DailyReflection = { dateString, note, timestamp: Date.now() };
    const updated = current.filter((r) => r.dateString !== dateString).concat(item);

    localStorage.setItem(LS_REFLECTIONS, JSON.stringify(updated));
    try {
      const db = await openDB();
      const tx = db.transaction(STORE_REFLECTIONS, 'readwrite');
      tx.objectStore(STORE_REFLECTIONS).put(item);
    } catch {
      // fallback
    }
  }

  // --- Backup & Restore ---
  static async exportAllData(): Promise<AppExportData> {
    const [profile, actionLogs, quizLogs, reflections] = await Promise.all([
      this.getProfile(),
      this.getActionLogs(),
      this.getQuizLogs(),
      this.getReflections(),
    ]);

    return {
      version: 1,
      exportDate: new Date().toISOString(),
      profile,
      actionLogs,
      quizLogs,
      reflections,
    };
  }

  static async importAllData(data: AppExportData): Promise<boolean> {
    if (!data || !Array.isArray(data.actionLogs)) {
      throw new Error('유효하지 않은 데이터 백업 파일 형식입니다.');
    }

    if (data.profile) {
      await this.saveProfile(data.profile);
    }
    await this.saveActionLogs(data.actionLogs || []);

    if (data.quizLogs && Array.isArray(data.quizLogs)) {
      localStorage.setItem(LS_QUIZZES, JSON.stringify(data.quizLogs));
      try {
        const db = await openDB();
        const tx = db.transaction(STORE_QUIZZES, 'readwrite');
        const store = tx.objectStore(STORE_QUIZZES);
        store.clear();
        for (const q of data.quizLogs) {
          store.put(q);
        }
      } catch {
        // fallback
      }
    }

    if (data.reflections && Array.isArray(data.reflections)) {
      localStorage.setItem(LS_REFLECTIONS, JSON.stringify(data.reflections));
      try {
        const db = await openDB();
        const tx = db.transaction(STORE_REFLECTIONS, 'readwrite');
        const store = tx.objectStore(STORE_REFLECTIONS);
        store.clear();
        for (const r of data.reflections) {
          store.put(r);
        }
      } catch {
        // fallback
      }
    }

    return true;
  }

  static async resetAllData(): Promise<void> {
    localStorage.removeItem(LS_LOGS);
    localStorage.removeItem(LS_QUIZZES);
    localStorage.removeItem(LS_REFLECTIONS);
    localStorage.removeItem(LS_PROFILE);

    try {
      const db = await openDB();
      const tx = db.transaction([STORE_LOGS, STORE_QUIZZES, STORE_PROFILE, STORE_REFLECTIONS], 'readwrite');
      tx.objectStore(STORE_LOGS).clear();
      tx.objectStore(STORE_QUIZZES).clear();
      tx.objectStore(STORE_PROFILE).clear();
      tx.objectStore(STORE_REFLECTIONS).clear();
    } catch {
      // reset done
    }
  }
}

// =================================================================
// Pure Gamification & Statistics Calculator (Event-Sourced)
// =================================================================
export interface GameStats {
  totalXp: number;
  missionXp: number;
  quizXp: number;
  weeklyBonusXp: number;
  currentLevel: LevelInfo;
  nextLevel: LevelInfo | null;
  xpInCurrentLevel: number;
  xpNeededForNext: number;
  progressPercent: number;
  totalMissionsCompleted: number;
  todayMissionsCount: number;
  thisWeekMissionsCount: number;
  streakDays: number;
  completedCategoryIdsThisWeek: string[];
  isWeeklyBonusEarnedThisWeek: boolean;
  categoryCounts: Record<string, number>;
  unlockedBadgeIds: string[];
}

export function computeGameStats(
  actionLogs: ActionLog[],
  quizLogs: QuizLog[]
): GameStats {
  const today = getTodayString();
  const currentWeekKey = getWeekRangeKey(today);

  // 1. Mission XP
  const missionXp = actionLogs.reduce((sum, log) => sum + (log.xpGained || 0), 0);

  // 2. Quiz XP (only verified correct logs)
  const quizXp = quizLogs
    .filter((q) => q.isCorrect)
    .reduce((sum, q) => sum + (q.xpGained || 0), 0);

  // 3. Weekly Challenge evaluation (+20 XP for 3 different categories per week)
  // Group action logs by weekKey
  const weekMap: Record<string, Set<string>> = {};
  for (const log of actionLogs) {
    const wKey = getWeekRangeKey(log.dateString);
    if (!weekMap[wKey]) {
      weekMap[wKey] = new Set();
    }
    weekMap[wKey].add(log.categoryId);
  }

  let weeklyBonusXp = 0;
  for (const wKey in weekMap) {
    if (weekMap[wKey].size >= 3) {
      weeklyBonusXp += APP_CONFIG.xpRewards.weeklyChallengeBonus;
    }
  }

  const thisWeekCategories = Array.from(weekMap[currentWeekKey] || []);
  const isWeeklyBonusEarnedThisWeek = thisWeekCategories.length >= 3;

  // Total XP
  const totalXp = missionXp + quizXp + weeklyBonusXp;

  // 4. Resolve Level based on totalXp
  const levels = APP_CONFIG.levels;
  let currentLevel = levels[0];
  let nextLevel: LevelInfo | null = levels[1] || null;

  for (let i = levels.length - 1; i >= 0; i--) {
    if (totalXp >= levels[i].requiredXp) {
      currentLevel = levels[i];
      nextLevel = levels[i + 1] || null;
      break;
    }
  }

  // Progress to next level
  let xpInCurrentLevel = totalXp - currentLevel.requiredXp;
  let xpNeededForNext = nextLevel ? nextLevel.requiredXp - currentLevel.requiredXp : 100;
  let progressPercent = nextLevel
    ? Math.min(100, Math.floor((xpInCurrentLevel / xpNeededForNext) * 100))
    : 100;

  // 5. Today & This Week Mission Counts
  const todayMissionsCount = actionLogs.filter((l) => l.dateString === today).length;
  const thisWeekMissionsCount = actionLogs.filter(
    (l) => getWeekRangeKey(l.dateString) === currentWeekKey
  ).length;

  // 6. Category breakdown
  const categoryCounts: Record<string, number> = {};
  for (const log of actionLogs) {
    categoryCounts[log.categoryId] = (categoryCounts[log.categoryId] || 0) + 1;
  }

  // 7. Streak calculation (consecutive days)
  const uniqueDates = Array.from(new Set(actionLogs.map((l) => l.dateString))).sort();
  let streakDays = 0;

  if (uniqueDates.length > 0) {
    // Check backwards from today or yesterday
    const checkDate = new Date();
    const todayStr = getTodayString();
    
    // Check if user practiced today
    const practicedToday = uniqueDates.includes(todayStr);
    let curr = new Date(checkDate);
    if (!practicedToday) {
      // Try yesterday
      curr.setDate(curr.getDate() - 1);
    }

    while (true) {
      const y = curr.getFullYear();
      const m = String(curr.getMonth() + 1).padStart(2, '0');
      const d = String(curr.getDate()).padStart(2, '0');
      const targetStr = `${y}-${m}-${d}`;

      if (uniqueDates.includes(targetStr)) {
        streakDays++;
        curr.setDate(curr.getDate() - 1);
      } else {
        break;
      }
    }
  }

  // 8. Badge evaluation
  const unlockedBadgeIds: string[] = [];

  // Badge 1: 지구팀 합류 (first mission)
  if (actionLogs.length >= 1) {
    unlockedBadgeIds.push('team_join');
  }

  // Badge 2: 3일 도전자 (3 distinct days)
  if (uniqueDates.length >= 3) {
    unlockedBadgeIds.push('streak_3days');
  }

  // Badge 3: 에너지 수호자 (5 energy missions)
  if ((categoryCounts['heatwave-energy'] || 0) >= 5) {
    unlockedBadgeIds.push('energy_guardian');
  }

  // Badge 4: 육지와 바다의 친구 (at least 3 categories)
  const distinctCategories = Object.keys(categoryCounts).length;
  if (distinctCategories >= 3) {
    unlockedBadgeIds.push('land_and_sea');
  }

  // Badge 5: 지구탐험 대원 (all 6 categories)
  if (distinctCategories >= 6) {
    unlockedBadgeIds.push('earth_explorer');
  }

  return {
    totalXp,
    missionXp,
    quizXp,
    weeklyBonusXp,
    currentLevel,
    nextLevel,
    xpInCurrentLevel,
    xpNeededForNext,
    progressPercent,
    totalMissionsCompleted: actionLogs.length,
    todayMissionsCount,
    thisWeekMissionsCount,
    streakDays,
    completedCategoryIdsThisWeek: thisWeekCategories,
    isWeeklyBonusEarnedThisWeek,
    categoryCounts,
    unlockedBadgeIds,
  };
}
