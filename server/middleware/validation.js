const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const isNonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0;
const isPlainObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);
const isIntegerInRange = (value, min, max) => Number.isInteger(value) && value >= min && value <= max;

export const validateSubmitScore = (request, response, next) => {
  const {
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
  } = request.body ?? {};

  if (!isNonEmptyString(username) || username.trim().length < 3 || username.trim().length > 32) {
    response.status(400).json({
      error: 'Invalid username',
      message: 'username обязателен и должен быть длиной от 3 до 32 символов.',
    });
    return;
  }

  if (!isNonEmptyString(email) || !EMAIL_REGEX.test(email.trim())) {
    response.status(400).json({
      error: 'Invalid email',
      message: 'email обязателен и должен быть корректным.',
    });
    return;
  }

  if (!isNonEmptyString(avatar) || avatar.trim().length > 32) {
    response.status(400).json({
      error: 'Invalid avatar',
      message: 'avatar обязателен и не должен превышать 32 символа.',
    });
    return;
  }

  if (avatarColor !== undefined && (typeof avatarColor !== 'string' || avatarColor.trim().length > 32)) {
    response.status(400).json({
      error: 'Invalid avatarColor',
      message: 'avatarColor должен быть строкой длиной до 32 символов.',
    });
    return;
  }

  if (!Number.isFinite(score) || !Number.isInteger(score)) {
    response.status(400).json({
      error: 'Invalid score',
      message: 'score должен быть целым числом.',
    });
    return;
  }

  if (score < -500 || score > 500) {
    response.status(400).json({
      error: 'Score out of range',
      message: 'score должен быть в диапазоне от -500 до 500.',
    });
    return;
  }

  if (password !== undefined && (!isNonEmptyString(password) || password.trim().length < 6 || password.trim().length > 128)) {
    response.status(400).json({
      error: 'Invalid password',
      message: 'password должен быть длиной от 6 до 128 символов.',
    });
    return;
  }

  const hasQuizSessionId = isNonEmptyString(quizSessionId);
  if (score !== 0 && !hasQuizSessionId) {
    response.status(400).json({
      error: 'Missing quizSessionId',
      message: 'Для записи результата викторины требуется quizSessionId.',
    });
    return;
  }

  if (
    quizSessionId !== undefined &&
    (!hasQuizSessionId ||
      quizSessionId.trim().length < 8 ||
      quizSessionId.trim().length > 128 ||
      !/^[a-zA-Z0-9_-]+$/.test(quizSessionId.trim()))
  ) {
    response.status(400).json({
      error: 'Invalid quizSessionId',
      message: 'quizSessionId должен быть строкой из латиницы/цифр/символов "_" и "-" длиной от 8 до 128.',
    });
    return;
  }

  if (level !== undefined && !isIntegerInRange(level, 1, 100000)) {
    response.status(400).json({
      error: 'Invalid level',
      message: 'level должен быть целым числом от 1 до 100000.',
    });
    return;
  }

  if (totalXP !== undefined && !isIntegerInRange(totalXP, 0, 10000000)) {
    response.status(400).json({
      error: 'Invalid totalXP',
      message: 'totalXP должен быть целым числом от 0 до 10000000.',
    });
    return;
  }

  if (currentStreak !== undefined && !isIntegerInRange(currentStreak, 0, 1000000)) {
    response.status(400).json({
      error: 'Invalid currentStreak',
      message: 'currentStreak должен быть целым числом от 0 до 1000000.',
    });
    return;
  }

  if (bestStreak !== undefined && !isIntegerInRange(bestStreak, 0, 1000000)) {
    response.status(400).json({
      error: 'Invalid bestStreak',
      message: 'bestStreak должен быть целым числом от 0 до 1000000.',
    });
    return;
  }

  if (gamesPlayed !== undefined && !isIntegerInRange(gamesPlayed, 0, 1000000)) {
    response.status(400).json({
      error: 'Invalid gamesPlayed',
      message: 'gamesPlayed должен быть целым числом от 0 до 1000000.',
    });
    return;
  }

  if (totalAnswers !== undefined && !isIntegerInRange(totalAnswers, 0, 100000000)) {
    response.status(400).json({
      error: 'Invalid totalAnswers',
      message: 'totalAnswers должен быть целым числом от 0 до 100000000.',
    });
    return;
  }

  if (correctAnswers !== undefined && !isIntegerInRange(correctAnswers, 0, 100000000)) {
    response.status(400).json({
      error: 'Invalid correctAnswers',
      message: 'correctAnswers должен быть целым числом от 0 до 100000000.',
    });
    return;
  }

  if (achievements !== undefined) {
    if (!Array.isArray(achievements) || achievements.length > 256) {
      response.status(400).json({
        error: 'Invalid achievements',
        message: 'achievements должен быть массивом до 256 элементов.',
      });
      return;
    }
    const validAchievements = achievements.every((item) =>
      isPlainObject(item) &&
      isNonEmptyString(item.id) &&
      isNonEmptyString(item.name) &&
      isNonEmptyString(item.description) &&
      isNonEmptyString(item.icon) &&
      isNonEmptyString(item.unlockedAt),
    );
    if (!validAchievements) {
      response.status(400).json({
        error: 'Invalid achievements',
        message: 'Каждое достижение должно содержать id, name, description, icon, unlockedAt.',
      });
      return;
    }
  }

  if (unlockedItems !== undefined) {
    if (
      !Array.isArray(unlockedItems) ||
      unlockedItems.length > 256 ||
      !unlockedItems.every((item) => typeof item === 'string' && item.trim().length > 0 && item.trim().length <= 80)
    ) {
      response.status(400).json({
        error: 'Invalid unlockedItems',
        message: 'unlockedItems должен быть массивом строк (до 256 элементов).',
      });
      return;
    }
  }

  if (profileSettings !== undefined) {
    if (!isPlainObject(profileSettings)) {
      response.status(400).json({
        error: 'Invalid profileSettings',
        message: 'profileSettings должен быть объектом.',
      });
      return;
    }
    const jsonSize = JSON.stringify(profileSettings).length;
    if (jsonSize > 5000) {
      response.status(400).json({
        error: 'Invalid profileSettings',
        message: 'profileSettings слишком большой.',
      });
      return;
    }
  }

  if (lastPlayedAt !== undefined && (typeof lastPlayedAt !== 'string' || lastPlayedAt.trim().length > 64)) {
    response.status(400).json({
      error: 'Invalid lastPlayedAt',
      message: 'lastPlayedAt должен быть строкой длиной до 64 символов.',
    });
    return;
  }

  request.body = {
    username: username.trim(),
    email: email.trim().toLowerCase(),
    avatar: avatar.trim(),
    score,
    ...(avatarColor !== undefined ? { avatarColor: avatarColor.trim() } : {}),
    ...(password !== undefined ? { password: password.trim() } : {}),
    ...(hasQuizSessionId ? { quizSessionId: quizSessionId.trim() } : {}),
    ...(level !== undefined ? { level } : {}),
    ...(totalXP !== undefined ? { totalXP } : {}),
    ...(currentStreak !== undefined ? { currentStreak } : {}),
    ...(bestStreak !== undefined ? { bestStreak } : {}),
    ...(gamesPlayed !== undefined ? { gamesPlayed } : {}),
    ...(totalAnswers !== undefined ? { totalAnswers } : {}),
    ...(correctAnswers !== undefined ? { correctAnswers } : {}),
    ...(achievements !== undefined ? { achievements } : {}),
    ...(unlockedItems !== undefined ? { unlockedItems: unlockedItems.map((item) => item.trim()) } : {}),
    ...(profileSettings !== undefined ? { profileSettings } : {}),
    ...(lastPlayedAt !== undefined ? { lastPlayedAt: lastPlayedAt.trim() } : {}),
  };

  next();
};

