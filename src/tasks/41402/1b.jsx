import React, { useState } from 'react';

function App() {
  const [data, setData] = useState([
    { year: '2020', revenue: 100000, profit: 10000 },
    { year: '2021', revenue: 120000, profit: 15000 },
    { year: '2022', revenue: 130000, profit: 20000 },
  ]);

  const handleChange = (index, field, value) => {
    const newData = [...data];
    newData[index][field] = Number(value);
    setData(newData);
  };

  const resetForm = () => {
    setData([
      { year: '2020', revenue: 100000, profit: 10000 },
      { year: '2021', revenue: 120000, profit: 15000 },
      { year: '2022', revenue: 130000, profit: 20000 },
    ]);
  };

  const maxValue = Math.max(...data.map(d => Math.max(d.revenue, d.profit)));

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="max-w-3xl mx-auto bg-white p-4 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Yearly Revenue & Profit Visualizer</h1>
        <div className="mb-4">
          {data.map((entry, index) => (
            <div key={index} className="mb-2">
              <label className="block mb-1">Year {entry.year}</label>
              <input 
                type="number" 
                value={entry.revenue} 
                onChange={(e) => handleChange(index, 'revenue', e.target.value)} 
                className="w-full p-2 border rounded mb-1" 
                placeholder="Revenue"
              />
              <input 
                type="number" 
                value={entry.profit} 
                onChange={(e) => handleChange(index, 'profit', e.target.value)} 
                className="w-full p-2 border rounded" 
                placeholder="Profit"
              />
            </div>
          ))}
          <button onClick={resetForm} className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Reset Form</button>
        </div>
        <BarGraph data={data} maxValue={maxValue} />
        <Insights data={data} />
      </div>
    </div>
  );
}

function BarGraph({ data, maxValue }) {
  const barWidth = 40;
  const barMargin = 10;

  return (
    <div className="mt-6">
      <svg width="100%" height="300" className="bg-gray-50 rounded">
        {data.map((d, i) => (
          <>
            <rect 
              key={`revenue-${i}`}
              x={i * (barWidth + barMargin)} 
              y={300 - (d.revenue / maxValue * 250)} 
              width={barWidth} 
              height={d.revenue / maxValue * 250} 
              fill="#3498db"
              className="hover:fill-blue-600 transition-colors"
            >
              <title>Revenue: ${d.revenue.toLocaleString()}</title>
            </rect>
            <rect 
              key={`profit-${i}`}
              x={i * (barWidth + barMargin)} 
              y={300 - (d.profit / maxValue * 250)} 
              width={barWidth} 
              height={d.profit / maxValue * 250} 
              fill="#2ecc71"
              className="hover:fill-green-600 transition-colors"
            >
              <title>Profit: ${d.profit.toLocaleString()}</title>
            </rect>
            <text x={i * (barWidth + barMargin) + barWidth / 2} y="295" textAnchor="middle">{d.year}</text>
          </>
        ))}
      </svg>
    </div>
  );
}

function Insights({ data }) {
  const totalRevenue = data.reduce((sum, d) => sum + d.revenue, 0);
  const totalProfit = data.reduce((sum, d) => sum + d.profit, 0);
  const profitMargin = ((totalProfit / totalRevenue) * 100).toFixed(2);

  return (
    <details className="mt-4">
      <summary className="cursor-pointer text-lg font-semibold">Key Insights</summary>
      <div className="mt-2">
        <p>Total Revenue: ${totalRevenue.toLocaleString()}</p>
        <p>Total Profit: ${totalProfit.toLocaleString()}</p>
        <p>Average Profit Margin: {profitMargin}%</p>
      </div>
    </details>
  );
}

export default App;