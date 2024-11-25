import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const categories = ["Breakfast", "Lunch", "Dinner", "Dessert"];

function App() {
  const [recipes, setRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newRecipe, setNewRecipe] = useState({
    name: "",
    ingredients: "",
    steps: "",
    category: "",
  });
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  // Adds a new recipe if all fields are filled
  const addRecipe = () => {
    if (newRecipe.name && newRecipe.ingredients && newRecipe.steps && newRecipe.category) {
      setRecipes((prev) => [...prev, { ...newRecipe, id: Date.now() }]);
      setNewRecipe({ name: "", ingredients: "", steps: "", category: "" });
    }
  };

  // Filters recipes by search term for name or ingredients
  const filteredRecipes = useMemo(
    () =>
      recipes.filter(
        (recipe) =>
          recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          recipe.ingredients.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [recipes, searchTerm]
  );

  // Calculates stats for each category
  const categoryStats = useMemo(() => {
    return categories.reduce((acc, category) => {
      acc[category] = recipes.filter((recipe) => recipe.category === category).length;
      return acc;
    }, {});
  }, [recipes]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Recipe Builder</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <h2 className="font-semibold mb-2">Add Recipe</h2>
          <Label>Name</Label>
          <Input
            value={newRecipe.name}
            onChange={(e) => setNewRecipe({ ...newRecipe, name: e.target.value })}
            className="mb-2"
          />
          <Label>Ingredients</Label>
          <Input
            value={newRecipe.ingredients}
            onChange={(e) => setNewRecipe({ ...newRecipe, ingredients: e.target.value })}
            className="mb-2"
          />
          <Label>Steps</Label>
          <Input
            value={newRecipe.steps}
            onChange={(e) => setNewRecipe({ ...newRecipe, steps: e.target.value })}
            className="mb-2"
          />
          <Label>Category</Label>
          <select
            value={newRecipe.category}
            onChange={(e) => setNewRecipe({ ...newRecipe, category: e.target.value })}
            className="mb-2 p-2 border rounded"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <Button onClick={addRecipe} className="mt-2">
            Add Recipe
          </Button>
        </div>
        <div>
          <h2 className="font-semibold mb-2">Recipes</h2>
          <Input
            placeholder="Search recipes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-2"
          />
          {filteredRecipes.map((recipe) => (
            <Card
              key={recipe.id}
              className="mb-2 cursor-pointer"
              onClick={() => setSelectedRecipe(recipe)}
            >
              <CardHeader>
                <CardTitle>{recipe.name}</CardTitle>
              </CardHeader>
            </Card>
          ))}
          {selectedRecipe && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>{selectedRecipe.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  <strong>Ingredients:</strong> {selectedRecipe.ingredients}
                </p>
                <p>
                  <strong>Steps:</strong> {selectedRecipe.steps}
                </p>
                <p>
                  <strong>Category:</strong> {selectedRecipe.category}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Category Summary</h2>
        {categories.map((category) => (
          <div key={category} className="mb-2">
            {category}: {categoryStats[category] || 0}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
