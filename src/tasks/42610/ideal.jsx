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
      setError("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">{gift ? "Edit Gift" : "Add New Gift"}</h2>
        <button
          type="button"
          onClick={onCancel}
          className="text-xl font-semibold text-gray-500 hover:text-gray-800"
        >
          &times;
        </button>
      </div>
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

const CategorizedGiftList = ({ gifts, onEdit, onDelete, filterOccasion, setFilterOccasion }) => {
  const categorizedGifts = gifts.reduce((acc, gift) => {
    const occasion = gift.occasion.toLowerCase(); // Normalize categories
    acc[occasion] = acc[occasion] || [];
    acc[occasion].push(gift);
    return acc;
  }, {});

  const occasions = Object.keys(categorizedGifts);

  return (
    <Card className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">Gifts</h2>
      <div className="flex flex-wrap gap-2 mb-4">
        <Button
          variant={filterOccasion === "" ? "default" : "outline"}
          onClick={() => setFilterOccasion("")}
        >
          All
        </Button>
        {occasions.map((occasion) => (
          <Button
            key={occasion}
            variant={filterOccasion === occasion ? "default" : "outline"}
            onClick={() => setFilterOccasion(occasion)}
          >
            {occasion.charAt(0).toUpperCase() + occasion.slice(1)}
          </Button>
        ))}
      </div>
      {/* Gifts Display */}
      {filterOccasion
        ? categorizedGifts[filterOccasion]?.map((gift) => (
            <div key={gift.id} className="flex justify-between items-center p-2 border-b">
              <span>
                {gift.recipient} - ${gift.budget} ({gift.status})
              </span>
              <div className="space-x-2">
                <Button
                  size="sm"
                  onClick={() => onEdit(gift)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white"
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => onDelete(gift.id)}
                  className="bg-red-500 hover:bg-red-600 text-white"
                >
                  Delete
                </Button>
              </div>
            </div>
          ))
        : occasions.map((occasion) => (
            <div key={occasion} className="mb-4">
              <h3 className="text-md font-semibold capitalize">{occasion}</h3>
              {categorizedGifts[occasion].map((gift) => (
                <div key={gift.id} className="flex justify-between items-center p-2 border-b">
                  <span>
                    {gift.recipient} - ${gift.budget} ({gift.status})
                  </span>
                  <div className="space-x-2">
                    <Button
                      size="sm"
                      onClick={() => onEdit(gift)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white"
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => onDelete(gift.id)}
                      className="bg-red-500 hover:bg-red-600 text-white"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ))}
    </Card>
  );
};

const Summary = ({ gifts, totalBudget }) => {
  const totalGifts = gifts.length;
  const budgetUsed = gifts
    .filter((gift) => gift.status === "Purchased")
    .reduce((sum, gift) => sum + gift.budget, 0);

  return (
    <Card className="p-4 bg-green-100 rounded-lg shadow w-full">
      <h2 className="text-md font-semibold mb-2 w-full">Summary</h2>
      <p>Total Gifts: {totalGifts}</p>
      <p>Total Budget: ${totalBudget.toFixed(2)}</p>
      <p>Budget Used: ${budgetUsed.toFixed(2)}</p>
    </Card>
  );
};

const ProgressTracker = ({ gifts }) => {
  const purchasedCount = gifts.filter((gift) => gift.status === "Purchased").length;
  const totalCount = gifts.length;
  const progress = totalCount > 0 ? (purchasedCount / totalCount) * 100 : 0;

  return (
    <Card className="p-4 bg-white shadow rounded-lg w-full">
      <h2 className="text-md font-semibold mb-2">Purchase Progress</h2>
      <div className="h-2 bg-gray-200 rounded">
        <div
          className="h-full bg-blue-500 rounded"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className="mt-2 text-sm">{progress.toFixed(2)}% completed</p>
    </Card>
  );
};

export default function App() {
  const [gifts, setGifts] = useState([]);
  const [editingGift, setEditingGift] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filterOccasion, setFilterOccasion] = useState(""); // Filter state
  const totalBudget = 500; // Example total budget

  const handleSave = (gift) => {
    setGifts((prevGifts) =>
      gift.id
        ? prevGifts.map((g) => (g.id === gift.id ? gift : g))
        : [...prevGifts, { ...gift, id: Date.now() }]
    );
    setEditingGift(null);
    setDialogOpen(false); // Close modal on save
  };

  const handleDelete = (id) => {
    setGifts((prevGifts) => prevGifts.filter((gift) => gift.id !== id));
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl grid grid-cols-3 gap-6">
      <div className="col-span-2 space-y-6">
        <CategorizedGiftList
          gifts={gifts}
          onEdit={(gift) => {
            setEditingGift(gift);
            setDialogOpen(true);
          }}
          onDelete={handleDelete}
          filterOccasion={filterOccasion}
          setFilterOccasion={setFilterOccasion}
        />
        <Button
          className="w-[150px] py-2 px-4 text-sm bg-blue-500 hover:bg-blue-600 text-white mx-auto"
          onClick={() => {
            setEditingGift(null);
            setDialogOpen(true);
          }}
        >
          Add Gift
        </Button>
      </div>
      <div className="space-y-6">
        <Summary gifts={gifts} totalBudget={totalBudget} />
        <ProgressTracker gifts={gifts} />
      </div>
      {dialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-auto relative">
            <GiftForm
              gift={editingGift}
              onSave={handleSave}
              onCancel={() => setDialogOpen(false)}
              totalBudget={totalBudget}
              budgetUsed={gifts
                .filter((gift) => gift.status === "Purchased")
                .reduce((sum, gift) => sum + gift.budget, 0)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
