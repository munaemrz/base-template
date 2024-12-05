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
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);

  const handleAddOrUpdateRecipe = () => {
    if (!isFormValid) return;

    const newRecipe = {
      ...currentRecipe,
      tags: parseTags(currentRecipe.tags), // Ensure tags are stored as an array
    };

    if (currentRecipe.id) {
      setRecipes((prev) =>
        prev.map((recipe) => (recipe.id === currentRecipe.id ? newRecipe : recipe))
      );
    } else {
      setRecipes((prev) => [...prev, { ...newRecipe, id: Date.now() }]);
    }

    resetForm();
  };

  const handleEditRecipe = (recipe) => {
    setCurrentRecipe({
      ...recipe,
      tags: (recipe.tags || []).join(", "), // Convert array to string for input field
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
      .map((tag) => tag.trim().toLowerCase())
      .filter((tag, index, self) => tag && self.indexOf(tag) === index);

  const handleViewRecipe = (recipe) => {
    setCurrentRecipe(recipe);
    setViewDialogOpen(true);
  };

  const handleTagSelection = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : [...prev, tag]
    );
  };

  const filteredRecipes = recipes.filter((recipe) => {
    const matchesSearchTerm = [recipe.name, ...(recipe.tags || [])].some((field) =>
      field.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesTags =
      selectedTags.length === 0 ||
      (recipe.tags || []).some((tag) => selectedTags.includes(tag.toLowerCase()));
    return matchesSearchTerm && matchesTags;
  });

  const uniqueTags = [
    ...new Set(
      recipes.flatMap((recipe) => recipe.tags || []).map((tag) => tag.toLowerCase())
    ),
  ];

  const isFormValid =
    currentRecipe?.name.trim() &&
    currentRecipe?.ingredients.trim() &&
    currentRecipe?.instructions.trim() &&
    currentRecipe?.tags.trim();

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Recipe Organizer</h1>
      <div className="flex flex-col items-center space-y-4">
        <Input
          placeholder="Search recipes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-2/3 sm:w-1/2"
        />
        <div className="relative w-2/3 sm:w-1/2">
          <button
            className="w-full border p-2 rounded bg-gray-100 text-left"
            onClick={() =>
              document.getElementById("tagDropdown").classList.toggle("hidden")
            }
          >
            {selectedTags.length > 0
              ? `Selected Tags: ${selectedTags.join(", ")}`
              : "Select Tags"}
          </button>
          <div
            id="tagDropdown"
            className="absolute bg-white border rounded shadow p-2 mt-1 w-full hidden"
          >
            {uniqueTags.map((tag) => (
              <label key={tag} className="flex items-center space-x-2 py-1">
                <input
                  type="checkbox"
                  checked={selectedTags.includes(tag)}
                  onChange={() => handleTagSelection(tag)}
                />
                <span>{tag.charAt(0).toUpperCase() + tag.slice(1)}</span>
              </label>
            ))}
          </div>
        </div>
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
                  Tags: {recipe.tags ? recipe.tags.join(", ") : ""}
                </p>
                <div className="mt-4 flex space-x-2">
                  <Button
                    onClick={() => handleViewRecipe(recipe)}
                    className="bg-blue-500 hover:bg-blue-600"
                  >
                    View Recipe
                  </Button>
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
              className={`w-full ${
                isFormValid
                  ? "bg-blue-500 hover:bg-blue-600 text-white"
                  : "bg-gray-400 text-gray-700"
              }`}
            >
              Save Recipe
            </Button>
          </div>
        )}
      </Dialog>
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        {viewDialogOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="relative p-6 bg-white rounded-lg shadow-md space-y-4 w-full max-w-md mx-auto">
              <button
                onClick={() => setViewDialogOpen(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-black"
              >
                &times;
              </button>
              <h2 className="text-xl font-semibold">{currentRecipe?.name}</h2>
              <p>
                <strong>Ingredients:</strong> {currentRecipe?.ingredients}
              </p>
              <p>
                <strong>Instructions:</strong> {currentRecipe?.instructions}
              </p>
              <p>
                <strong>Tags:</strong> {recipe.tags ? recipe.tags.join(", ") : ""}
              </p>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}
