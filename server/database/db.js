import path from 'node:path';
import sqlite3 from 'sqlite3';

const sqlite = sqlite3.verbose();
const databasePath = path.resolve(process.cwd(), 'database.sqlite');

const db = new sqlite.Database(databasePath);

const run = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.run(sql, params, function runCallback(error) {
      if (error) {
        reject(error);
        return;
      }
      resolve({
        lastID: this.lastID,
        changes: this.changes,
      });
    });
  });

const get = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.get(sql, params, (error, row) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(row ?? null);
    });
  });

const all = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.all(sql, params, (error, rows) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(rows ?? []);
    });
  });

const MAX_PROFILE_SETTINGS_JSON_LENGTH = 5000;

const isPlainObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);

const normalizeInteger = (value, { min, max, fallback }) => {
  if (!Number.isFinite(value) || !Number.isInteger(value)) {
    return fallback;
  }
  return Math.min(Math.max(value, min), max);
};

const safeParseJson = (value, fallback) => {
  if (typeof value !== 'string' || value.trim().length === 0) return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

const normalizeAchievements = (value, fallback = []) => {
  const source = Array.isArray(value) ? value : fallback;
  return source
    .map((item) => {
      if (!isPlainObject(item)) return null;
      const id = typeof item.id === 'string' ? item.id.trim() : '';
      const name = typeof item.name === 'string' ? item.name.trim() : '';
      const description = typeof item.description === 'string' ? item.description.trim() : '';
      const icon = typeof item.icon === 'string' ? item.icon.trim() : '';
      const unlockedAt = typeof item.unlockedAt === 'string' ? item.unlockedAt.trim() : '';

      if (!id || !name || !description || !icon || !unlockedAt) return null;
      return {
        id: id.slice(0, 64),
        name: name.slice(0, 120),
        description: description.slice(0, 280),
        icon: icon.slice(0, 32),
        unlockedAt: unlockedAt.slice(0, 64),
      };
    })
    .filter(Boolean);
};

const mergeAchievements = (base, incoming) => {
  const byId = new Map();
  [...base, ...incoming].forEach((item) => {
    if (!item?.id) return;
    byId.set(item.id, item);
  });
  return Array.from(byId.values());
};

const normalizeUnlockedItems = (value, fallback = []) => {
  const source = Array.isArray(value) ? value : fallback;
  return Array.from(
    new Set(
      source
        .filter((item) => typeof item === 'string')
        .map((item) => item.trim())
        .filter((item) => item.length > 0 && item.length <= 80),
    ),
  );
};

const normalizeProfileSettings = (value, fallback = {}) => {
  if (!isPlainObject(value)) return fallback;
  const normalized = {};
  Object.entries(value).forEach(([key, current]) => {
    if (!key || key.length > 80) return;
    if (typeof current === 'string') {
      normalized[key] = current.slice(0, 400);
      return;
    }
    if (typeof current === 'number' || typeof current === 'boolean') {
      normalized[key] = current;
    }
  });
  if (JSON.stringify(normalized).length > MAX_PROFILE_SETTINGS_JSON_LENGTH) {
    return fallback;
  }
  return normalized;
};

const normalizeIsoDate = (value, fallback = '') => {
  if (typeof value !== 'string' || value.trim().length === 0) return fallback;
  const parsed = Date.parse(value.trim());
  if (Number.isNaN(parsed)) return fallback;
  return new Date(parsed).toISOString();
};

const mapRowToProfile = (row) => {
  if (!row) return null;

  const achievements = normalizeAchievements(safeParseJson(row.achievementsJson, []), []);
  const unlockedItems = normalizeUnlockedItems(safeParseJson(row.unlockedItemsJson, []), []);
  const profileSettings = normalizeProfileSettings(safeParseJson(row.profileSettingsJson, {}), {});

  const { achievementsJson, unlockedItemsJson, profileSettingsJson, ...rest } = row;
  return {
    ...rest,
    totalScore: Math.max(0, Number(rest.totalScore) || 0),
    bestScore: Math.max(0, Number(rest.bestScore) || 0),
    dailyScore: Math.max(0, Number(rest.dailyScore) || 0),
    achievements,
    unlockedItems,
    profileSettings,
  };
};

export const getTodayUTC = () => {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, '0');
  const day = String(now.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const initDatabase = async () => {
  await run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL DEFAULT '',
      avatar TEXT NOT NULL,
      avatarColor TEXT NOT NULL DEFAULT '',
      totalScore INTEGER NOT NULL DEFAULT 0,
      bestScore INTEGER NOT NULL DEFAULT 0,
      dailyScore INTEGER NOT NULL DEFAULT 0,
      level INTEGER NOT NULL DEFAULT 1,
      totalXP INTEGER NOT NULL DEFAULT 0,
      currentStreak INTEGER NOT NULL DEFAULT 0,
      bestStreak INTEGER NOT NULL DEFAULT 0,
      gamesPlayed INTEGER NOT NULL DEFAULT 0,
      totalAnswers INTEGER NOT NULL DEFAULT 0,
      correctAnswers INTEGER NOT NULL DEFAULT 0,
      achievementsJson TEXT NOT NULL DEFAULT '[]',
      unlockedItemsJson TEXT NOT NULL DEFAULT '[]',
      profileSettingsJson TEXT NOT NULL DEFAULT '{}',
      lastPlayedAt TEXT NOT NULL DEFAULT '',
      lastResetUTC TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL DEFAULT ''
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS score_submissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      quizSessionId TEXT NOT NULL,
      score INTEGER NOT NULL,
      createdAt TEXT NOT NULL,
      UNIQUE(userId, quizSessionId)
    )
  `);

  const columns = await all('PRAGMA table_info(users)');
  const existing = new Set(columns.map((column) => column.name));
  const requiredColumns = [
    { name: 'password', definition: "TEXT NOT NULL DEFAULT ''" },
    { name: 'updatedAt', definition: "TEXT NOT NULL DEFAULT ''" },
    { name: 'avatarColor', definition: "TEXT NOT NULL DEFAULT ''" },
    { name: 'level', definition: 'INTEGER NOT NULL DEFAULT 1' },
    { name: 'totalXP', definition: 'INTEGER NOT NULL DEFAULT 0' },
    { name: 'currentStreak', definition: 'INTEGER NOT NULL DEFAULT 0' },
    { name: 'bestStreak', definition: 'INTEGER NOT NULL DEFAULT 0' },
    { name: 'gamesPlayed', definition: 'INTEGER NOT NULL DEFAULT 0' },
    { name: 'totalAnswers', definition: 'INTEGER NOT NULL DEFAULT 0' },
    { name: 'correctAnswers', definition: 'INTEGER NOT NULL DEFAULT 0' },
    { name: 'achievementsJson', definition: "TEXT NOT NULL DEFAULT '[]'" },
    { name: 'unlockedItemsJson', definition: "TEXT NOT NULL DEFAULT '[]'" },
    { name: 'profileSettingsJson', definition: "TEXT NOT NULL DEFAULT '{}'" },
    { name: 'lastPlayedAt', definition: "TEXT NOT NULL DEFAULT ''" },
  ];

  for (const column of requiredColumns) {
    if (!existing.has(column.name)) {
      await run(`ALTER TABLE users ADD COLUMN ${column.name} ${column.definition}`);
    }
  }

  await run(`
    UPDATE users
    SET totalScore = CASE WHEN totalScore < 0 THEN 0 ELSE totalScore END,
        bestScore = CASE WHEN bestScore < 0 THEN 0 ELSE bestScore END,
        dailyScore = CASE WHEN dailyScore < 0 THEN 0 ELSE dailyScore END
  `);
};

export const resetDailyScoresIfNeeded = async () => {
  const today = getTodayUTC();
  await run(
    `UPDATE users
     SET dailyScore = 0,
         lastResetUTC = ?
     WHERE lastResetUTC != ?`,
    [today, today],
  );
};

export const upsertUserProfile = async ({ username, email, avatar, avatarColor, password }) => {
  const today = getTodayUTC();
  const now = new Date().toISOString();

  const byEmail = await get('SELECT * FROM users WHERE email = ?', [email]);
  const byUsername = await get('SELECT * FROM users WHERE username = ?', [username]);

  if (byEmail && byUsername && byEmail.id !== byUsername.id) {
    const conflict = new Error('Username or email already in use');
    conflict.code = 'UNIQUE_CONFLICT';
    throw conflict;
  }

  const target = byEmail ?? byUsername;
  if (!target) {
    const insertResult = await run(
      `INSERT INTO users (
          username, email, password, avatar, avatarColor,
          totalScore, bestScore, dailyScore, level, totalXP, currentStreak, bestStreak,
          gamesPlayed, totalAnswers, correctAnswers, achievementsJson, unlockedItemsJson, profileSettingsJson,
          lastPlayedAt, lastResetUTC, createdAt, updatedAt
        )
       VALUES (?, ?, ?, ?, ?, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, '[]', '[]', '{}', '', ?, ?, ?)`,
      [username, email, password ?? '', avatar, avatarColor ?? '', today, now, now],
    );
    return get('SELECT * FROM users WHERE id = ?', [insertResult.lastID]);
  }

  await run(
    `UPDATE users
     SET username = ?,
          email = ?,
          password = CASE WHEN ? IS NULL THEN password ELSE ? END,
          avatar = ?,
          avatarColor = CASE WHEN ? IS NULL THEN avatarColor ELSE ? END,
          lastResetUTC = CASE WHEN lastResetUTC != ? THEN ? ELSE lastResetUTC END,
          dailyScore = CASE WHEN lastResetUTC != ? THEN 0 ELSE dailyScore END,
          updatedAt = ?
      WHERE id = ?`,
    [
      username,
      email,
      password ?? null,
      password ?? null,
      avatar,
      avatarColor ?? null,
      avatarColor ?? null,
      today,
      today,
      today,
      now,
      target.id,
    ],
  );

  return get('SELECT * FROM users WHERE id = ?', [target.id]);
};

export const registerAuthUser = async ({ username, email, password, avatar, avatarColor }) => {
  const today = getTodayUTC();
  const now = new Date().toISOString();
  const byEmail = await get('SELECT * FROM users WHERE email = ?', [email]);
  const byUsername = await get('SELECT * FROM users WHERE username = ?', [username]);

  if (byEmail && byUsername && byEmail.id !== byUsername.id) {
    const conflict = new Error('Username or email already in use');
    conflict.code = 'UNIQUE_CONFLICT';
    throw conflict;
  }

  const target = byEmail ?? byUsername;

  if (!target) {
    const insertResult = await run(
      `INSERT INTO users (
          username, email, password, avatar, avatarColor,
          totalScore, bestScore, dailyScore, level, totalXP, currentStreak, bestStreak,
          gamesPlayed, totalAnswers, correctAnswers, achievementsJson, unlockedItemsJson, profileSettingsJson,
          lastPlayedAt, lastResetUTC, createdAt, updatedAt
        )
       VALUES (?, ?, ?, ?, ?, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, '[]', '[]', '{}', '', ?, ?, ?)`,
      [username, email, password, avatar, avatarColor ?? '', today, now, now],
    );
    return get('SELECT * FROM users WHERE id = ?', [insertResult.lastID]);
  }

  if (target.password && target.password !== password) {
    const conflict = new Error('Username or email already in use');
    conflict.code = 'UNIQUE_CONFLICT';
    throw conflict;
  }

  await run(
    `UPDATE users
     SET username = ?,
         email = ?,
         password = ?,
         avatar = ?,
         avatarColor = CASE WHEN ? IS NULL THEN avatarColor ELSE ? END,
         updatedAt = ?
     WHERE id = ?`,
    [username, email, password, avatar, avatarColor ?? null, avatarColor ?? null, now, target.id],
  );

  return get('SELECT * FROM users WHERE id = ?', [target.id]);
};

export const loginAuthUser = async ({ identity, password }) => {
  const user = await get(
    `SELECT *
     FROM users
     WHERE email = ? OR LOWER(username) = LOWER(?)
     LIMIT 1`,
    [identity, identity],
  );

  if (!user || !user.password || user.password !== password) {
    return null;
  }

  const now = new Date().toISOString();
  await run('UPDATE users SET updatedAt = ? WHERE id = ?', [now, user.id]);
  return get('SELECT * FROM users WHERE id = ?', [user.id]);
};

export const submitScore = async ({
  username,
  email,
  avatar,
  avatarColor,
  score,
  password,
  quizSessionId,
  level,
  totalXP,
  currentStreak,
  bestStreak,
  gamesPlayed,
  totalAnswers,
  correctAnswers,
  achievements,
  unlockedItems,
  profileSettings,
  lastPlayedAt,
}) => {
  await resetDailyScoresIfNeeded();
  const user = await upsertUserProfile({ username, email, avatar, avatarColor, password });
  const now = new Date().toISOString();

  let appliedScore = score;
  if (score !== 0) {
    if (!quizSessionId) {
      const error = new Error('Missing quizSessionId');
      error.code = 'INVALID_SCORE_SUBMISSION';
      throw error;
    }
    try {
      await run(
        `INSERT INTO score_submissions (userId, quizSessionId, score, createdAt)
         VALUES (?, ?, ?, ?)`,
        [user.id, quizSessionId, score, now],
      );
    } catch (error) {
      if (error?.code === 'SQLITE_CONSTRAINT') {
        appliedScore = 0;
      } else {
        throw error;
      }
    }
  }

  const existingAchievements = normalizeAchievements(safeParseJson(user.achievementsJson, []), []);
  const incomingAchievements = normalizeAchievements(achievements, existingAchievements);
  const mergedAchievements = mergeAchievements(existingAchievements, incomingAchievements);

  const existingUnlockedItems = normalizeUnlockedItems(safeParseJson(user.unlockedItemsJson, []), []);
  const incomingUnlockedItems = normalizeUnlockedItems(unlockedItems, existingUnlockedItems);
  const mergedUnlockedItems = normalizeUnlockedItems(
    [...existingUnlockedItems, ...incomingUnlockedItems],
    existingUnlockedItems,
  );

  const existingProfileSettings = normalizeProfileSettings(safeParseJson(user.profileSettingsJson, {}), {});
  const incomingProfileSettings = normalizeProfileSettings(profileSettings, existingProfileSettings);
  const mergedProfileSettings = {
    ...existingProfileSettings,
    ...incomingProfileSettings,
  };

  const normalizedTotalXP = normalizeInteger(totalXP, {
    min: 0,
    max: 10_000_000,
    fallback: user.totalXP ?? 0,
  });
  const derivedLevelFromXP = Math.max(1, Math.floor(normalizedTotalXP / 100) + 1);
  const normalizedLevel = normalizeInteger(level, {
    min: 1,
    max: 100_000,
    fallback: Math.max(user.level ?? 1, derivedLevelFromXP),
  });

  const normalizedCurrentStreak = normalizeInteger(currentStreak, {
    min: 0,
    max: 1_000_000,
    fallback: user.currentStreak ?? 0,
  });
  const normalizedBestStreakInput = normalizeInteger(bestStreak, {
    min: 0,
    max: 1_000_000,
    fallback: user.bestStreak ?? 0,
  });
  const normalizedBestStreak = Math.max(
    user.bestStreak ?? 0,
    normalizedBestStreakInput,
    normalizedCurrentStreak,
  );

  const normalizedGamesPlayedInput = normalizeInteger(gamesPlayed, {
    min: 0,
    max: 1_000_000,
    fallback: user.gamesPlayed ?? 0,
  });
  const derivedGamesPlayed = (user.gamesPlayed ?? 0) + (score !== 0 && appliedScore === score ? 1 : 0);
  const normalizedGamesPlayed = Math.max(normalizedGamesPlayedInput, derivedGamesPlayed);

  const normalizedTotalAnswers = Math.max(
    user.totalAnswers ?? 0,
    normalizeInteger(totalAnswers, {
      min: 0,
      max: 100_000_000,
      fallback: user.totalAnswers ?? 0,
    }),
  );
  const normalizedCorrectAnswersInput = normalizeInteger(correctAnswers, {
    min: 0,
    max: 100_000_000,
    fallback: user.correctAnswers ?? 0,
  });
  const normalizedCorrectAnswers = Math.min(
    normalizedTotalAnswers,
    Math.max(user.correctAnswers ?? 0, normalizedCorrectAnswersInput),
  );

  const normalizedLastPlayedAtBase = normalizeIsoDate(lastPlayedAt, user.lastPlayedAt ?? '');
  const normalizedLastPlayedAt = score !== 0 && appliedScore === score ? now : normalizedLastPlayedAtBase;

  const totalScore = Math.max(0, (user.totalScore ?? 0) + appliedScore);
  const dailyScore = Math.max(0, (user.dailyScore ?? 0) + appliedScore);
  const bestScore = Math.max(user.bestScore ?? 0, appliedScore > 0 ? appliedScore : 0);

  await run(
    `UPDATE users
     SET totalScore = ?,
          bestScore = ?,
          dailyScore = ?,
          avatarColor = CASE WHEN ? IS NULL THEN avatarColor ELSE ? END,
          level = ?,
          totalXP = ?,
          currentStreak = ?,
          bestStreak = ?,
          gamesPlayed = ?,
          totalAnswers = ?,
          correctAnswers = ?,
          achievementsJson = ?,
          unlockedItemsJson = ?,
          profileSettingsJson = ?,
          lastPlayedAt = ?,
          updatedAt = ?
     WHERE id = ?`,
    [
      totalScore,
      bestScore,
      dailyScore,
      avatarColor ?? null,
      avatarColor ?? null,
      normalizedLevel,
      normalizedTotalXP,
      normalizedCurrentStreak,
      normalizedBestStreak,
      normalizedGamesPlayed,
      normalizedTotalAnswers,
      normalizedCorrectAnswers,
      JSON.stringify(mergedAchievements),
      JSON.stringify(mergedUnlockedItems),
      JSON.stringify(mergedProfileSettings),
      normalizedLastPlayedAt,
      now,
      user.id,
    ],
  );

  return get('SELECT * FROM users WHERE id = ?', [user.id]);
};

export const fetchLeaderboard = async (limit = 10) => {
  const rows = await all(
    `SELECT id, username, email, avatar, avatarColor, totalScore, bestScore, dailyScore, lastResetUTC, createdAt
     FROM users
     ORDER BY totalScore DESC, bestScore DESC, dailyScore DESC, createdAt ASC
     LIMIT ?`,
    [limit],
  );

  return rows.map((row, index) => ({
    ...row,
    rank: index + 1,
  }));
};

export const fetchProfile = async ({ id, username, email }) => {
  let user = null;
  if (id) {
    user = await get('SELECT * FROM users WHERE id = ?', [id]);
  } else if (email) {
    user = await get('SELECT * FROM users WHERE email = ?', [email]);
  } else if (username) {
    user = await get('SELECT * FROM users WHERE username = ?', [username]);
  }

  if (!user) {
    return null;
  }

  const rankRow = await get(
    `SELECT COUNT(*) + 1 as rank
     FROM users
     WHERE totalScore > ?`,
    [user.totalScore],
  );

  return mapRowToProfile({
    ...user,
    rank: rankRow?.rank ?? null,
  });
};
