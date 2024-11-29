import React, { useState } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

// Form for adding/editing items
const ItemForm = ({ onSave, onCancel, item }) => {
  const [formData, setFormData] = useState(
    item || { name: "", category: "", quantity: 1, price: 0, date: "" }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.category && formData.date) {
      onSave({ ...formData });
    } else {
      alert("Please fill out all required fields.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Item Name"
        required
      />
      <Input
        name="category"
        value={formData.category}
        onChange={handleChange}
        placeholder="Category"
        required
      />
      <Input
        name="quantity"
        type="number"
        value={formData.quantity}
        onChange={handleChange}
        placeholder="Quantity"
        min="1"
        required
      />
      <Input
        name="price"
        type="number"
        value={formData.price}
        onChange={handleChange}
        placeholder="Price"
        min="0"
        step="0.01"
        required
      />
      <Input
        name="date"
        type="date"
        value={formData.date}
        onChange={handleChange}
        required
      />
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
};

// Summary Component
const Summary = ({ items }) => {
  const totalItems = items.reduce((sum, item) => sum + parseInt(item.quantity), 0);
  const totalValue = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <Card className="mb-4">
      Summary
        <p>Total Items: {totalItems}</p>
        <p>Total Value: ${totalValue.toFixed(2)}</p>
    </Card>
  );
};

// Restock Tracker Component
const RestockTracker = ({ items }) => {
  const lowStockItems = items.filter((item) => item.quantity < 2);

  return (
    <Card className="mb-4">
      <CardTitle>Restock Tracker</CardTitle>
      <CardContent>
        {lowStockItems.length ? (
          lowStockItems.map((item) => (
            <div key={item.id} className="mb-2">
              <p>{item.name}</p>
              <Progress value={(item.quantity / 2) * 100} />
            </div>
          ))
        ) : (
          <p>All items are sufficiently stocked.</p>
        )}
      </CardContent>
    </Card>
  );
};

// Grouped Items Component
const GroupedItems = ({ items, onEdit, onDelete }) => {
  const grouped = items.reduce((acc, item) => {
    acc[item.category] = acc[item.category] || [];
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <div>
      {Object.entries(grouped).map(([category, items]) => (
        <Card key={category} className="mb-4">
          <CardTitle>{category}</CardTitle>
          <CardContent>
            {items.map((item) => (
              <div key={item.id} className="flex justify-between mb-2">
                <span>
                  {item.name} (Qty: {item.quantity}, ${item.price})
                </span>
                <div>
                  <Button size="sm" onClick={() => onEdit(item)}>
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => onDelete(item.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

// Main App Component
export default function App() {
  const [items, setItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);

  const handleSave = (item) => {
    setItems((prevItems) =>
      item.id
        ? prevItems.map((i) => (i.id === item.id ? item : i))
        : [...prevItems, { ...item, id: Date.now() }]
    );
    setEditingItem(null);
  };

  const handleDelete = (id) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Home Inventory Tracker</h1>
      {editingItem && (
        <Card className="mb-4">
          <CardContent>
            <ItemForm
              item={editingItem}
              onSave={handleSave}
              onCancel={() => setEditingItem(null)}
            />
          </CardContent>
        </Card>
      )}
      <Button
        className="mb-4"
        onClick={() =>
          setEditingItem({ name: "", category: "", quantity: 1, price: 0, date: "" })
        }
      >
        Add New Item
      </Button>
      <Summary items={items} />
      <RestockTracker items={items} />
      <GroupedItems items={items} onEdit={setEditingItem} onDelete={handleDelete} />
    </div>
  );
}
