# Postman Testing Guide — Cooking Recipes API

Use this step-by-step guide to manually test every route and error response in the **Postman desktop app** and capture screenshots for your submission.

---

## Before You Start

1. Open a terminal in the project folder and start the server:
   ```bash
   npm run dev
   ```
2. Keep the server running. You should see:
   ```text
   Cooking Recipes API is running at http://localhost:3000
   ```
3. Open the **Postman desktop app**.
4. For each request below, click the **`+` (New Tab)** button in Postman to open a request tab.

### Where to Save Screenshots
Save every screenshot inside the **`screenshots/`** folder in this project.
- Note on Windows: Windows folder names are case-insensitive (`Screenshots` and `screenshots` refer to the same folder), while `Screenshot` (singular, without the `s`) would be a separate folder. Save your files directly into `screenshots/` so your folder name matches the assignment requirement.

---

## Part 1: Successful CRUD & Special Routes

### 1. Welcome Route — `GET /`
- **Method:** Select `GET` in the method dropdown.
- **URL:** `http://localhost:3000/`
- **Headers / Body:** None needed.
- **Click:** **Send**.
- **Expected Status:** `200 OK
- **Expected Response:**
  ```json
  {
    "message": "Welcome to the Cooking Recipes API by [FATOUMATA SIBY]!",
    "theme": "Cooking Recipes",
    "studentName": "[FATOUMATA SIBY ]",
    "nim": "[20250040215]"
  }
  ```
- **Screenshot Filename:** `screenshots/01-get-home.png`

---

### 2. List All Recipes — `GET /recipes`
- **Method:** `GET`
- **URL:** `http://localhost:3000/recipes`
- **Headers / Body:** None needed.
- **Click:** **Send**.
- **Expected Status:** `200 OK`
- **Expected Response:** A JSON array containing the 5 starting recipes (`id` 1 through 5).
- **Screenshot Filename:** `screenshots/02-get-all-recipes.png`

---

### 3. Get One Recipe by ID — `GET /recipes/:id`
- **Method:** `GET`
- **URL:** `http://localhost:3000/recipes/1`
- **Headers / Body:** None needed.
- **Click:** **Send**.
- **Expected Status:** `200 OK`
- **Expected Response:**
  ```json
  {
    "id": 1,
    "title": "Nasi Goreng Spesial",
    "category": "Main Course",
    "prepTimeMinutes": 20,
    "servings": 2,
    "difficulty": "Easy"
  }
  ```
- **Screenshot Filename:** `screenshots/03-get-recipe-by-id.png`

---

### 4. Add a New Recipe — `POST /recipes`
- **Method:** `POST`
- **URL:** `http://localhost:3000/recipes`
- **Where to Click in Postman:**
  1. Click the **Body** tab below the URL bar.
  2. Select the **raw** radio button.
  3. Change the dropdown on the right from `Text` to **JSON**.
- **JSON Body to Paste:**
  ```json
  {
    "title": "Avocado Toast",
    "category": "Breakfast",
    "prepTimeMinutes": 10,
    "servings": 1,
    "difficulty": "Easy"
  }
  ```
- **Click:** **Send**.
- **Expected Status:** `201 Created`
- **Expected Response:** The newly created recipe with `"id": 6` generated automatically:
  ```json
  {
    "id": 6,
    "title": "Avocado Toast",
    "category": "Breakfast",
    "prepTimeMinutes": 10,
    "servings": 1,
    "difficulty": "Easy"
  }
  ```
- **Screenshot Filename:** `screenshots/04-post-create-recipe.png`

---

### 5. Update an Existing Recipe — `PUT /recipes/:id`
- **Method:** `PUT`
- **URL:** `http://localhost:3000/recipes/1`
- **Where to Click in Postman:**
  1. Click the **Body** tab.
  2. Select **raw**.
  3. Select **JSON** in the format dropdown.
- **JSON Body to Paste:**
  ```json
  {
    "title": "Nasi Goreng Kampung",
    "category": "Main Course",
    "prepTimeMinutes": 25,
    "servings": 2,
    "difficulty": "Easy"
  }
  ```
- **Click:** **Send**.
- **Expected Status:** `200 OK`
- **Expected Response:** The updated recipe object with `"id": 1` and `"title": "Nasi Goreng Kampung"`.
- **Screenshot Filename:** `screenshots/05-put-update-recipe.png`

---

### 6. Category Route Without Name (All Recipes) — `GET /recipes/category`
- **Method:** `GET`
- **URL:** `http://localhost:3000/recipes/category`
- **Headers / Body:** None needed.
- **Click:** **Send**.
- **Expected Status:** `200 OK`
- **Expected Response:** A JSON array containing all recipes currently in the list.
- **Screenshot Filename:** `screenshots/06-get-category-all.png`

