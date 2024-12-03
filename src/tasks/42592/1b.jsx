import React, { useState, useEffect } from 'react';
import { Button, Input, Card, CardHeader, CardBody, CardFooter } from "@/components/ui/shadcn";

function App() {
  const [donations, setDonations] = useState([]);
  const [newDonation, setNewDonation] = useState({ name: '', amount: '', message: '', remaining: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDonation, setSelectedDonation] = useState(null);

  useEffect(() => {
    const storedDonations = JSON.parse(localStorage.getItem('donations') || '[]');
    setDonations(storedDonations);
  }, []);

  useEffect(() => {
    localStorage.setItem('donations', JSON.stringify(donations));
  }, [donations]);

  const addDonation = () => {
    if (newDonation.name && newDonation.amount) {
      setDonations([...donations, { ...newDonation, remaining: newDonation.amount }]);
      setNewDonation({ name: '', amount: '', message: '', remaining: '' });
    }
  };

  const totalDonated = () => {
    return donations.reduce((sum, donation) => sum + parseFloat(donation.amount - donation.remaining), 0);
  };

  const remainingAmount = () => {
    return donations.reduce((sum, donation) => sum + parseFloat(donation.remaining), 0);
  };

  const clearAll = () => {
    if (window.confirm('Are you sure you want to clear all donations?')) {
      setDonations([]);
    }
  };

  const updateDonation = (index, amount) => {
    const updatedDonations = [...donations];
    const donationAmount = parseFloat(amount);
    if (updatedDonations[index].remaining >= donationAmount) {
      updatedDonations[index].remaining -= donationAmount;
      setDonations(updatedDonations);
      setSelectedDonation(null);
    } else {
      alert('Cannot donate more than the remaining amount.');
    }
  };

  const filteredDonations = donations.filter(donation => 
    donation.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-center">Donation Tracker</h1>

        {/* Donation Form */}
        <Card className="mb-4">
          <CardHeader>
            <h2 className="text-lg">Add New Donation</h2>
          </CardHeader>
          <CardBody>
            <Input 
              value={newDonation.name}
              onChange={e => setNewDonation({...newDonation, name: e.target.value})}
              placeholder="Donor Name"
              className="mb-2"
            />
            <Input 
              value={newDonation.amount}
              onChange={e => setNewDonation({...newDonation, amount: e.target.value, remaining: e.target.value})}
              placeholder="Amount"
              type="number"
              className="mb-2"
            />
            <Input 
              value={newDonation.message}
              onChange={e => setNewDonation({...newDonation, message: e.target.value})}
              placeholder="Message"
              className="mb-2"
            />
            <Button onClick={addDonation} className="w-full">Add Donation</Button>
          </CardBody>
        </Card>

        {/* Search Bar */}
        <Input 
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Search by donor name..."
          className="mb-4"
        />

        {/* Total Donations */}
        <div className="mb-4 text-right">
          <p>Total Donated: ${totalDonated().toFixed(2)}</p>
          <p>Remaining: ${remainingAmount().toFixed(2)}</p>
        </div>

        {/* Donations List */}
        {filteredDonations.map((donation, index) => (
          <Card key={index} className="mb-2">
            <CardBody>
              <h3 className="font-bold">{donation.name}</h3>
              <p>Amount: ${donation.amount}</p>
              <p>Remaining: ${donation.remaining}</p>
              <p>Message: {donation.message}</p>
              {selectedDonation === index ? (
                <div>
                  <Input 
                    type="number" 
                    placeholder="Enter amount to donate"
                    className="mb-2"
                  />
                  <Button onClick={() => updateDonation(index, document.querySelector('input').value)}>Donate</Button>
                </div>
              ) : (
                <Button onClick={() => setSelectedDonation(index)}>Donate</Button>
              )}
            </CardBody>
          </Card>
        ))}

        {/* Clear All Button */}
        {donations.length > 0 && (
          <Button onClick={clearAll} className="mt-4 bg-red-500 hover:bg-red-600 w-full">Clear All</Button>
        )}
      </div>
    </div>
  );
}

export default App;