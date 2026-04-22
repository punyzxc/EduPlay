/**
 * Daily Leaderboard System
 * Управляет ежедневным рейтингом (топ-10 за 24 часа)
 * Автоматический сброс при смене дня
 */

export interface DailyLeaderboardEntry {
  userId: string;
  name: string;
  totalScore: number; // Сумма всех очков за день
  bestScore: number; // Лучший результат в одной попытке
  attemptsCount: number; // Количество попыток
  rank?: number; // Место в рейтинге
  timestamp: number; // Первый результат за день
  lastUpdate: number; // Последний результат
}

export interface DailyLeaderboardData {
  date: string; // YYYY-MM-DD
  entries: DailyLeaderboardEntry[];
  lastReset: number; // timestamp последнего сброса
}

// Ключи для localStorage
const LEADERBOARD_KEY = 'eduplay_daily_leaderboard';
const PLAYER_ID_KEY = 'eduplay_player_id';
const PLAYER_NAME_KEY = 'eduplay_player_name';

/**
 * Получить или создать уникальный ID игрока
 */
export const getOrCreatePlayerId = (): string => {
  let playerId = localStorage.getItem(PLAYER_ID_KEY);
  if (!playerId) {
    playerId = `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem(PLAYER_ID_KEY, playerId);
  }
  return playerId;
};

/**
 * Получить имя игрока
 */
export const getPlayerName = (): string => {
  return localStorage.getItem(PLAYER_NAME_KEY) || 'Аноним';
};

/**
 * Сохранить имя игрока
 */
export const setPlayerName = (name: string): void => {
  localStorage.setItem(PLAYER_NAME_KEY, name);
};

/**
 * Получить текущую дату в формате YYYY-MM-DD (UTC)
 */
const getTodayDate = (): string => {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, '0');
  const day = String(now.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Загрузить текущий рейтинг из localStorage
 */
const loadLeaderboardData = (): DailyLeaderboardData => {
  const saved = localStorage.getItem(LEADERBOARD_KEY);
  
  if (!saved) {
    return {
      date: getTodayDate(),
      entries: [],
      lastReset: Date.now(),
    };
  }

  try {
    return JSON.parse(saved);
  } catch {
    console.error('Failed to parse leaderboard data');
    return {
      date: getTodayDate(),
      entries: [],
      lastReset: Date.now(),
    };
  }
};

/**
 * Сохранить рейтинг в localStorage
 */
const saveLeaderboardData = (data: DailyLeaderboardData): void => {
  localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(data));
};

/**
 * Проверить и сбросить рейтинг если наступил новый день
 */
const checkAndResetDailyIfNeeded = (): DailyLeaderboardData => {
  let data = loadLeaderboardData();
  const today = getTodayDate();

  if (data.date !== today) {
    // Новый день! Сбрасываем рейтинг
    data = {
      date: today,
      entries: [],
      lastReset: Date.now(),
    };
    saveLeaderboardData(data);
  }

  return data;
};

/**
 * Добавить результат в ежедневный рейтинг
 * @param score - очки полученные в этой попытке
 * @param playerName - имя игрока
 */
export const addDailyResult = (score: number, playerName?: string): void => {
  let data = checkAndResetDailyIfNeeded();
  const playerId = getOrCreatePlayerId();
  const now = Date.now();

  // Сохранить имя если передано
  if (playerName) {
    setPlayerName(playerName);
  }

  // Найти существующую запись игрока за этот день
  const existingIndex = data.entries.findIndex((e) => e.userId === playerId);

  if (existingIndex >= 0) {
    // Обновить существующую запись
    const entry = data.entries[existingIndex];
    entry.totalScore += score;
    entry.bestScore = Math.max(entry.bestScore, score);
    entry.attemptsCount += 1;
    entry.lastUpdate = now;
  } else {
    // Создать новую запись
    const newEntry: DailyLeaderboardEntry = {
      userId: playerId,
      name: playerName || getPlayerName(),
      totalScore: score,
      bestScore: score,
      attemptsCount: 1,
      timestamp: now,
      lastUpdate: now,
    };
    data.entries.push(newEntry);
  }

  // Сортировать по totalScore (по убыванию) и сохранить топ-10
  data.entries.sort((a, b) => b.totalScore - a.totalScore);
  data.entries = data.entries.slice(0, 10);

  // Добавить ранг
  data.entries.forEach((entry, index) => {
    entry.rank = index + 1;
  });

  saveLeaderboardData(data);
};

/**
 * Получить текущий ежедневный рейтинг (топ-10)
 */
export const getDailyLeaderboard = (): DailyLeaderboardEntry[] => {
  const data = checkAndResetDailyIfNeeded();
  return data.entries.map((entry, index) => ({
    ...entry,
    rank: index + 1,
  }));
};

/**
 * Получить позицию текущего игрока в рейтинге
 */
export const getCurrentPlayerRank = (): DailyLeaderboardEntry | null => {
  const playerId = getOrCreatePlayerId();
  const leaderboard = getDailyLeaderboard();
  return leaderboard.find((e) => e.userId === playerId) || null;
};

/**
 * Получить информацию о времени до сброса рейтинга
 */
export const getTimeUntilReset = (): {
  hours: number;
  minutes: number;
  seconds: number;
} => {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
  tomorrow.setUTCHours(0, 0, 0, 0);

  const diffMs = tomorrow.getTime() - now.getTime();
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

  return { hours, minutes, seconds };
};

/**
 * Получить дату рейтинга в красивом формате
 */
export const getLeaderboardDateFormatted = (): string => {
  const today = getTodayDate();
  const [year, month, day] = today.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  return date.toLocaleDateString('ru-RU', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Очистить рейтинг (для отладки или сброса)
 */
export const clearDailyLeaderboard = (): void => {
  localStorage.setItem(
    LEADERBOARD_KEY,
    JSON.stringify({
      date: getTodayDate(),
      entries: [],
      lastReset: Date.now(),
    })
  );
};
