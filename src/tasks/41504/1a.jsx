import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

// Shadcn components
const Button = React.forwardRef(({ className, ...props }, ref) => (
  <button
    className={cn(
      "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2",
      className
    )}
    ref={ref}
    {...props}
  />
));

const Input = React.forwardRef(({ className, type, ...props }, ref) => (
  <input
    type={type}
    className={cn(
      "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    ref={ref}
    {...props}
  />
));

const Textarea = React.forwardRef(({ className, ...props }, ref) => (
  <textarea
    className={cn(
      "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    ref={ref}
    {...props}
  />
));

const Dialog = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        {children}
        <Button onClick={onClose} className="mt-4">
          Close
        </Button>
      </div>
    </div>
  );
};

const RecipeForm = ({ recipe, onSave, onCancel }) => {
  const [name, setName] = useState(recipe?.name || "");
  const [ingredients, setIngredients] = useState(recipe?.ingredients || "");
  const [instructions, setInstructions] = useState(recipe?.instructions || "");
  const [tags, setTags] = useState(recipe?.tags?.join(", ") || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      id: recipe?.id || Date.now(),
      name,
      ingredients,
      instructions,
      tags: tags.split(",").map((tag) => tag.trim()),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        placeholder="Recipe Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <Textarea
        placeholder="Ingredients (one per line)"
        value={ingredients}
        onChange={(e) => setIngredients(e.target.value)}
        required
      />
      <Textarea
        placeholder="Instructions"
        value={instructions}
        onChange={(e) => setInstructions(e.target.value)}
        required
      />
      <Input
        placeholder="Tags (comma-separated)"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
      />
      <div className="flex justify-end space-x-2">
        <Button type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
};

const RecipeCard = ({ recipe, onEdit, onDelete, onView }) => (
  <div className="border rounded-lg p-4 space-y-2">
    <h3 className="text-lg font-semibold">{recipe.name}</h3>
    <div className="flex flex-wrap gap-1">
      {recipe.tags.map((tag) => (
        <span
          key={tag}
          className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded"
        >
          {tag}
        </span>
      ))}
    </div>
    <div className="flex justify-end space-x-2">
      <Button onClick={() => onView(recipe)}>View</Button>
      <Button onClick={() => onEdit(recipe)}>Edit</Button>
      <Button onClick={() => onDelete(recipe.id)}>Delete</Button>
    </div>
  </div>
);

export default function App() {
  const [recipes, setRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [viewingRecipe, setViewingRecipe] = useState(null);
  const [isAddingRecipe, setIsAddingRecipe] = useState(false);

  useEffect(() => {
    const storedRecipes = localStorage.getItem("recipes");
    if (storedRecipes) {
      setRecipes(JSON.parse(storedRecipes));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("recipes", JSON.stringify(recipes));
  }, [recipes]);

  const handleSaveRecipe = (recipe) => {
    if (editingRecipe) {
      setRecipes(recipes.map((r) => (r.id === recipe.id ? recipe : r)));
    } else {
      setRecipes([...recipes, recipe]);
    }
    setEditingRecipe(null);
    setIsAddingRecipe(false);
  };

  const handleDeleteRecipe = (id) => {
    setRecipes(recipes.filter((recipe) => recipe.id !== id));
  };

  const filteredRecipes = recipes.filter(
    (recipe) =>
      recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Recipe Organizer</h1>
      <div className="mb-4 flex space-x-2">
        <Input
          type="text"
          placeholder="Search recipes or tags"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow"
        />
        <Button onClick={() => setIsAddingRecipe(true)}>Add Recipe</Button>
      </div>
      <div className="space-y-4">
        {filteredRecipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            onEdit={setEditingRecipe}
            onDelete={handleDeleteRecipe}
            onView={setViewingRecipe}
          />
        ))}
      </div>
      <Dialog
        isOpen={editingRecipe !== null || isAddingRecipe}
        onClose={() => {
          setEditingRecipe(null);
          setIsAddingRecipe(false);
        }}
      >
        <h2 className="text-xl font-semibold mb-4">
          {editingRecipe ? "Edit Recipe" : "Add Recipe"}
        </h2>
        <RecipeForm
          recipe={editingRecipe}
          onSave={handleSaveRecipe}
          onCancel={() => {
            setEditingRecipe(null);
            setIsAddingRecipe(false);
          }}
        />
      </Dialog>
      <Dialog
        isOpen={viewingRecipe !== null}
        onClose={() => setViewingRecipe(null)}
      >
        {viewingRecipe && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">{viewingRecipe.name}</h2>
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Ingredients:</h3>
              <pre className="whitespace-pre-wrap">{viewingRecipe.ingredients}</pre>
            </div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Instructions:</h3>
              <pre className="whitespace-pre-wrap">{viewingRecipe.instructions}</pre>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Tags:</h3>
              <div className="flex flex-wrap gap-1">
                {viewingRecipe.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}