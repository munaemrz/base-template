import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// Form for adding and editing gift entries
const GiftForm = ({ gift, onSave, onCancel }) => {
  const [formData, setFormData] = useState(
    gift || { recipient: "", occasion: "", budget: "", status: "Pending" }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.recipient && formData.occasion && formData.budget && formData.status) {
      onSave({ ...formData});
      setFormData({ recipient: "", occasion: "", budget: "", status: "Pending" });
    } else {
      alert("Please fill out all fields.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        name="recipient"
        value={formData.recipient}
        onChange={handleChange}
        placeholder="Recipient"
        required
      />
      <Input
        name="occasion"
        value={formData.occasion}
        onChange={handleChange}
        placeholder="Occasion"
        required
      />
      <Input
        name="budget"
        type="number"
        value={formData.budget}
        onChange={handleChange}
        placeholder="Budget"
        required
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
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{gift ? "Update" : "Add"} Gift</Button>
      </div>
    </form>
  );
};

// Categorized list of gifts by occasion
const CategorizedGiftList = ({ gifts, onEdit, onDelete }) => {
  const categorizedGifts = gifts.reduce((acc, gift) => {
    acc[gift.occasion] = acc[gift.occasion] || [];
    acc[gift.occasion].push(gift);
    return acc;
  }, {});

  return (
    <Card className="mb-4">
      <h2 className="font-semibold mb-2">Gifts by Occasion</h2>
      {Object.entries(categorizedGifts).map(([occasion, gifts]) => (
        <div key={occasion} className="mb-4">
          <h3 className="text-lg font-semibold">{occasion}</h3>
          <ul className="space-y-2">
            {gifts.map((gift) => (
              <li key={gift.id} className="flex justify-between">
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
    </Card>
  );
};

// Summary section
const Summary = ({ gifts }) => {
  const totalGifts = gifts.length;
  const totalBudget = gifts.reduce((sum, gift) => sum + parseFloat(gift.budget), 0);

  return (
    <Card className="mb-4">
      <h2 className="font-semibold mb-2">Summary</h2>
      <p>Total Gifts: {totalGifts}</p>
      <p>Total Budget: ${totalBudget.toFixed(2)}</p>
    </Card>
  );
};

// Progress tracker for purchased vs pending gifts
const ProgressTracker = ({ gifts }) => {
  const purchasedCount = gifts.filter((gift) => gift.status === "Purchased").length;
  const totalCount = gifts.length;
  const progress = totalCount > 0 ? (purchasedCount / totalCount) * 100 : 0;

  return (
    <Card className="mb-4">
      <h2 className="font-semibold mb-2">Purchase Progress</h2>
      <div className="h-2 bg-gray-200 rounded">
        <div
          className="h-full bg-blue-500 rounded"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className="mt-2">
        {purchasedCount} of {totalCount} gifts purchased ({progress.toFixed(2)}%)
      </p>
    </Card>
  );
};

// Main App component
export default function App() {
  const [gifts, setGifts] = useState([]);
  const [editingGift, setEditingGift] = useState(null);

  const handleSave = (gift) => {
    setGifts((prevGifts) =>
      gift.id
        ? prevGifts.map((g) => (g.id === gift.id ? gift : g))
        : [...prevGifts, gift]
    );
    setEditingGift(null);
  };

  const handleDelete = (id) => {
    setGifts((prevGifts) => prevGifts.filter((gift) => gift.id !== id));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gift Shopping Organizer</h1>
      {editingGift ? (
        <Card className="mb-4">
          <GiftForm
            gift={editingGift}
            onSave={handleSave}
            onCancel={() => setEditingGift(null)}
          />
        </Card>
      ) : (
        <Button
          className="mb-4"
          onClick={() =>
            setEditingGift({ recipient: "", occasion: "", budget: "", status: "Pending" })
          }
        >
          Add New Gift
        </Button>
      )}
      <Summary gifts={gifts} />
      <ProgressTracker gifts={gifts} />
      <CategorizedGiftList gifts={gifts} onEdit={setEditingGift} onDelete={handleDelete} />
    </div>
  );
}
