import React, { useState } from 'react';
import { Input, Button, Card, Dialog, Textarea } from "@/components/ui";

function App() {
  const [recipes, setRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentRecipe, setCurrentRecipe] = useState({ name: '', ingredients: '', instructions: '', tags: [] });

  const handleAddRecipe = () => {
    if (currentRecipe.id) {
      setRecipes(recipes.map(r => r.id === currentRecipe.id ? currentRecipe : r));
    } else {
      setRecipes([...recipes, { ...currentRecipe, id: Date.now() }]);
    }
    setDialogOpen(false);
    setCurrentRecipe({ name: '', ingredients: '', instructions: '', tags: [] });
  };

  const handleEditRecipe = (recipe) => {
    setCurrentRecipe(recipe);
    setDialogOpen(true);
  };

  const handleDeleteRecipe = (id) => {
    setRecipes(recipes.filter(r => r.id !== id));
  };

  const filteredRecipes = recipes.filter(recipe => 
    recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipe.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <Input 
        placeholder="Search recipes or tags..." 
        className="mb-4"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Button onClick={() => { setDialogOpen(true); setCurrentRecipe({ name: '', ingredients: '', instructions: '', tags: [] }); }} className="mb-4">
        Add Recipe
      </Button>
      
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredRecipes.map(recipe => (
          <Card key={recipe.id} className="p-4">
            <h2 className="text-xl font-bold mb-2">{recipe.name}</h2>
            <p className="text-sm mb-2">Tags: {recipe.tags.join(', ')}</p>
            <Button onClick={() => handleEditRecipe(recipe)} className="mr-2">Edit</Button>
            <Button onClick={() => handleDeleteRecipe(recipe.id)} variant="destructive">Delete</Button>
            <Button onClick={() => alert(`View functionality for ${recipe.name} would go here.`)} className="mt-2">View Recipe</Button>
          </Card>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <Card>
          <Input 
            value={currentRecipe.name} 
            onChange={(e) => setCurrentRecipe({...currentRecipe, name: e.target.value})} 
            placeholder="Recipe Name" 
            className="mb-2"
          />
          <Input 
            value={currentRecipe.tags.join(', ')} 
            onChange={(e) => setCurrentRecipe({...currentRecipe, tags: e.target.value.split(',').map(tag => tag.trim())})} 
            placeholder="Tags (comma separated)" 
            className="mb-2"
          />
          <Textarea 
            value={currentRecipe.ingredients} 
            onChange={(e) => setCurrentRecipe({...currentRecipe, ingredients: e.target.value})} 
            placeholder="Ingredients" 
            className="mb-2"
          />
          <Textarea 
            value={currentRecipe.instructions} 
            onChange={(e) => setCurrentRecipe({...currentRecipe, instructions: e.target.value})} 
            placeholder="Instructions" 
          />
          <Button onClick={handleAddRecipe} className="mt-4">Save Recipe</Button>
        </Card>
      </Dialog>
    </div>
  );
}

export default App;