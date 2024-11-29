import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

// Shadcn components (simplified versions)
const Button = ({ className, ...props }) => (
  <button
    className={cn(
      "px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600",
      className
    )}
    {...props}
  />
);

const Input = ({ className, ...props }) => (
  <input
    className={cn(
      "px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
      className
    )}
    {...props}
  />
);

const Select = ({ className, ...props }) => (
  <select
    className={cn(
      "px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
      className
    )}
    {...props}
  />
);

const Progress = ({ value, max }) => (
  <div className="w-full bg-gray-200 rounded-full h-2.5">
    <div
      className="bg-blue-600 h-2.5 rounded-full"
      style={{ width: `${(value / max) * 100}%` }}
    ></div>
  </div>
);

// Gift entry form component
const GiftForm = ({ addGift, editGift, giftToEdit, setGiftToEdit }) => {
  const [gift, setGift] = useState({
    recipient: "",
    occasion: "",
    budget: "",
    status: "pending",
  });

  useEffect(() => {
    if (giftToEdit) {
      setGift(giftToEdit);
    }
  }, [giftToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (giftToEdit) {
      editGift(gift);
      setGiftToEdit(null);
    } else {
      addGift({ ...gift, id: Date.now() });
    }
    setGift({ recipient: "", occasion: "", budget: "", status: "pending" });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        placeholder="Recipient"
        value={gift.recipient}
        onChange={(e) => setGift({ ...gift, recipient: e.target.value })}
        required
      />
      <Input
        placeholder="Occasion"
        value={gift.occasion}
        onChange={(e) => setGift({ ...gift, occasion: e.target.value })}
        required
      />
      <Input
        type="number"
        placeholder="Budget"
        value={gift.budget}
        onChange={(e) => setGift({ ...gift, budget: e.target.value })}
        required
      />
      <Select
        value={gift.status}
        onChange={(e) => setGift({ ...gift, status: e.target.value })}
      >
        <option value="pending">Pending</option>
        <option value="purchased">Purchased</option>
      </Select>
      <Button type="submit">{giftToEdit ? "Update Gift" : "Add Gift"}</Button>
    </form>
  );
};

// Gift list component
const GiftList = ({ gifts, deleteGift, setGiftToEdit }) => {
  const occasionGroups = gifts.reduce((acc, gift) => {
    if (!acc[gift.occasion]) {
      acc[gift.occasion] = [];
    }
    acc[gift.occasion].push(gift);
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      {Object.entries(occasionGroups).map(([occasion, giftList]) => (
        <div key={occasion} className="border rounded-md p-4">
          <h3 className="text-lg font-semibold mb-2">{occasion}</h3>
          <ul className="space-y-2">
            {giftList.map((gift) => (
              <li
                key={gift.id}
                className="flex justify-between items-center bg-gray-100 p-2 rounded-md"
              >
                <span>{gift.recipient}</span>
                <span>${gift.budget}</span>
                <span>{gift.status}</span>
                <div>
                  <Button
                    onClick={() => setGiftToEdit(gift)}
                    className="mr-2 bg-yellow-500 hover:bg-yellow-600"
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => deleteGift(gift.id)}
                    className="bg-red-500 hover:bg-red-600"
                  >
                    Delete
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

// Summary component
const Summary = ({ gifts }) => {
  const totalGifts = gifts.length;
  const totalBudget = gifts.reduce((sum, gift) => sum + Number(gift.budget), 0);
  const purchasedGifts = gifts.filter((gift) => gift.status === "purchased")
    .length;

  return (
    <div className="bg-gray-100 p-4 rounded-md">
      <h3 className="text-lg font-semibold mb-2">Summary</h3>
      <p>Total Gifts: {totalGifts}</p>
      <p>Total Budget: ${totalBudget}</p>
      <p>Purchased Gifts: {purchasedGifts}</p>
      <p>Pending Gifts: {totalGifts - purchasedGifts}</p>
      <div className="mt-2">
        <p>Progress:</p>
        <Progress value={purchasedGifts} max={totalGifts} />
      </div>
    </div>
  );
};

// Main App component
export default function App() {
  const [gifts, setGifts] = useState([]);
  const [giftToEdit, setGiftToEdit] = useState(null);

  const addGift = (gift) => {
    setGifts([...gifts, gift]);
  };

  const editGift = (updatedGift) => {
    setGifts(
      gifts.map((gift) => (gift.id === updatedGift.id ? updatedGift : gift))
    );
  };

  const deleteGift = (id) => {
    setGifts(gifts.filter((gift) => gift.id !== id));
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">Gift Shopping Organizer</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Add/Edit Gift</h2>
          <GiftForm
            addGift={addGift}
            editGift={editGift}
            giftToEdit={giftToEdit}
            setGiftToEdit={setGiftToEdit}
          />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Summary</h2>
          <Summary gifts={gifts} />
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Gift List</h2>
        <GiftList
          gifts={gifts}
          deleteGift={deleteGift}
          setGiftToEdit={setGiftToEdit}
        />
      </div>
    </div>
  );
}