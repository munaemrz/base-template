import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectItem, SelectContent } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

const categories = [
  "Food",
  "Utilities",
  "Entertainment",
  "Housing",
  "Transport",
  "Other",
];

function TransactionForm({ onSubmit }) {
  const [type, setType] = useState("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ type, amount: parseFloat(amount), category, description });
    setAmount("");
    setDescription("");
  };

  return (
    <Card className="sm:w-96">
      <CardHeader>
        <CardTitle>Add Transaction</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="type">Type</Label>
              <Select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <SelectContent>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="category">Category</Label>
              <Select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories.map((cat) => (
                  <SelectContent>
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  </SelectContent>
                ))}
              </Select>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
          <Button type="submit" className="mt-4 w-full">
            Add
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function TransactionTable({ transactions, onDelete, onEdit }) {
  return (
    <Card className="mt-4 sm:w-full">
      <CardHeader>
        <CardTitle>Transactions</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <table className="w-full">
          <thead>
            <tr>
              <th>Type</th>
              <th>Amount</th>
              <th>Category</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((trans, index) => (
              <tr key={index}>
                <td>{trans.type}</td>
                <td>{trans.amount}</td>
                <td>{trans.category}</td>
                <td>{trans.description}</td>
                <td>
                  <Button onClick={() => onEdit(index)}>Edit</Button>
                  <Button
                    onClick={() => onDelete(index)}
                    className="ml-2 bg-red-500 hover:bg-red-600"
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}

function Charts({ transactions }) {
  const expenseData = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => {
      const cat = t.category;
      acc[cat] = (acc[cat] || 0) + t.amount;
      return acc;
    }, {});

  const barData = Object.entries(expenseData).map(([name, value]) => ({
    name,
    value,
  }));
  const pieData = barData.map(({ name, value }) => ({ name, value }));

  return (
    <div className="mt-4 flex flex-col sm:flex-row gap-4">
      <Card className="flex-1">
        <CardTitle>Spending by Category</CardTitle>
        <BarChart width={300} height={250} data={barData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#8884d8" />
        </BarChart>
      </Card>
      <Card className="flex-1">
        <CardTitle>Expense Distribution</CardTitle>
        <PieChart width={300} height={250}>
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            label
          >
            {pieData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </Card>
    </div>
  );
}

export default function App() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const storedTransactions = JSON.parse(
      localStorage.getItem("budgetTransactions") || "[]"
    );
    setTransactions(storedTransactions);
  }, []);

  useEffect(() => {
    localStorage.setItem("budgetTransactions", JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (transaction) => {
    setTransactions([...transactions, { ...transaction, id: Date.now() }]);
  };

  const deleteTransaction = (index) => {
    setTransactions(transactions.filter((_, i) => i !== index));
  };

  const editTransaction = (index, updatedTransaction) => {
    const newTransactions = [...transactions];
    newTransactions[index] = {
      ...newTransactions[index],
      ...updatedTransaction,
    };
    setTransactions(newTransactions);
  };

  const totalBalance = transactions.reduce(
    (acc, t) => (t.type === "income" ? acc + t.amount : acc - t.amount),
    0
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Budget Tracker</h1>
      <TransactionForm onSubmit={addTransaction} />
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Total Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <p
            className={`text-2xl ${
              totalBalance >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            ${totalBalance.toFixed(2)}
          </p>
        </CardContent>
      </Card>
      <Charts transactions={transactions} />
      <TransactionTable
        transactions={transactions}
        onDelete={deleteTransaction}
        onEdit={editTransaction}
      />
    </div>
  );
}
