const express = require('express');
const { logger, notFound, errorHandler } = require('./middleware');
const recipesRouter = require('./routes/recipes');

const app = express();
const PORT = 3000;

// 1. Custom request logger + built-in JSON body parser middleware
app.use(logger);
app.use(express.json());

// 2. Application routes
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to the Cooking Recipes API by [FATOUMATA SIBY]!',
    theme: 'Cooking Recipes',
    studentName: '[FATOUMATA SIBY]',
    nim: '[20250040215]',
  });
});

// Mount the recipes router at /recipes
app.use('/recipes', recipesRouter);

// Express 5 named wildcard route: returns the wildcard path segments as an array
app.get('/files/*path', (req, res) => {
  res.status(200).json({
    path: req.params.path,
  });
});

// 3. 404 handler for any unknown URL
app.use(notFound);

// 4. Four-parameter error handler MUST be the last app.use()
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Cooking Recipes API is running at http://localhost:${PORT}`);
});
