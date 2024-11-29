import React, { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import * as Progress from "@radix-ui/react-progress";

const initialItems = [
  { id: 1, name: "Laptop", category: "Electronics", quantity: 1, price: 1000, date: "2023-01-15" },
  { id: 2, name: "Chair", category: "Furniture", quantity: 4, price: 50, date: "2023-02-20" },
  { id: 3, name: "Book", category: "Entertainment", quantity: 10, price: 15, date: "2023-03-10" },
];

const CategoryList = ({ items, onEdit, onDelete }) => {
  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      {Object.entries(groupedItems).map(([category, categoryItems]) => (
        <div key={category} className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">{category}</h3>
          <ul className="space-y-2">
            {categoryItems.map((item) => (
              <li key={item.id} className="flex justify-between items-center">
                <span>{item.name} (Qty: {item.quantity})</span>
                <div>
                  <button
                    onClick={() => onEdit(item)}
                    className="text-blue-500 hover:text-blue-700 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

const Summary = ({ items }) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalValue = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4">
      <h3 className="text-lg font-semibold mb-2">Summary</h3>
      <p>Total Items: {totalItems}</p>
      <p>Total Value: ${totalValue.toFixed(2)}</p>
    </div>
  );
};

const RestockTracker = ({ items }) => {
  const lowStockItems = items.filter((item) => item.quantity < 2);

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4">
      <h3 className="text-lg font-semibold mb-2">Restock Tracker</h3>
      {lowStockItems.map((item) => (
        <div key={item.id} className="mb-2">
          <p>{item.name}</p>
          <Progress.Root
            className="h-2 w-full bg-gray-200 rounded-full overflow-hidden"
            value={item.quantity * 50}
          >
            <Progress.Indicator
              className="h-full bg-blue-500"
              style={{ width: `${item.quantity * 50}%` }}
            />
          </Progress.Root>
        </div>
      ))}
    </div>
  );
};

const PriceGraph = ({ items }) => {
  const sortedItems = [...items].sort((a, b) => b.price - a.price).slice(0, 5);

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4">
      <h3 className="text-lg font-semibold mb-2">Top 5 Expensive Items</h3>
      <div className="h-40 flex items-end space-x-2">
        {sortedItems.map((item) => (
          <div
            key={item.id}
            className="bg-blue-500 w-1/5"
            style={{ height: `${(item.price / sortedItems[0].price) * 100}%` }}
          >
            <div className="text-xs text-center text-white">${item.price}</div>
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-2">
        {sortedItems.map((item) => (
          <div key={item.id} className="text-xs text-center w-1/5 truncate">
            {item.name}
          </div>
        ))}
      </div>
    </div>
  );
};

const ItemForm = ({ item, onSave, onCancel }) => {
  const [formData, setFormData] = useState(item || {
    name: "",
    category: "",
    quantity: 0,
    price: 0,
    date: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <input
          type="text"
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
          Quantity
        </label>
        <input
          type="number"
          id="quantity"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
          required
          min="0"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label htmlFor="price" className="block text-sm font-medium text-gray-700">
          Price
        </label>
        <input
          type="number"
          id="price"
          name="price"
          value={formData.price}
          onChange={handleChange}
          required
          min="0"
          step="0.01"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700">
          Date of Purchase
        </label>
        <input
          type="date"
          id="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
        />
      </div>
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default function App() {
  const [items, setItems] = useState(initialItems);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const handleAddItem = () => {
    setEditingItem(null);
    setIsDialogOpen(true);
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  const handleDeleteItem = (id) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const handleSaveItem = (formData) => {
    if (editingItem) {
      setItems((prevItems) =>
        prevItems.map((item) => (item.id === editingItem.id ? { ...item, ...formData } : item))
      );
    } else {
      setItems((prevItems) => [...prevItems, { ...formData, id: Date.now() }]);
    }
    setIsDialogOpen(false);
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 max-w-3xl">
      <h1 className="text-2xl font-bold mb-4">Home Inventory Tracker</h1>
      <button
        onClick={handleAddItem}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Add Item
      </button>
      <Summary items={items} />
      <RestockTracker items={items} />
      <PriceGraph items={items} />
      <CategoryList items={items} onEdit={handleEditItem} onDelete={handleDeleteItem} />

      <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <Dialog.Title className="text-lg font-semibold mb-4">
              {editingItem ? "Edit Item" : "Add New Item"}
            </Dialog.Title>
            <ItemForm
              item={editingItem}
              onSave={handleSaveItem}
              onCancel={() => setIsDialogOpen(false)}
            />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}