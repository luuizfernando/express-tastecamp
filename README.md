# Recipe API 🍳

This is a simple **Recipe API** built with **Express** and **Node.js**. The API allows users to retrieve, add, and filter recipes by ingredients. Additionally, specific recipes can be accessed via a unique ID, and there's an authorization mechanism for certain routes.

## 🌐 Endpoints

- **GET** `/receitas`: Retrieve all recipes or filter them by ingredients.
- **GET** `/receitas/:id`: Retrieve a recipe by its ID (requires authorization).
- **POST** `/receitas`: Add a new recipe.

---

## 🛠️ Technologies Used

- **JavaScript (ES6+)** - Modern JavaScript features.
- **Express** - Minimal and flexible Node.js web framework.
- **Node.js** - JavaScript runtime environment.
- **CORS** - Middleware to enable Cross-Origin Resource Sharing.

---

## 🚀 Features

- **Retrieve Recipes**: Fetch all recipes or filter by ingredient.
- **Add New Recipe**: Users can add new recipes by providing a title, ingredients, and preparation steps.
- **Authorization for Specific Routes**: The `GET /receitas/:id` route requires an authorization header to access the data.
- **Ingredient Filtering**: Recipes can be filtered by specific ingredients using query parameters.

---

## 🎮 How to Use

### **Retrieve All Recipes**

- **Endpoint**: `GET /receitas`
- **Query Params** (optional):  
  - `ingredientes`: Filter recipes by specific ingredients.
- **Example**:  
  `GET /receitas?ingredientes=whey`

### **Retrieve a Recipe by ID**

- **Endpoint**: `GET /receitas/:id`
- **Headers**:  
  - `auth`: Authorization header (e.g., `auth: Luiz`)
- **Example**:  
  `GET /receitas/1`

### **Add a New Recipe**

- **Endpoint**: `POST /receitas`
- **Body**:
    ```json
    {
      "titulo": "Example Recipe",
      "ingredientes": "Ingredient 1, Ingredient 2",
      "preparo": "Step-by-step preparation instructions"
    }
    ```

---

## 🖥️ Running Locally

If you want to run the project locally, follow these steps:

1. Clone the repository:

    ```bash
    git clone https://github.com/your-username/express-tastecamp.git
    ```

2. Install the dependencies:

    ```bash
    cd express-tastecamp
    npm install
    ```

3. Run the project:

    ```bash
    npm start
    ```

The server will be available at `http://localhost:4000`.

---

## 📝 Future Improvements

- Add authentication for other endpoints.
- Add more advanced filtering options.

---

## 👤 Developer

Developed by [Luiz Fernando](https://github.com/luuizfernando). Feel free to reach out and contribute to the project!

---

## 📫 Contato

- **Email:** [luizfernandosant26@gmail.com](mailto:luizfernandosant26@gmail.com)
- **LinkedIn:** [linkedin.com/in/luiz-fernando-dalpra](https://linkedin.com/in/luiz-fernando-dalpra)
