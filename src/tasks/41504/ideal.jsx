import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog } from "@/components/ui/dialog";

export default function App() {
  const [recipes, setRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentRecipe, setCurrentRecipe] = useState({
    name: "",
    ingredients: "",
    instructions: "",
    tags: "",
  });
  const [dialogOpen, setDialogOpen] = useState(false);

  const isFormValid =
    currentRecipe.name.trim() &&
    currentRecipe.ingredients.trim() &&
    currentRecipe.instructions.trim();

  const handleAddOrUpdateRecipe = () => {
    if (!isFormValid) return;

    if (currentRecipe.id) {
      setRecipes((prev) =>
        prev.map((r) => (r.id === currentRecipe.id ? currentRecipe : r))
      );
    } else {
      setRecipes((prev) => [
        ...prev,
        { ...currentRecipe, id: Date.now(), tags: parseTags(currentRecipe.tags) },
      ]);
    }
    resetForm();
  };

  const handleEditRecipe = (recipe) => {
    setCurrentRecipe({
      ...recipe,
      tags: recipe.tags.join(", "),
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
    tags.split(",").map((tag) => tag.trim()).filter((tag) => tag);

  const filteredRecipes = recipes.filter((recipe) =>
    [recipe.name, ...recipe.tags].some((field) =>
      field.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <h1 className="text-2xl font-bold mb-4">Recipe Organizer</h1>
      <Input
        placeholder="Search recipes or tags..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />
      <Button
        onClick={() => {
          setDialogOpen(true);
          resetForm();
        }}
        className="mb-4"
      >
        Add Recipe
      </Button>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredRecipes.map((recipe) => (
          <div key={recipe.id} className="p-4 border rounded shadow">
            <h2 className="text-xl font-bold mb-2">{recipe.name}</h2>
            <p className="text-sm">Tags: {recipe.tags.join(", ")}</p>
            <div className="mt-4 flex space-x-2">
              <Button onClick={() => handleEditRecipe(recipe)}>Edit</Button>
              <Button variant="destructive" onClick={() => handleDeleteRecipe(recipe.id)}>
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <div className="p-4 space-y-4">
          <Input
            placeholder="Recipe Name"
            value={currentRecipe.name}
            onChange={(e) =>
              setCurrentRecipe((prev) => ({ ...prev, name: e.target.value }))
            }
          />
          <Textarea
            placeholder="Ingredients (comma-separated)"
            value={currentRecipe.ingredients}
            onChange={(e) =>
              setCurrentRecipe((prev) => ({ ...prev, ingredients: e.target.value }))
            }
          />
          <Textarea
            placeholder="Instructions"
            value={currentRecipe.instructions}
            onChange={(e) =>
              setCurrentRecipe((prev) => ({ ...prev, instructions: e.target.value }))
            }
          />
          <Input
            placeholder="Tags (comma-separated)"
            value={currentRecipe.tags}
            onChange={(e) =>
              setCurrentRecipe((prev) => ({ ...prev, tags: e.target.value }))
            }
          />
          <Button
            onClick={handleAddOrUpdateRecipe}
            disabled={!isFormValid}
            className="w-full"
          >
            Save Recipe
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