---

### 7. Category Route With Name (Filtered) — `GET /recipes/category/:name`
- **Method:** `GET`
- **URL:** `http://localhost:3000/recipes/category/dessert`
- **Headers / Body:** None needed.
- **Click:** **Send**.
- **Expected Status:** `200 OK`
- **Expected Response:** A JSON array containing only the recipes with `"category": "Dessert"` (`Chocolate Brownies` and `Mango Smoothie Bowl`).
- **Screenshot Filename:** `screenshots/07-get-category-filtered.png`

---

### 8. Wildcard Route — `GET /files/*path`
- **Method:** `GET`
- **URL:** `http://localhost:3000/files/images/cakes/chocolate.png`
- **Headers / Body:** None needed.
- **Click:** **Send**.
- **Expected Status:** `200 OK`
- **Expected Response:** The wildcard path segments returned as an array:
  ```json
  {
    "path": [
      "images",
      "cakes",
      "chocolate.png"
    ]
  }
  ```
- **Screenshot Filename:** `screenshots/08-get-wildcard-files.png`

---

## Part 2: Validation, Auth, and Error Handling Checks

### 9. Create Recipe With Missing/Invalid Fields — `POST /recipes` (400)
- **Method:** `POST`
- **URL:** `http://localhost:3000/recipes`
- **Where to Click in Postman:**
  1. Click the **Body** tab -> select **raw** -> select **JSON**.
- **JSON Body to Paste (empty object or missing fields):**
  ```json
  {}
  ```
- **Click:** **Send**.
- **Expected Status:** `400 Bad Request`
- **Expected Response:**
  ```json
  {
    "error": true,
    "status": 400,
    "message": "Field \"title\" is required and must be a non-empty string"
  }
  ```
- **Screenshot Filename:** `screenshots/09-post-validation-400.png`

---

### 10. Delete Recipe Without Token — `DELETE /recipes/:id` (401)
- **Method:** `DELETE`
- **URL:** `http://localhost:3000/recipes/6`
- **Headers / Body:** Make sure you do **not** add an `x-api-key` header.
- **Click:** **Send**.
- **Expected Status:** `401 Unauthorized`
- **Expected Response:**
  ```json
  {
    "error": true,
    "status": 401,
    "message": "Unauthorized: missing or invalid x-api-key header"
  }
  ```
- **Screenshot Filename:** `screenshots/10-delete-no-token-401.png`

---

### 11. Delete Recipe With Valid Token — `DELETE /recipes/:id` (200)
- **Method:** `DELETE`
- **URL:** `http://localhost:3000/recipes/6` (or `http://localhost:3000/recipes/5` if you restarted the server)
- **Where to Click in Postman:**
  1. Click the **Headers** tab below the URL bar.
  2. In the **Key** column, type `x-api-key`.
  3. In the **Value** column, type `recipes-demo-token-2026`.
  4. Make sure the checkbox next to `x-api-key` is checked.
- **Click:** **Send**.
- **Expected Status:** `200 OK`
- **Expected Response:**
  ```json
  {
    "message": "Recipe deleted successfully",
    "recipe": {
      "id": 6,
      "title": "Avocado Toast",
      "category": "Breakfast",
      "prepTimeMinutes": 10,
      "servings": 1,
      "difficulty": "Easy"
    }
  }
  ```
- **Screenshot Filename:** `screenshots/11-delete-with-token-200.png`

---

### 12. Unknown Recipe ID — `GET /recipes/:id` (404)
- **Method:** `GET`
- **URL:** `http://localhost:3000/recipes/999`
- **Headers / Body:** None needed.
- **Click:** **Send**.
- **Expected Status:** `404 Not Found`
- **Expected Response:**
  ```json
  {
    "error": true,
    "status": 404,
    "message": "Recipe with id 999 not found"
  }
  ```
- **Screenshot Filename:** `screenshots/12-get-unknown-id-404.png`

---

### 13. Unknown URL — `GET /unknown-route` (404)
- **Method:** `GET`
- **URL:** `http://localhost:3000/unknown-route`
- **Headers / Body:** None needed.
- **Click:** **Send**.
- **Expected Status:** `404 Not Found`
- **Expected Response:**
  ```json
  {
    "error": true,
    "status": 404,
    "message": "Route not found: GET /unknown-route"
  }
  ```
- **Screenshot Filename:** `screenshots/13-get-unknown-url-404.png`
