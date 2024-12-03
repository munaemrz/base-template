import React, { useState } from "react";

function DonationForm({ onAddDonation }) {
  const [donorName, setDonorName] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (donorName && amount > 0) {
      onAddDonation({
        donorName,
        totalAmount: parseFloat(amount),
        remainingAmount: parseFloat(amount),
        completed: false,
        message,
        errorMessage: "",
      });
      setDonorName("");
      setAmount("");
      setMessage("");
    }
  };

  return (
    <form className="bg-white p-4 rounded shadow-md space-y-4" onSubmit={handleSubmit}>
      <h2 className="text-lg font-semibold text-gray-700">Add a Donation</h2>
      <input
        className="w-full p-3 border rounded focus:outline-blue-500"
        type="text"
        placeholder="Donor Name"
        value={donorName}
        onChange={(e) => setDonorName(e.target.value)}
        required
      />
      <input
        className="w-full p-3 border rounded focus:outline-blue-500"
        type="number"
        placeholder="Donation Amount"
        value={amount}
        onChange={(e) => {
          const value = e.target.value;
          if (value >= 0) setAmount(value);
        }}
        required
      />
      <textarea
        className="w-full p-3 border rounded focus:outline-blue-500"
        placeholder="Message (Optional)"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        type="submit"
      >
        Add Donation
      </button>
    </form>
  );
}

function DonationList({ donations, setDonations, onClear, filter }) {
  const filteredDonations = donations.filter((donation) =>
    donation.donorName.toLowerCase().includes(filter.toLowerCase())
  );
const handleDonate = (index, amount) => {
  const donation = donations[index];
  if (amount > donation.remainingAmount) {
    setDonations((prev) =>
      prev.map((don, i) =>
        i === index
          ? { ...don, errorMessage: `Donation exceeds remaining amount of $${don.remainingAmount.toFixed(2)}` }
          : don
      )
    );
  } else {
    setDonations((prev) =>
      prev.map((don, i) =>
        i === index
          ? {
              ...don,
              remainingAmount: Math.max(0, don.remainingAmount - amount),
              completed: Math.max(0, don.remainingAmount - amount) === 0,
              errorMessage: "",
            }
          : don
      )
    );
    document.getElementById(`donate-input-${index}`).value = ""; // Reset input field
  }
};


  return donations.length > 0 ? (
    <div className="bg-white p-4 rounded shadow-md space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-700">Donations</h2>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          onClick={onClear}
        >
          Clear All
        </button>
      </div>
      {filter && filteredDonations.length === 0 && (
        <p className="text-gray-500 text-center mt-4">No donations match your search.</p>
      )}
      {filteredDonations.map((donation, index) => (
        <div
          key={index}
          className={`border p-4 rounded shadow-md space-y-2 ${
            donation.completed ? "bg-green-100" : "bg-gray-50"
          }`}
        >
          <p>
            <strong>Donor:</strong> {donation.donorName}
          </p>
          <p>
            <strong>Total Amount:</strong> ${donation.totalAmount.toFixed(2)}
          </p>
          <p>
            <strong>Remaining Amount:</strong> $
            {donation.remainingAmount.toFixed(2)}
          </p>
          {donation.completed && (
            <p className="text-green-700 font-bold">Completed</p>
          )}
          {donation.message && (
            <p>
              <strong>Message:</strong> {donation.message}
            </p>
          )}
          {!donation.completed && (
          <div className="flex space-x-2 items-center">
            <input
              className="w-full p-2 border rounded focus:outline-blue-500"
              type="number"
              placeholder="Enter amount to donate"
              id={`donate-input-${index}`}
              onChange={(e) => {
                if (e.target.value < 0) e.target.value = "";
              }}
            />
            <button
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              onClick={() => {
                const amount = parseFloat(
                  document.getElementById(`donate-input-${index}`).value
                );
                handleDonate(index, amount || 0);
                if (amount <= donation.remainingAmount) {
                  document.getElementById(`donate-input-${index}`).value = "";
                }
              }}
            >
              Donate
            </button>
          </div>
      )}
          {donation.errorMessage && (
            <p className="text-red-500 text-sm mt-2">{donation.errorMessage}</p>
          )}
        </div>
      ))}
    </div>
  ) : null;
}

function TotalDonations({ donations }) {
  const total = donations.reduce((sum, donation) => sum + donation.totalAmount, 0);
  const remaining = donations.reduce(
    (sum, donation) => sum + donation.remainingAmount,
    0
  );

  return (
    <div className="bg-green-100 p-4 rounded shadow-md">
      <h2 className="text-lg font-semibold text-gray-700">Summary</h2>
      <p>
        <strong>Total Donations:</strong> ${total.toFixed(2)}
      </p>
      <p>
        <strong>Total Remaining:</strong> ${remaining.toFixed(2)}
      </p>
    </div>
  );
}

export default function App() {
  const [donations, setDonations] = useState([]);
  const [filter, setFilter] = useState("");

  const addDonation = (donation) => {
    setDonations((prev) => [...prev, donation]);
  };

  const clearDonations = () => {
    setDonations([]);
    setFilter("");
  };

  return (
    <div className="max-w-lg mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold text-center text-blue-600">
        Donation App
      </h1>
      <DonationForm onAddDonation={addDonation} />
      <input
        className="w-full p-3 border rounded focus:outline-blue-500"
        type="text"
        placeholder="Search by Donor Name"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
      <TotalDonations donations={donations} />
      <DonationList
        donations={donations}
        setDonations={setDonations}
        onClear={clearDonations}
        filter={filter}
      />
    </div>
  );
}
