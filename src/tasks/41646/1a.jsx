import React, { useState, useEffect, useMemo } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

function App() {
  const [recipes, setRecipes] = useState([]);
  const [newRecipe, setNewRecipe] = useState({ name: '', ingredients: [], steps: [] });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const categories = useMemo(() => {
    const cats = { 'All': recipes.length };
    recipes.forEach(recipe => {
      cats[recipe.category] = (cats[recipe.category] || 0) + 1;
    });
    return cats;
  }, [recipes]);

  const addIngredient = () => {
    setNewRecipe(prev => ({ ...prev, ingredients: [...prev.ingredients, { name: '', quantity: '' }] }));
  };

  const updateIngredient = (index, field, value) => {
    const updatedIngredients = [...newRecipe.ingredients];
    updatedIngredients[index][field] = value;
    setNewRecipe(prev => ({ ...prev, ingredients: updatedIngredients }));
  };

  const addRecipe = () => {
    if (newRecipe.name && newRecipe.ingredients.length > 0 && newRecipe.steps.length > 0) {
      setRecipes(prev => [...prev, { ...newRecipe, id: Date.now() }]);
      setNewRecipe({ name: '', ingredients: [], steps: [] });
    }
  };

  const filteredRecipes = useMemo(() => {
    return recipes.filter(recipe => 
      recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.ingredients.some(ing => ing.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [recipes, searchTerm]);

  const RecipeList = () => (
    <ScrollArea className="h-full w-full">
      {filteredRecipes.map(recipe => (
        <Card key={recipe.id} className="mb-2 cursor-pointer" onClick={() => setSelectedRecipe(recipe)}>
          <CardHeader>
            <CardTitle>{recipe.name}</CardTitle>
          </CardHeader>
        </Card>
      ))}
    </ScrollArea>
  );

  const RecipeDetail = () => (
    <Card>
      <CardHeader>
        <CardTitle>{selectedRecipe.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <h4 className="font-bold">Ingredients:</h4>
        <ul>
          {selectedRecipe.ingredients.map((ing, idx) => (
            <li key={idx}>{ing.quantity} {ing.name}</li>
          ))}
        </ul>
        <h4 className="font-bold mt-2">Steps:</h4>
        <ol>
          {selectedRecipe.steps.map((step, idx) => (
            <li key={idx}>{step}</li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto p-4 sm:p-8">
      <Tabs defaultValue="list" className="w-full">
        <TabsList>
          <TabsTrigger value="list">List</TabsTrigger>
          <TabsTrigger value="add">Add Recipe</TabsTrigger>
          <TabsTrigger value="stats">Stats</TabsTrigger>
        </TabsList>
        <TabsContent value="list">
          <Input 
            placeholder="Search recipes..." 
            value={searchTerm} 
            onChange={e => setSearchTerm(e.target.value)} 
            className="mb-4"
          />
          {selectedRecipe ? <RecipeDetail /> : <RecipeList />}
        </TabsContent>
        <TabsContent value="add">
          <Input 
            value={newRecipe.name} 
            onChange={e => setNewRecipe({ ...newRecipe, name: e.target.value })} 
            placeholder="Recipe Name" 
            className="mb-2"
          />
          <Label>Ingredients</Label>
          {newRecipe.ingredients.map((ing, idx) => (
            <div key={idx} className="flex mb-2">
              <Input 
                value={ing.name} 
                onChange={e => updateIngredient(idx, 'name', e.target.value)} 
                placeholder="Ingredient" 
                className="mr-2 flex-grow"
              />
              <Input 
                value={ing.quantity} 
                onChange={e => updateIngredient(idx, 'quantity', e.target.value)} 
                placeholder="Quantity" 
                className="flex-grow"
              />
            </div>
          ))}
          <Button onClick={addIngredient}>Add Ingredient</Button>
          <Label className="mt-2">Steps</Label>
          <Input 
            value={newRecipe.steps.join('\n')} 
            onChange={e => setNewRecipe({ ...newRecipe, steps: e.target.value.split('\n') })} 
            placeholder="Enter steps, one per line" 
            as="textarea" 
            rows={4} 
            className="mb-2"
          />
          <Button onClick={addRecipe}>Add Recipe</Button>
        </TabsContent>
        <TabsContent value="stats">
          <div className="flex flex-col space-y-2">
            {Object.entries(categories).map(([category, count]) => (
              <div key={category} className="flex items-end">
                <div className="bg-blue-500 h-6" style={{ width: `${count * 20}px` }}></div>
                <span className="ml-2">{category}: {count}</span>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default App;