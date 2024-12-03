import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog } from "@/components/ui/dialog";

export default function App() {
  const [recipes, setRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentRecipe, setCurrentRecipe] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const isFormValid =
    currentRecipe?.name.trim() &&
    currentRecipe?.ingredients.trim() &&
    currentRecipe?.instructions.trim();

  const handleAddOrUpdateRecipe = () => {
    if (!isFormValid) return;

    if (currentRecipe.id) {
      setRecipes((prev) =>
        prev.map((r) => (r.id === currentRecipe.id ? currentRecipe : r))
      );
    } else {
      setRecipes((prev) => [
        ...prev,
        {
          ...currentRecipe,
          id: Date.now(),
          tags: parseTags(currentRecipe.tags),
        },
      ]);
    }
    resetForm();
  };

  const handleEditRecipe = (recipe) => {
    setCurrentRecipe({
      ...recipe,
      tags: Array.isArray(recipe.tags) ? recipe.tags.join(", ") : recipe.tags,
    });
    setDialogOpen(true);
  };

  const handleDeleteRecipe = (id) => {
    setRecipes((prev) => prev.filter((recipe) => recipe.id !== id));
  };

  const resetForm = () => {
    setCurrentRecipe({
      name: "",
      ingredients: "",
      instructions: "",
      tags: "",
    });
    setDialogOpen(false);
  };

  const parseTags = (tags) =>
    tags
      ?.split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag);

  const filteredRecipes = recipes.filter((recipe) =>
    [recipe.name, ...(Array.isArray(recipe.tags) ? recipe.tags : [])].some((field) =>
      field.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Recipe Organizer</h1>
      <div className="flex flex-col items-center space-y-4">
        <Input
          placeholder="Search recipes or tags..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-2/3 sm:w-1/2"
        />
        <Button
          onClick={() => {
            resetForm();
            setDialogOpen(true);
          }}
          className="w-2/3 sm:w-1/2 bg-green-500 hover:bg-green-600 text-white"
        >
          Add Recipe
        </Button>
      </div>
      <div className="mt-6">
        {recipes.length === 0 ? (
          <p className="text-center text-black">No recipes added.</p>
        ) : filteredRecipes.length === 0 ? (
          <p className="text-center text-red-500">No recipes found.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredRecipes.map((recipe) => (
              <div
                key={recipe.id}
                className="p-4 bg-blue-50 border rounded-lg shadow hover:shadow-lg"
              >
                <h2 className="text-xl font-semibold mb-2">{recipe.name}</h2>
                <p className="text-sm text-gray-700">
                  Tags: {Array.isArray(recipe.tags) ? recipe.tags.join(", ") : ""}
                </p>
                <div className="mt-4 flex space-x-2">
                  <Button
                    onClick={() => handleEditRecipe(recipe)}
                    className="bg-yellow-500 hover:bg-yellow-600"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleDeleteRecipe(recipe.id)}
                    className="bg-red-500 hover:bg-red-600"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        {dialogOpen && (
          <div className="p-6 bg-white rounded-lg shadow-md space-y-4 w-full max-w-md mx-auto">
            <h2 className="text-xl font-semibold">Add / Edit Recipe</h2>
            <Input
              placeholder="Recipe Name"
              value={currentRecipe?.name || ""}
              onChange={(e) =>
                setCurrentRecipe((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
            />
            <Textarea
              placeholder="Ingredients (comma-separated)"
              value={currentRecipe?.ingredients || ""}
              onChange={(e) =>
                setCurrentRecipe((prev) => ({
                  ...prev,
                  ingredients: e.target.value,
                }))
              }
            />
            <Textarea
              placeholder="Instructions"
              value={currentRecipe?.instructions || ""}
              onChange={(e) =>
                setCurrentRecipe((prev) => ({
                  ...prev,
                  instructions: e.target.value,
                }))
              }
            />
            <Input
              placeholder="Tags (comma-separated)"
              value={currentRecipe?.tags || ""}
              onChange={(e) =>
                setCurrentRecipe((prev) => ({
                  ...prev,
                  tags: e.target.value,
                }))
              }
            />
            <Button
              onClick={handleAddOrUpdateRecipe}
              disabled={!isFormValid}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white"
            >
              Save Recipe
            </Button>
          </div>
        )}
      </Dialog>
    </div>
  );
}
