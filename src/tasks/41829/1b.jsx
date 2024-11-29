import React, { useState, useEffect } from 'react';
import { Input, Button, Card, Title, Text, Group, Progress, LineChart, NumberInput } from "@shadcn/ui";

function App() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', category: '', quantity: 1, price: 0, purchaseDate: new Date().toISOString().split('T')[0] });

  const addItem = () => {
    if (newItem.name && newItem.category) {
      setItems([...items, { ...newItem, id: Date.now() }]);
      setNewItem({ name: '', category: '', quantity: 1, price: 0, purchaseDate: new Date().toISOString().split('T')[0] });
    }
  };

  const updateItem = (id, updatedItem) => {
    setItems(items.map(item => item.id === id ? { ...item, ...updatedItem } : item));
  };

  const deleteItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const categories = [...new Set(items.map(item => item.category))];

  const totalItems = items.length;
  const totalValue = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const lowStock = items.filter(item => item.quantity < 2);

  const priceData = categories.map(category => ({
    category,
    total: items.filter(i => i.category === category).reduce((sum, item) => sum + item.price * item.quantity, 0)
  }));

  return (
    <div className="p-4 sm:p-8">
      <Title className="mb-4">Home Inventory Tracker</Title>
      
      <Card className="mb-4">
        <Title level="h2" className="mb-2">Add New Item</Title>
        <Group>
          <Input 
            value={newItem.name} 
            onChange={(e) => setNewItem({...newItem, name: e.target.value})} 
            placeholder="Item Name" 
            className="mr-2"
          />
          <Input 
            value={newItem.category} 
            onChange={(e) => setNewItem({...newItem, category: e.target.value})} 
            placeholder="Category" 
            className="mr-2"
          />
          <NumberInput
            value={newItem.quantity}
            onValueChange={(val) => setNewItem({...newItem, quantity: val})}
            min={1}
            className="mr-2 w-20"
          />
          <NumberInput
            value={newItem.price}
            onValueChange={(val) => setNewItem({...newItem, price: val})}
            step={0.01}
            className="mr-2 w-24"
          />
          <Input 
            type="date" 
            value={newItem.purchaseDate} 
            onChange={(e) => setNewItem({...newItem, purchaseDate: e.target.value})} 
            className="mr-2"
          />
          <Button onClick={addItem}>Add Item</Button>
        </Group>
      </Card>

      <Card className="mb-4">
        <Title level="h2" className="mb-2">Inventory Summary</Title>
        <Text>Total Items: {totalItems}</Text>
        <Text>Total Value: ${totalValue.toFixed(2)}</Text>
      </Card>

      <Card className="mb-4">
        <Title level="h2" className="mb-2">Restock Progress</Title>
        {lowStock.map(item => (
          <div key={item.id} className="mb-2">
            <Text>{item.name} - {item.quantity} left</Text>
            <Progress value={(item.quantity / 2) * 100} className="mt-1" />
          </div>
        ))}
      </Card>

      <Card className="mb-4">
        <Title level="h2" className="mb-2">Spending by Category</Title>
        <LineChart 
          data={priceData} 
          x="category" 
          y="total"
          height={200}
          width={300}
        />
      </Card>

      {categories.map(category => (
        <Card key={category} className="mb-4">
          <Title level="h2" className="mb-2">{category}</Title>
          {items.filter(item => item.category === category).map(item => (
            <div key={item.id} className="flex justify-between items-center mb-2">
              <div>
                <Text>{item.name} - Qty: {item.quantity}, Price: ${item.price}</Text>
                <Input 
                  type="date" 
                  value={item.purchaseDate} 
                  onChange={(e) => updateItem(item.id, { purchaseDate: e.target.value })} 
                  className="mt-1"
                />
              </div>
              <div>
                <Button onClick={() => updateItem(item.id, { quantity: item.quantity + 1 })}>+</Button>
                <Button onClick={() => deleteItem(item.id)} className="ml-2">Delete</Button>
              </div>
            </div>
          ))}
        </Card>
      ))}
    </div>
  );
}

export default App;