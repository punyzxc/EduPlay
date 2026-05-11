import { Router } from 'express';
import {
  fetchLeaderboard,
  fetchProfile,
  loginAuthUser,
  registerAuthUser,
  submitScore,
} from '../database/db.js';
import {
  validateAuthLogin,
  validateAuthRegister,
  validateProfileQuery,
  validateSubmitScore,
} from '../middleware/validation.js';

const router = Router();

router.get('/leaderboard', async (request, response, next) => {
  try {
    const rawLimit = Number(request.query.limit ?? 10);
    const limit = Number.isFinite(rawLimit) ? Math.min(Math.max(rawLimit, 1), 100) : 10;
    const leaderboard = await fetchLeaderboard(limit);

    response.json({
      items: leaderboard,
      count: leaderboard.length,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
});

router.get('/profile', validateProfileQuery, async (request, response, next) => {
  try {
    const profile = await fetchProfile(request.validatedQuery);
    if (!profile) {
      response.status(404).json({
        error: 'Profile not found',
        message: 'Профиль не найден.',
      });
      return;
    }

    response.json({
      item: profile,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
});

router.post('/submit-score', validateSubmitScore, async (request, response, next) => {
  try {
    const updatedUser = await submitScore(request.body);
    const profile = await fetchProfile({ id: updatedUser.id });

    response.status(201).json({
      item: profile,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    if (error?.code === 'INVALID_SCORE_SUBMISSION') {
      response.status(400).json({
        error: 'Invalid score submission',
        message: 'Для начисления очков нужен корректный quizSessionId.',
      });
      return;
    }
    if (error?.code === 'UNIQUE_CONFLICT') {
      response.status(409).json({
        error: 'Unique conflict',
        message: 'Пользователь с таким username/email уже существует.',
      });
      return;
    }
    next(error);
  }
});

router.post('/auth/register', validateAuthRegister, async (request, response, next) => {
  try {
    const registeredUser = await registerAuthUser(request.body);
    const profile = await fetchProfile({ id: registeredUser.id });

    response.status(201).json({
      item: profile,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    if (error?.code === 'UNIQUE_CONFLICT') {
      response.status(409).json({
        error: 'Unique conflict',
        message: 'Пользователь с таким username/email уже существует.',
      });
      return;
    }
    next(error);
  }
});

router.post('/auth/login', validateAuthLogin, async (request, response, next) => {
  try {
    const user = await loginAuthUser(request.body);
    if (!user) {
      response.status(401).json({
        error: 'Invalid credentials',
        message: 'Неверный логин/email или пароль.',
      });
      return;
    }

    const profile = await fetchProfile({ id: user.id });
    response.status(200).json({
      item: profile,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
});

export default router;
