import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

export default function App() {
  const [donations, setDonations] = useState([]);
  const [newDonation, setNewDonation] = useState({
    name: "",
    amount: "",
    message: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDonations, setSelectedDonations] = useState([]);
  const [donationAmount, setDonationAmount] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDonation((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newDonation.name && newDonation.amount) {
      setDonations((prev) => [
        ...prev,
        { ...newDonation, id: Date.now(), remainingAmount: Number(newDonation.amount) },
      ]);
      setNewDonation({ name: "", amount: "", message: "" });
    }
  };

  const handleClearAll = () => {
    setDonations([]);
    setSelectedDonations([]);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCheckboxChange = (donationId) => {
    setSelectedDonations((prev) =>
      prev.includes(donationId)
        ? prev.filter((id) => id !== donationId)
        : [...prev, donationId]
    );
  };

  const handleDonate = () => {
    if (donationAmount && selectedDonations.length > 0) {
      const amountPerDonation = Number(donationAmount) / selectedDonations.length;
      setDonations((prev) =>
        prev.map((donation) =>
          selectedDonations.includes(donation.id)
            ? {
                ...donation,
                remainingAmount: Math.max(0, donation.remainingAmount - amountPerDonation),
              }
            : donation
        )
      );
      setSelectedDonations([]);
      setDonationAmount("");
    }
  };

  const filteredDonations = donations.filter((donation) =>
    donation.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalDonations = donations.reduce(
    (sum, donation) => sum + Number(donation.amount),
    0
  );

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Donation App</h1>

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Donor Name</Label>
            <Input
              id="name"
              name="name"
              value={newDonation.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="amount">Donation Amount</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              value={newDonation.amount}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>
        <div className="mt-4">
          <Label htmlFor="message">Message</Label>
          <Input
            id="message"
            name="message"
            value={newDonation.message}
            onChange={handleInputChange}
          />
        </div>
        <Button type="submit" className="mt-4">
          Add Donation
        </Button>
      </form>

      <div className="mb-4">
        <Label htmlFor="search">Search Donations</Label>
        <Input
          id="search"
          type="text"
          placeholder="Search by donor name"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      <div className="mb-4">
        <Label htmlFor="donationAmount">Donation Amount</Label>
        <div className="flex space-x-2">
          <Input
            id="donationAmount"
            type="number"
            value={donationAmount}
            onChange={(e) => setDonationAmount(e.target.value)}
          />
          <Button onClick={handleDonate}>Donate</Button>
        </div>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold">Total Donations: ${totalDonations}</h2>
      </div>

      <div className="space-y-4">
        {filteredDonations.map((donation) => (
          <Card key={donation.id} className="p-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`checkbox-${donation.id}`}
                checked={selectedDonations.includes(donation.id)}
                onCheckedChange={() => handleCheckboxChange(donation.id)}
              />
              <div>
                <h3 className="font-semibold">{donation.name}</h3>
                <p>Amount: ${donation.amount}</p>
                <p>Remaining: ${donation.remainingAmount.toFixed(2)}</p>
                {donation.message && <p>Message: {donation.message}</p>}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {donations.length > 0 && (
        <Button onClick={handleClearAll} className="mt-4">
          Clear All
        </Button>
      )}
    </div>
  );
}