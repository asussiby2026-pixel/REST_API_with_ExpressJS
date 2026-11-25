const express = require('express');
const { requireAuth } = require('../middleware');

const router = express.Router();

// Starting recipe data stored in memory as an array of objects.
const recipes = [
  {
    id: 1,
    title: 'Nasi Goreng Spesial',
    category: 'Main Course',
    prepTimeMinutes: 20,
    servings: 2,
    difficulty: 'Easy',
  },
  {
    id: 2,
    title: 'Chicken Soto',
    category: 'Main Course',
    prepTimeMinutes: 45,
    servings: 4,
    difficulty: 'Medium',
  },
  {
    id: 3,
    title: 'Banana Pancakes',
    category: 'Breakfast',
    prepTimeMinutes: 15,
    servings: 2,
    difficulty: 'Easy',
  },
  {
    id: 4,
    title: 'Chocolate Brownies',
    category: 'Dessert',
    prepTimeMinutes: 40,
    servings: 8,
    difficulty: 'Medium',
  },
  {
    id: 5,
    title: 'Mango Smoothie Bowl',
    category: 'Dessert',
    prepTimeMinutes: 10,
    servings: 1,
    difficulty: 'Easy',
  },
];

// Counter for automatically generating the next recipe id.
let nextId = 6;

// Validates POST and PUT request bodies using simple if/else checks.
function validateRecipeInput(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return 'Request body must be a JSON object';
  }

  const { title, category, prepTimeMinutes, servings, difficulty } = body;

  if (typeof title !== 'string' || title.trim() === '') {
    return 'Field "title" is required and must be a non-empty string';
  } else if (typeof category !== 'string' || category.trim() === '') {
    return 'Field "category" is required and must be a non-empty string';
  } else if (
    typeof prepTimeMinutes !== 'number' ||
    Number.isNaN(prepTimeMinutes) ||
    prepTimeMinutes <= 0
  ) {
    return 'Field "prepTimeMinutes" is required and must be a positive number';
  } else if (
    typeof servings !== 'number' ||
    Number.isNaN(servings) ||
    servings <= 0
  ) {
    return 'Field "servings" is required and must be a positive number';
  } else if (typeof difficulty !== 'string' || difficulty.trim() === '') {
    return 'Field "difficulty" is required and must be a non-empty string';
  }

  return null;
}

// Helper to create an Error object with an HTTP status code.
function createNotFoundError(id) {
  const error = new Error(`Recipe with id ${id} not found`);
  error.status = 404;
  return error;
}

// Group GET /recipes and POST /recipes on the '/' path.
router
  .route('/')
  .get((req, res) => {
    res.status(200).json(recipes);
  })
  .post((req, res) => {
    const validationError = validateRecipeInput(req.body);

    if (validationError) {
      return res.status(400).json({
        error: true,
        status: 400,
        message: validationError,
      });
    }

    const newRecipe = {
      id: nextId++,
      title: req.body.title.trim(),
      category: req.body.category.trim(),
      prepTimeMinutes: req.body.prepTimeMinutes,
      servings: req.body.servings,
      difficulty: req.body.difficulty.trim(),
    };

    recipes.push(newRecipe);
    res.status(201).json(newRecipe);
  });

// Specific route registered BEFORE '/:id' so "category" is not treated as an id.
// Express 5 optional parameter: '/category{/:name}' works with or without :name.
router.get('/category{/:name}', (req, res) => {
  const { name } = req.params;

  if (!name) {
    return res.status(200).json(recipes);
  }

  const filteredRecipes = recipes.filter(
    (recipe) => recipe.category.toLowerCase() === name.toLowerCase()
  );

  res.status(200).json(filteredRecipes);
});

// Group GET, PUT, and DELETE for '/recipes/:id' using router.route().
router
  .route('/:id')
  .get(async (req, res) => {
    const id = Number(req.params.id);
    const recipe = recipes.find((item) => item.id === id);

    if (!recipe) {
      throw createNotFoundError(req.params.id);
    }

    res.status(200).json(recipe);
  })
  .put(async (req, res) => {
    const id = Number(req.params.id);
    const recipe = recipes.find((item) => item.id === id);

    if (!recipe) {
      throw createNotFoundError(req.params.id);
    }

    const validationError = validateRecipeInput(req.body);

    if (validationError) {
      return res.status(400).json({
        error: true,
        status: 400,
        message: validationError,
      });
    }

    recipe.title = req.body.title.trim();
    recipe.category = req.body.category.trim();
    recipe.prepTimeMinutes = req.body.prepTimeMinutes;
    recipe.servings = req.body.servings;
    recipe.difficulty = req.body.difficulty.trim();

    res.status(200).json(recipe);
  })
  .delete(requireAuth, async (req, res) => {
    const id = Number(req.params.id);
    const index = recipes.findIndex((item) => item.id === id);

    if (index === -1) {
      throw createNotFoundError(req.params.id);
    }

    const deletedRecipes = recipes.splice(index, 1);

    res.status(200).json({
      message: 'Recipe deleted successfully',
      recipe: deletedRecipes[0],
    });
  });

module.exports = router;
