import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const initialData = [
  { year: 2019, revenue: 1000000, profit: 200000 },
  { year: 2020, revenue: 1200000, profit: 250000 },
  { year: 2021, revenue: 1500000, profit: 300000 },
];

function BarGraph({ data }) {
  const maxValue = Math.max(...data.flatMap((d) => [d.revenue, d.profit]));
  const [hoveredBar, setHoveredBar] = useState(null);

  return (
    <svg className="w-full h-64" viewBox="0 0 400 200">
      {data.map((item, index) => (
        <g key={item.year} transform={`translate(${index * 130 + 50}, 0)`}>
          <rect
            x="0"
            y={200 - (item.revenue / maxValue) * 180}
            width="50"
            height={(item.revenue / maxValue) * 180}
            fill="#3b82f6"
            onMouseEnter={() => setHoveredBar(`revenue-${item.year}`)}
            onMouseLeave={() => setHoveredBar(null)}
          />
          <rect
            x="60"
            y={200 - (item.profit / maxValue) * 180}
            width="50"
            height={(item.profit / maxValue) * 180}
            fill="#10b981"
            onMouseEnter={() => setHoveredBar(`profit-${item.year}`)}
            onMouseLeave={() => setHoveredBar(null)}
          />
          <text x="30" y="220" textAnchor="middle" fontSize="12">
            {item.year}
          </text>
          {hoveredBar === `revenue-${item.year}` && (
            <text x="25" y={190 - (item.revenue / maxValue) * 180} textAnchor="middle" fontSize="12">
              ${item.revenue.toLocaleString()}
            </text>
          )}
          {hoveredBar === `profit-${item.year}` && (
            <text x="85" y={190 - (item.profit / maxValue) * 180} textAnchor="middle" fontSize="12">
              ${item.profit.toLocaleString()}
            </text>
          )}
        </g>
      ))}
      <text x="20" y="20" fontSize="12" fill="#3b82f6">
        Revenue
      </text>
      <text x="20" y="40" fontSize="12" fill="#10b981">
        Profit
      </text>
    </svg>
  );
}

function DataInput({ data, setData }) {
  const handleChange = (index, field, value) => {
    const newData = [...data];
    newData[index][field] = parseInt(value) || 0;
    setData(newData);
  };

  return (
    <div className="space-y-4">
      {data.map((item, index) => (
        <div key={item.year} className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <Input
            type="number"
            value={item.year}
            onChange={(e) => handleChange(index, "year", e.target.value)}
            placeholder="Year"
          />
          <Input
            type="number"
            value={item.revenue}
            onChange={(e) => handleChange(index, "revenue", e.target.value)}
            placeholder="Revenue"
          />
          <Input
            type="number"
            value={item.profit}
            onChange={(e) => handleChange(index, "profit", e.target.value)}
            placeholder="Profit"
          />
        </div>
      ))}
    </div>
  );
}

function Insights({ data }) {
  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
  const totalProfit = data.reduce((sum, item) => sum + item.profit, 0);
  const averageRevenue = totalRevenue / data.length;
  const averageProfit = totalProfit / data.length;
  const profitMargin = (totalProfit / totalRevenue) * 100;

  return (
    <div className="space-y-2">
      <p>Total Revenue: ${totalRevenue.toLocaleString()}</p>
      <p>Total Profit: ${totalProfit.toLocaleString()}</p>
      <p>Average Revenue: ${averageRevenue.toLocaleString()}</p>
      <p>Average Profit: ${averageProfit.toLocaleString()}</p>
      <p>Overall Profit Margin: {profitMargin.toFixed(2)}%</p>
    </div>
  );
}

export default function App() {
  const [data, setData] = useState(initialData);
  const [isInsightsOpen, setIsInsightsOpen] = useState(false);

  const resetForm = () => {
    setData(initialData);
  };

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <h1 className="text-2xl font-bold mb-4">Revenue and Profit Report</h1>
      <Card className="p-4 mb-4">
        <DataInput data={data} setData={setData} />
        <Button onClick={resetForm} className="mt-4">
          Reset Form
        </Button>
      </Card>
      <Card className="p-4 mb-4">
        <BarGraph data={data} />
      </Card>
      <Collapsible open={isInsightsOpen} onOpenChange={setIsInsightsOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="w-full">
            {isInsightsOpen ? "Hide Insights" : "Show Insights"}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4">
          <Card className="p-4">
            <Insights data={data} />
          </Card>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}