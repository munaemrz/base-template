import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const RecipeForm = ({ addRecipe }) => {
  const [name, setName] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [steps, setSteps] = useState("");
  const [category, setCategory] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    addRecipe({ name, ingredients, steps, category });
    setName("");
    setIngredients("");
    setSteps("");
    setCategory("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Recipe Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="ingredients">Ingredients (with quantities)</Label>
        <Textarea
          id="ingredients"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="steps">Preparation Steps</Label>
        <Textarea
          id="steps"
          value={steps}
          onChange={(e) => setSteps(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="category">Category</Label>
        <Select onValueChange={setCategory} required>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Breakfast">Breakfast</SelectItem>
            <SelectItem value="Lunch">Lunch</SelectItem>
            <SelectItem value="Dinner">Dinner</SelectItem>
            <SelectItem value="Dessert">Dessert</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit">Add Recipe</Button>
    </form>
  );
};

const RecipeList = ({ recipes, setSelectedRecipe, searchTerm }) => {
  const filteredRecipes = recipes.filter(
    (recipe) =>
      recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.ingredients.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-2">
      {filteredRecipes.map((recipe, index) => (
        <Card key={index} className="cursor-pointer hover:bg-gray-100" onClick={() => setSelectedRecipe(recipe)}>
          <CardHeader>
            <CardTitle>{recipe.name}</CardTitle>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
};

const RecipeDetail = ({ recipe }) => {
  if (!recipe) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{recipe.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <h3 className="font-bold">Ingredients:</h3>
        <p>{recipe.ingredients}</p>
        <h3 className="font-bold mt-4">Steps:</h3>
        <p>{recipe.steps}</p>
        <p className="mt-4">
          <span className="font-bold">Category:</span> {recipe.category}
        </p>
      </CardContent>
    </Card>
  );
};

const CategorySummary = ({ recipes }) => {
  const categoryCounts = recipes.reduce((acc, recipe) => {
    acc[recipe.category] = (acc[recipe.category] || 0) + 1;
    return acc;
  }, {});

  const categories = Object.keys(categoryCounts);
  const maxCount = Math.max(...Object.values(categoryCounts));

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">Recipe Count by Category</h2>
      <div className="space-y-2">
        {categories.map((category) => (
          <div key={category} className="flex items-center">
            <div className="w-24">{category}</div>
            <div
              className="bg-blue-500 h-4"
              style={{ width: `${(categoryCounts[category] / maxCount) * 100}%` }}
            ></div>
            <div className="ml-2">{categoryCounts[category]}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function App() {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const storedRecipes = localStorage.getItem("recipes");
    if (storedRecipes) {
      setRecipes(JSON.parse(storedRecipes));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("recipes", JSON.stringify(recipes));
  }, [recipes]);

  const addRecipe = (recipe) => {
    setRecipes([...recipes, recipe]);
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Recipe Builder</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="mb-4">Add New Recipe</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Recipe</DialogTitle>
              </DialogHeader>
              <RecipeForm addRecipe={addRecipe} />
            </DialogContent>
          </Dialog>
          <Input
            placeholder="Search recipes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-4"
          />
          <RecipeList
            recipes={recipes}
            setSelectedRecipe={setSelectedRecipe}
            searchTerm={searchTerm}
          />
        </div>
        <div>
          <RecipeDetail recipe={selectedRecipe} />
        </div>
      </div>
      <CategorySummary recipes={recipes} />
    </div>
  );
}