const requestBuckets = new Map();

export const basicRateLimit = ({ windowMs, maxRequests }) => (request, response, next) => {
  const ip = request.ip ?? request.socket?.remoteAddress ?? 'unknown';
  const now = Date.now();
  const bucket = requestBuckets.get(ip);

  if (!bucket || now > bucket.resetAt) {
    requestBuckets.set(ip, { count: 1, resetAt: now + windowMs });
    next();
    return;
  }

  if (bucket.count >= maxRequests) {
    response.status(429).json({
      error: 'Too many requests',
      message: 'Слишком много запросов. Повторите позже.',
    });
    return;
  }

  bucket.count += 1;
  next();
};

export const notFoundHandler = (request, response) => {
  response.status(404).json({
    error: 'Not found',
    message: `Route ${request.method} ${request.path} не найдена`,
  });
};

export const errorHandler = (error, request, response, _next) => {
  console.error(`[server-error] ${request.method} ${request.path}`, error);
  response.status(500).json({
    error: 'Internal server error',
    message: 'Произошла ошибка на сервере.',
  });
};
