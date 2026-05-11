const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const isNonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0;

export const validateSubmitScore = (request, response, next) => {
  const { username, email, avatar, score, password, quizSessionId } = request.body ?? {};

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

  request.body = {
    username: username.trim(),
    email: email.trim().toLowerCase(),
    avatar: avatar.trim(),
    score,
    ...(password !== undefined ? { password: password.trim() } : {}),
    ...(hasQuizSessionId ? { quizSessionId: quizSessionId.trim() } : {}),
  };

  next();
};

export const validateAuthRegister = (request, response, next) => {
  const { username, email, password, avatar } = request.body ?? {};

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

  request.body = {
    username: username.trim(),
    email: email.trim().toLowerCase(),
    password: password.trim(),
    avatar: avatar.trim(),
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
