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
      totalScore INTEGER NOT NULL DEFAULT 0,
      bestScore INTEGER NOT NULL DEFAULT 0,
      dailyScore INTEGER NOT NULL DEFAULT 0,
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
  if (!columns.some((column) => column.name === 'password')) {
    await run("ALTER TABLE users ADD COLUMN password TEXT NOT NULL DEFAULT ''");
  }
  if (!columns.some((column) => column.name === 'updatedAt')) {
    await run("ALTER TABLE users ADD COLUMN updatedAt TEXT NOT NULL DEFAULT ''");
  }
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

export const upsertUserProfile = async ({ username, email, avatar, password }) => {
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
      `INSERT INTO users (username, email, password, avatar, totalScore, bestScore, dailyScore, lastResetUTC, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, 0, 0, 0, ?, ?, ?)`,
      [username, email, password ?? '', avatar, today, now, now],
    );
    return get('SELECT * FROM users WHERE id = ?', [insertResult.lastID]);
  }

  await run(
    `UPDATE users
     SET username = ?,
          email = ?,
          password = CASE WHEN ? IS NULL THEN password ELSE ? END,
          avatar = ?,
          lastResetUTC = CASE WHEN lastResetUTC != ? THEN ? ELSE lastResetUTC END,
          dailyScore = CASE WHEN lastResetUTC != ? THEN 0 ELSE dailyScore END,
          updatedAt = ?
      WHERE id = ?`,
    [username, email, password ?? null, password ?? null, avatar, today, today, today, now, target.id],
  );

  return get('SELECT * FROM users WHERE id = ?', [target.id]);
};

export const registerAuthUser = async ({ username, email, password, avatar }) => {
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
      `INSERT INTO users (username, email, password, avatar, totalScore, bestScore, dailyScore, lastResetUTC, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, 0, 0, 0, ?, ?, ?)`,
      [username, email, password, avatar, today, now, now],
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
         updatedAt = ?
     WHERE id = ?`,
    [username, email, password, avatar, now, target.id],
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

export const submitScore = async ({ username, email, avatar, score, password, quizSessionId }) => {
  await resetDailyScoresIfNeeded();
  const user = await upsertUserProfile({ username, email, avatar, password });
  const now = new Date().toISOString();

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
        return get('SELECT * FROM users WHERE id = ?', [user.id]);
      }
      throw error;
    }
  }

  const bestScore = Math.max(user.bestScore, score);
  const totalScore = user.totalScore + score;
  const dailyScore = user.dailyScore + score;

  await run(
    `UPDATE users
     SET totalScore = ?,
          bestScore = ?,
          dailyScore = ?,
          updatedAt = ?
      WHERE id = ?`,
    [totalScore, bestScore, dailyScore, now, user.id],
  );

  return get('SELECT * FROM users WHERE id = ?', [user.id]);
};

export const fetchLeaderboard = async (limit = 10) => {
  const rows = await all(
    `SELECT id, username, email, avatar, totalScore, bestScore, dailyScore, lastResetUTC, createdAt
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

  return {
    ...user,
    rank: rankRow?.rank ?? null,
  };
};
