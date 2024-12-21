import React, { useState, useEffect } from 'react';
import { collection, getDocs } from "firebase/firestore";
import { db } from '../firebaseConfig'; // Import your Firestore instance

const Recipes = () => {
  const [recipes, setRecipes] = useState([]); // List of recipes
  const [selectedRecipe, setSelectedRecipe] = useState(null); // Currently selected recipe

  useEffect(() => {
    const fetchRecipes = async () => {
      const querySnapshot = await getDocs(collection(db, "Recipes"));
      const fetchedRecipes = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRecipes(fetchedRecipes);
    };
    fetchRecipes();
  }, []);

  // Function to handle recipe click
  const handleRecipeClick = (recipe) => {
    setSelectedRecipe(recipe);
  };

  return (
    <div>
      <h1>Recipes</h1>

      {/* List of recipes */}
      <ul>
        {recipes.map((recipe) => (
          <li key={recipe.id} style={{ marginBottom: '10px' }}>
            <button
              style={{ cursor: 'pointer', textDecoration: 'underline', background: 'none', border: 'none', color: 'blue' }}
              onClick={() => handleRecipeClick(recipe)}
            >
              {recipe.Name}
            </button>
          </li>
        ))}
      </ul>

      {/* Display selected recipe details */}
      {selectedRecipe && (
        <div>
          <h2>{selectedRecipe.Name}</h2>
          <p>Items: {selectedRecipe.Items}</p>
        </div>
      )}
    </div>
  );
};

export default Recipes;
