// Simple demo token for protecting DELETE requests (not a real secret).
const DEMO_TOKEN = 'recipes-demo-token-2026';

// Logs the HTTP method and URL for every incoming request.
function logger(req, res, next) {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
}

// Protects routes (such as DELETE) by checking the x-api-key request header.
function requireAuth(req, res, next) {
  const token = req.headers['x-api-key'];

  if (!token || token !== DEMO_TOKEN) {
    return res.status(401).json({
      error: true,
      status: 401,
      message: 'Unauthorized: missing or invalid x-api-key header',
    });
  }

  next();
}

// Handles any request that did not match a route above it.
function notFound(req, res, next) {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  error.status = 404;
  next(error);
}

// Express 4-parameter error handler: must stay last in index.js.
function errorHandler(err, req, res, next) {
  // Handle invalid JSON syntax sent by a client without crashing.
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      error: true,
      status: 400,
      message: 'Invalid JSON format in request body',
    });
  }

  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  res.status(status).json({
    error: true,
    status,
    message,
  });
}

module.exports = {
  DEMO_TOKEN,
  logger,
  requireAuth,
  notFound,
  errorHandler,
};
