import React, { useState, useEffect } from 'react';
import { Button, Input, Checkbox, Label, Card, CardHeader, CardBody, CardFooter } from "@/components/ui/shadcn-ui";

function App() {
  const [gifts, setGifts] = useState([]);
  const [newGift, setNewGift] = useState({ recipient: '', occasion: '', budget: '', purchased: false });
  const [editingGift, setEditingGift] = useState(null);

  useEffect(() => {
    const savedGifts = JSON.parse(localStorage.getItem('gifts') || '[]');
    setGifts(savedGifts);
  }, []);

  useEffect(() => {
    localStorage.setItem('gifts', JSON.stringify(gifts));
  }, [gifts]);

  const addGift = () => {
    if (editingGift !== null) {
      const updatedGifts = gifts.map((gift, index) => 
        index === editingGift ? { ...newGift, id: gift.id } : gift
      );
      setGifts(updatedGifts);
      setEditingGift(null);
    } else {
      setGifts([...gifts, { ...newGift, id: Date.now() }]);
    }
    setNewGift({ recipient: '', occasion: '', budget: '', purchased: false });
  };

  const deleteGift = (id) => {
    setGifts(gifts.filter(gift => gift.id !== id));
  };

  const startEdit = (gift) => {
    setEditingGift(gifts.findIndex(g => g.id === gift.id));
    setNewGift(gift);
  };

  const categories = [...new Set(gifts.map(g => g.occasion))];

  const totalBudget = gifts.reduce((sum, gift) => sum + (parseFloat(gift.budget) || 0), 0);
  const purchasedGifts = gifts.filter(g => g.purchased).length;
  const pendingGifts = gifts.length - purchasedGifts;

  return (
    <div className="p-4 max-w-3xl mx-auto sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold mb-4">Gift Organizer</h1>

      {/* Gift Form */}
      <Card>
        <CardHeader>
          <CardTitle>Add/Edit Gift</CardTitle>
        </CardHeader>
        <CardBody>
          <Input 
            value={newGift.recipient} 
            onChange={e => setNewGift({...newGift, recipient: e.target.value})} 
            placeholder="Recipient" 
            className="mb-2"
          />
          <Input 
            value={newGift.occasion} 
            onChange={e => setNewGift({...newGift, occasion: e.target.value})} 
            placeholder="Occasion" 
            className="mb-2"
          />
          <Input 
            type="number" 
            value={newGift.budget} 
            onChange={e => setNewGift({...newGift, budget: e.target.value})} 
            placeholder="Budget" 
            className="mb-2"
          />
          <Label>
            <Checkbox 
              checked={newGift.purchased} 
              onChange={e => setNewGift({...newGift, purchased: e.target.checked})} 
            /> Purchased?
          </Label>
        </CardBody>
        <CardFooter>
          <Button onClick={addGift}>{editingGift !== null ? 'Update Gift' : 'Add Gift'}</Button>
        </CardFooter>
      </Card>

      {/* Summary Section */}
      <div className="mt-4">
        <h2 className="text-xl mb-2">Summary</h2>
        <p>Total Gifts: {gifts.length}</p>
        <p>Total Budget: ${totalBudget.toFixed(2)}</p>
        <p>Purchased: {purchasedGifts} | Pending: {pendingGifts}</p>
      </div>

      {/* Categorized Gifts */}
      {categories.map(category => (
        <div key={category} className="mt-4">
          <h2 className="text-lg font-semibold">{category}</h2>
          {gifts.filter(g => g.occasion === category).map(gift => (
            <Card key={gift.id} className="mt-2">
              <CardBody>
                <p><strong>{gift.recipient}</strong> - ${gift.budget}</p>
                <p>{gift.purchased ? 'Purchased' : 'Not Purchased'}</p>
              </CardBody>
              <CardFooter className="flex justify-between">
                <Button onClick={() => startEdit(gift)}>Edit</Button>
                <Button onClick={() => deleteGift(gift.id)} variant="destructive">Delete</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ))}
    </div>
  );
}

export default App;