import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const categories = ["Food", "Utilities", "Entertainment", "Other"];

function TransactionForm({ addTransaction }) {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [isIncome, setIsIncome] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || !category) return;
    addTransaction({
      id: Date.now(),
      amount: isIncome ? parseFloat(amount) : -parseFloat(amount),
      category,
      description,
    });
    setAmount("");
    setCategory("");
    setDescription("");
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Add Transaction</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex space-x-2">
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Amount"
              className="flex-1"
            />
            <Select onValueChange={setCategory} value={category}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
          />
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isIncome"
              checked={isIncome}
              onChange={(e) => setIsIncome(e.target.checked)}
              className="w-4 h-4"
            />
            <label htmlFor="isIncome">Is Income?</label>
          </div>
          <Button type="submit">Add Transaction</Button>
        </form>
      </CardContent>
    </Card>
  );
}

function BarChart({ data }) {
  const maxValue = Math.max(...Object.values(data));
  return (
    <div className="flex items-end space-x-2 h-40">
      {Object.entries(data).map(([category, amount]) => (
        <div key={category} className="flex flex-col items-center">
          <div
            className="w-12 bg-blue-500"
            style={{ height: `${(amount / maxValue) * 100}%` }}
          ></div>
          <span className="text-xs mt-1">{category}</span>
        </div>
      ))}
    </div>
  );
}

function PieChart({ data }) {
  const total = Object.values(data).reduce((sum, value) => sum + value, 0);
  let startAngle = 0;

  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      {Object.entries(data).map(([category, amount]) => {
        const percentage = amount / total;
        const endAngle = startAngle + percentage * 360;
        const largeArcFlag = percentage > 0.5 ? 1 : 0;
        const x1 = 50 + 50 * Math.cos((Math.PI * startAngle) / 180);
        const y1 = 50 + 50 * Math.sin((Math.PI * startAngle) / 180);
        const x2 = 50 + 50 * Math.cos((Math.PI * endAngle) / 180);
        const y2 = 50 + 50 * Math.sin((Math.PI * endAngle) / 180);

        const pathData = `M 50 50 L ${x1} ${y1} A 50 50 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

        startAngle = endAngle;

        return <path key={category} d={pathData} fill={`hsl(${Math.random() * 360}, 70%, 50%)`} />;
      })}
    </svg>
  );
}

function TransactionTable({ transactions, editTransaction, deleteTransaction }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Amount</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((transaction) => (
          <TableRow key={transaction.id}>
            <TableCell>{transaction.amount.toFixed(2)}</TableCell>
            <TableCell>{transaction.category}</TableCell>
            <TableCell>{transaction.description}</TableCell>
            <TableCell>
              <Button onClick={() => editTransaction(transaction)} className="mr-2">
                Edit
              </Button>
              <Button onClick={() => deleteTransaction(transaction.id)} variant="destructive">
                Delete
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default function App() {
  const [transactions, setTransactions] = useState([]);
  const [editingTransaction, setEditingTransaction] = useState(null);

  useEffect(() => {
    const savedTransactions = localStorage.getItem("transactions");
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (transaction) => {
    if (editingTransaction) {
      setTransactions(
        transactions.map((t) => (t.id === editingTransaction.id ? transaction : t))
      );
      setEditingTransaction(null);
    } else {
      setTransactions([...transactions, transaction]);
    }
  };

  const editTransaction = (transaction) => {
    setEditingTransaction(transaction);
  };

  const deleteTransaction = (id) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  const totalBalance = transactions.reduce((sum, t) => sum + t.amount, 0);

  const expensesByCategory = transactions
    .filter((t) => t.amount < 0)
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) - t.amount;
      return acc;
    }, {});

  return (
    <div className="container mx-auto p-4 sm:p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Budget Tracker</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <TransactionForm
          addTransaction={addTransaction}
          editingTransaction={editingTransaction}
        />
        <Card>
          <CardHeader>
            <CardTitle>Total Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">${totalBalance.toFixed(2)}</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Expenses by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart data={expensesByCategory} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Expense Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <PieChart data={expensesByCategory} />
          </CardContent>
        </Card>
      </div>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <TransactionTable
            transactions={transactions}
            editTransaction={editTransaction}
            deleteTransaction={deleteTransaction}
          />
        </CardContent>
      </Card>
    </div>
  );
}