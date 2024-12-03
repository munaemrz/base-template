import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const GiftForm = ({ gift, onSave, onCancel, totalBudget, budgetUsed }) => {
  const [formData, setFormData] = useState(
    gift || { id: null, recipient: "", occasion: "", budget: "", status: "Pending" }
  );
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const budget = parseFloat(formData.budget);

    if (isNaN(budget) || budget < 0) {
      setError("Budget must be a non-negative number.");
      return;
    }

    if (budgetUsed + budget > totalBudget) {
      setError("Total budget exceeded! Adjust the gift's budget.");
      return;
    }

    if (formData.recipient && formData.occasion && budget >= 0 && formData.status) {
      onSave({ ...formData, budget });
      setFormData({ id: null, recipient: "", occasion: "", budget: "", status: "Pending" });
      setError("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white shadow rounded-lg">
      <h2 className="text-lg font-semibold mb-4">Add or Edit Gift</h2>
      <Input
        name="recipient"
        value={formData.recipient}
        onChange={handleChange}
        placeholder="Recipient"
        required
        className="w-full"
      />
      <Input
        name="occasion"
        value={formData.occasion}
        onChange={handleChange}
        placeholder="Occasion"
        required
        className="w-full"
      />
      <Input
        name="budget"
        type="number"
        value={formData.budget}
        onChange={handleChange}
        placeholder="Budget"
        required
        className="w-full"
      />
      <select
        name="status"
        value={formData.status}
        onChange={handleChange}
        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      >
        <option value="Pending">Pending</option>
        <option value="Purchased">Purchased</option>
      </select>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{gift ? "Update" : "Add"} Gift</Button>
      </div>
    </form>
  );
};

const CategorizedGiftList = ({ gifts, onEdit, onDelete }) => {
  const categorizedGifts = gifts.reduce((acc, gift) => {
    acc[gift.occasion] = acc[gift.occasion] || [];
    acc[gift.occasion].push(gift);
    return acc;
  }, {});

  return (
   <>
   {gifts.length > 0 && (
      <Card className="mb-4">
    <h2 className="text-lg font-semibold mb-4 p-2">Gifts by Occasion</h2>
    {Object.keys(categorizedGifts).length > 0 ? (
      <div className="">
        {Object.entries(categorizedGifts).map(([occasion, gifts]) => (
          <div key={occasion} className="p-4 bg-gray-50 rounded-lg shadow">
            <h3 className="text-md font-semibold mb-2">{occasion}</h3>
            <ul className="space-y-2">
              {gifts.map((gift) => (
                <li
                  key={gift.id}
                  className={`flex justify-between items-center p-2 rounded ${
                    gift.status === "Purchased" ? "bg-green-100" : "bg-yellow-100"
                  }`}
                >
                  <span>
                    {gift.recipient} - ${gift.budget} ({gift.status})
                  </span>
                  <div>
                    <Button size="sm" onClick={() => onEdit(gift)} className="mr-2">
                      Edit
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => onDelete(gift.id)}>
                      Delete
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    ) : (
      <p>No gifts added yet.</p>
    )}
      </Card>
    )}
    </> 
  );
};

const Summary = ({ gifts, totalBudget }) => {
  const totalGifts = gifts.length;
  const budgetUsed = gifts
    .filter((gift) => gift.status === "Purchased")
    .reduce((sum, gift) => sum + gift.budget, 0);

  return (
    <Card className="p-4 bg-gray-100 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">Summary</h2>
      <div className="flex justify-between">
        <div>
          <p>Total Gifts: {totalGifts}</p>
          <p>Total Budget: ${totalBudget.toFixed(2)}</p>
        </div>
        <div>
          <p>Budget Used: ${budgetUsed.toFixed(2)}</p>
        </div>
      </div>
    </Card>
  );
};

const ProgressTracker = ({ gifts }) => {
  const purchasedCount = gifts.filter((gift) => gift.status === "Purchased").length;
  const totalCount = gifts.length;
  const progress = totalCount > 0 ? (purchasedCount / totalCount) * 100 : 0;

  return (
    <Card className="p-4 bg-white shadow rounded-lg">
      <h2 className="text-lg font-semibold mb-4">Purchase Progress</h2>
      <div className="h-2 bg-gray-200 rounded">
        <div
          className="h-full bg-blue-500 rounded"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className="mt-2 text-sm">
        {purchasedCount} of {totalCount} gifts purchased ({progress.toFixed(2)}%)
      </p>
    </Card>
  );
};

export default function App() {
  const [gifts, setGifts] = useState([]);
  const [editingGift, setEditingGift] = useState(null);
  const totalBudget = 500; // Example total budget

  const handleSave = (gift) => {
    setGifts((prevGifts) =>
      gift.id
        ? prevGifts.map((g) => (g.id === gift.id ? gift : g))
        : [...prevGifts, { ...gift, id: Date.now() }]
    );
    setEditingGift(null);
  };

  const handleDelete = (id) => {
    setGifts((prevGifts) => prevGifts.filter((gift) => gift.id !== id));
  };

  const budgetUsed = gifts
    .filter((gift) => gift.status === "Purchased")
    .reduce((sum, gift) => sum + gift.budget, 0);

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Gift Shopping Organizer</h1>
      <div className="grid gap-6">
        <div>
          {editingGift ? (
            <GiftForm
              gift={editingGift}
              onSave={handleSave}
              onCancel={() => setEditingGift(null)}
              totalBudget={totalBudget}
              budgetUsed={budgetUsed}
            />
          ) : (
            <Button
              onClick={() =>
                setEditingGift({ id: null, recipient: "", occasion: "", budget: "", status: "Pending" })
              }
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              Add New Gift
            </Button>
          )}
        </div>
        <Summary gifts={gifts} totalBudget={totalBudget} />
        <ProgressTracker gifts={gifts} />
        <CategorizedGiftList gifts={gifts} onEdit={setEditingGift} onDelete={handleDelete} />
      </div>
    </div>
  );
}
