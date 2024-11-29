import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { TooltipProvider, Tooltip } from "@/components/ui/tooltip";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

function parseData(text) {
  const lines = text.split("\n").filter((line) => line.trim());
  return lines.map((line) => {
    const match = line.match(/(\d{4}).*?\$?([\d,]+).*?\$?([\d,]+)/);
    if (match) {
      const [_, year, revenue, profit] = match;
      return {
        year,
        revenue: parseFloat(revenue.replace(/,/g, "")) || 0,
        profit: parseFloat(profit.replace(/,/g, "")) || 0,
      };
    }
    return null;
  }).filter((entry) => entry); // Remove invalid entries
}

function BarGraph({ data }) {
  if (!data || data.length === 0) return <div>No valid data to display.</div>;

  const maxValue = Math.max(...data.map((d) => Math.max(d.revenue, d.profit)));
  const barWidth = 20; // Width of each bar
  const groupWidth = barWidth * 2 + 10; // Width of one group (revenue + profit + spacing)

  return (
    <div className="relative h-72 w-full bg-gray-100border rounded-md p-4">
      <h2 className="text-center text-lg font-bold">Yearly Revenue and Profit</h2>
      <svg className="w-full h-full">
        {/* Axis */}
        <line x1="0" y1="90%" x2="100%" y2="90%" stroke="black" strokeWidth="1" />
        {data.map((item, index) => {
          const revenueHeight = item.revenue ? (item.revenue / maxValue) * 100 : 0;
          const profitHeight = item.profit ? (item.profit / maxValue) * 100 : 0;
          const xBase = index * groupWidth + 30; // Position of the group

          return (
            
            <g key={index} className="hover:cursor-pointer">
              <TooltipProvider>
                {/* Revenue Bar */}
                <Tooltip content={`Year: ${item.year}, Revenue: $${item.revenue}`}>
                  <rect
                    x={xBase}
                    y={`${100 - revenueHeight}%`}
                    width={barWidth}
                    height={`${revenueHeight}%`}
                    className="fill-blue-500 hover:fill-blue-700"
                  />
                </Tooltip>
                {/* Profit Bar */}
                <Tooltip content={`Year: ${item.year}, Profit: $${item.profit}`}>
                  <rect
                    x={xBase + barWidth}
                    y={`${100 - profitHeight}%`}
                    width={barWidth}
                    height={`${profitHeight}%`}
                    className="fill-green-500 hover:fill-green-700"
                  />
                </Tooltip>
              </TooltipProvider>
              {/* Year Label */}
              <text
                x={xBase + barWidth / 2 + barWidth / 2}
                y="95%"
                textAnchor="middle"
                className="text-xs"
              >
                {item.year}
              </text>
            </g>
            
          );
        })}
        {/* Axis Label */}
        <text x="50%" y="98%" textAnchor="middle" className="text-sm">
          Years
        </text>
      </svg>
      <div className="mt-2 flex justify-center space-x-4 text-sm">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-blue-500 mr-2"></div> Revenue
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-500 mr-2"></div> Profit
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [text, setText] = useState("");
  const [data, setData] = useState([]);

  const handleTextChange = (e) => {
    const inputText = e.target.value;
    setText(inputText);
    setData(parseData(inputText));
  };

  const resetForm = () => {
    setText("");
    setData([]);
  };

  const insights = () => {
    if (!data.length) return "No data available.";
    const totalRevenue = data.reduce((sum, d) => sum + d.revenue, 0);
    const totalProfit = data.reduce((sum, d) => sum + d.profit, 0);
    const avgProfitMargin = ((totalProfit / totalRevenue) * 100).toFixed(2);
    return `Total Revenue: $${totalRevenue}, Total Profit: $${totalProfit}, Avg Profit Margin: ${avgProfitMargin}%`;
  };

  return (
    <div className="container mx-auto p-4 max-w-xl">
      <h1 className="text-xl font-bold mb-4">Yearly Revenue and Profit Report</h1>
      <Textarea
        placeholder="Enter data in the format: Year, Revenue, Profit (one entry per line)"
        value={text}
        onChange={handleTextChange}
        className="mb-4 w-full"
      />
      <div className="flex justify-between mb-4">
        <Button onClick={resetForm} className="bg-red-500 text-white">
          Reset Form
        </Button>
      </div>
      {data.length > 0 && (
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Bar Graph</h2>
          <BarGraph data={data} />
        </div>
      )}
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="insights">
          <AccordionTrigger>View Insights</AccordionTrigger>
          <AccordionContent>{insights()}</AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
