import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const CategoryInput = ({ category, value, onChange, onRemove }) => (
  <div className="flex items-center space-x-2 mb-2">
    <Input
      placeholder="Category"
      value={category}
      onChange={(e) => onChange("category", e.target.value)}
      className="w-1/2"
    />
    <Input
      type="number"
      placeholder="Value"
      value={value}
      onChange={(e) => onChange("value", e.target.value)}
      className="w-1/3"
    />
    <Button onClick={onRemove} variant="destructive" size="sm">
      Remove
    </Button>
  </div>
);

const BarGraph = ({ data }) => {
  const maxValue = Math.max(...data.map((item) => item.value));
  const barWidth = 40;
  const barGap = 20;
  const width = data.length * (barWidth + barGap);
  const height = 200;

  return (
    <svg width={width} height={height} className="mt-4">
      {data.map((item, index) => {
        const barHeight = (item.value / maxValue) * height;
        const x = index * (barWidth + barGap);
        const y = height - barHeight;

        return (
          <g key={item.category}>
            <rect
              x={x}
              y={y}
              width={barWidth}
              height={barHeight}
              fill="#3b82f6"
              className="hover:fill-blue-400 transition-colors"
            >
              <title>{`${item.category}: ${item.value}`}</title>
            </rect>
            <text
              x={x + barWidth / 2}
              y={height + 20}
              textAnchor="middle"
              className="text-xs"
            >
              {item.category}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

const InsightsPanel = ({ data }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const average = total / data.length;
  const highest = data.reduce((max, item) => (item.value > max.value ? item : max), data[0]);
  const lowest = data.reduce((min, item) => (item.value < min.value ? item : min), data[0]);

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="insights">
        <AccordionTrigger>Insights</AccordionTrigger>
        <AccordionContent>
          <ul className="list-disc pl-4">
            <li>Highest: {highest.category} ({highest.value})</li>
            <li>Lowest: {lowest.category} ({lowest.value})</li>
            <li>Total: {total}</li>
            <li>Average: {average.toFixed(2)}</li>
          </ul>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default function App() {
  const [data, setData] = useState([{ category: "", value: "" }]);
  const [error, setError] = useState("");

  const addCategory = () => {
    setData([...data, { category: "", value: "" }]);
  };

  const updateCategory = (index, field, value) => {
    const newData = [...data];
    newData[index][field] = value;
    setData(newData);
  };

  const removeCategory = (index) => {
    const newData = data.filter((_, i) => i !== index);
    setData(newData);
  };

  const resetForm = () => {
    setData([{ category: "", value: "" }]);
    setError("");
  };

  const validateData = () => {
    const categories = new Set();
    for (const item of data) {
      if (!item.category || !item.value) {
        setError("All fields must be filled");
        return false;
      }
      if (categories.has(item.category)) {
        setError("Duplicate category names are not allowed");
        return false;
      }
      categories.add(item.category);
      if (isNaN(item.value) || Number(item.value) < 0) {
        setError("Values must be positive numbers");
        return false;
      }
    }
    setError("");
    return true;
  };

  useEffect(() => {
    validateData();
  }, [data]);

  const validData = data.every((item) => item.category && !isNaN(item.value) && Number(item.value) >= 0);

  return (
    <div className="container mx-auto p-4 max-w-md sm:max-w-xl">
      <h1 className="text-2xl font-bold mb-4">Data Visualization App</h1>
      <form className="mb-4">
        {data.map((item, index) => (
          <CategoryInput
            key={index}
            category={item.category}
            value={item.value}
            onChange={(field, value) => updateCategory(index, field, value)}
            onRemove={() => removeCategory(index)}
          />
        ))}
        <div className="flex space-x-2 mt-2">
          <Button type="button" onClick={addCategory}>
            Add Category
          </Button>
          <Button type="button" onClick={resetForm} variant="outline">
            Reset Form
          </Button>
        </div>
      </form>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {validData && (
        <div className="overflow-x-auto">
          <BarGraph data={data.map((item) => ({ ...item, value: Number(item.value) }))} />
        </div>
      )}
      {validData && <InsightsPanel data={data.map((item) => ({ ...item, value: Number(item.value) }))} />}
    </div>
  );
}