export const validateAuthRegister = (request, response, next) => {
  const { username, email, password, avatar, avatarColor } = request.body ?? {};

  if (!isNonEmptyString(username) || username.trim().length < 3 || username.trim().length > 32) {
    response.status(400).json({
      error: 'Invalid username',
      message: 'username обязателен и должен быть длиной от 3 до 32 символов.',
    });
    return;
  }

  if (!isNonEmptyString(email) || !EMAIL_REGEX.test(email.trim())) {
    response.status(400).json({
      error: 'Invalid email',
      message: 'email обязателен и должен быть корректным.',
    });
    return;
  }

  if (!isNonEmptyString(password) || password.trim().length < 6 || password.trim().length > 128) {
    response.status(400).json({
      error: 'Invalid password',
      message: 'password обязателен и должен быть длиной от 6 до 128 символов.',
    });
    return;
  }

  if (!isNonEmptyString(avatar) || avatar.trim().length > 32) {
    response.status(400).json({
      error: 'Invalid avatar',
      message: 'avatar обязателен и не должен превышать 32 символа.',
    });
    return;
  }

  if (avatarColor !== undefined && (typeof avatarColor !== 'string' || avatarColor.trim().length > 32)) {
    response.status(400).json({
      error: 'Invalid avatarColor',
      message: 'avatarColor должен быть строкой длиной до 32 символов.',
    });
    return;
  }

  request.body = {
    username: username.trim(),
    email: email.trim().toLowerCase(),
    password: password.trim(),
    avatar: avatar.trim(),
    ...(avatarColor !== undefined ? { avatarColor: avatarColor.trim() } : {}),
  };

  next();
};

export const validateAuthLogin = (request, response, next) => {
  const { identity, password } = request.body ?? {};

  if (!isNonEmptyString(identity) || identity.trim().length < 3 || identity.trim().length > 128) {
    response.status(400).json({
      error: 'Invalid identity',
      message: 'identity обязателен и должен быть длиной от 3 до 128 символов.',
    });
    return;
  }

  if (!isNonEmptyString(password) || password.trim().length < 6 || password.trim().length > 128) {
    response.status(400).json({
      error: 'Invalid password',
      message: 'password обязателен и должен быть длиной от 6 до 128 символов.',
    });
    return;
  }

  request.body = {
    identity: identity.trim().toLowerCase(),
    password: password.trim(),
  };

  next();
};

export const validateProfileQuery = (request, response, next) => {
  const id = request.query.id;
  const username = typeof request.query.username === 'string' ? request.query.username.trim() : '';
  const email = typeof request.query.email === 'string' ? request.query.email.trim().toLowerCase() : '';

  const hasId = Number.isFinite(Number(id));
  const hasUsername = username.length > 0;
  const hasEmail = email.length > 0;

  if (!hasId && !hasUsername && !hasEmail) {
    response.status(400).json({
      error: 'Missing query params',
      message: 'Укажите id или username или email.',
    });
    return;
  }

  if (hasEmail && !EMAIL_REGEX.test(email)) {
    response.status(400).json({
      error: 'Invalid email',
      message: 'email в query имеет неверный формат.',
    });
    return;
  }

  request.validatedQuery = {
    id: hasId ? Number(id) : undefined,
    username: hasUsername ? username : undefined,
    email: hasEmail ? email : undefined,
  };

  next();
};
