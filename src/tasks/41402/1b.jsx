import React, { useState, useEffect } from 'react';

function App() {
  const [categories, setCategories] = useState([]);
  const [input, setInput] = useState({ name: '', value: '' });
  const [error, setError] = useState('');

  const addCategory = () => {
    if (!input.name || !input.value) {
      setError('Please fill in all fields.');
      return;
    }
    if (!Number.isInteger(Number(input.value)) || Number(input.value) < 0) {
      setError('Please enter a valid positive number.');
      return;
    }
    if (categories.some(cat => cat.name === input.name)) {
      setError('Category already exists.');
      return;
    }
    setCategories([...categories, { ...input, value: parseInt(input.value, 10) }]);
    setInput({ name: '', value: '' });
    setError('');
  };

  const resetForm = () => {
    setCategories([]);
    setInput({ name: '', value: '' });
    setError('');
  };

  const updateCategory = (index, field, value) => {
    const updated = categories.map((cat, i) => 
      i === index ? { ...cat, [field]: field === 'value' ? parseInt(value, 10) : value } : cat
    );
    setCategories(updated);
  };

  const maxValue = Math.max(...categories.map(c => c.value), 0);
  const totalSum = categories.reduce((sum, c) => sum + c.value, 0);
  const averageValue = totalSum / (categories.length || 1);

  return (
    <div className="p-4 space-y-6 bg-gray-100 min-h-screen sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-center">Custom Bar Graph Generator</h1>
      <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
        <div className="space-y-4">
          <input 
            value={input.name} 
            onChange={e => setInput({...input, name: e.target.value})} 
            placeholder="Category Name" 
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input 
            type="number" 
            value={input.value} 
            onChange={e => setInput({...input, value: e.target.value})} 
            placeholder="Value" 
            className="w-full p-2 border border-gray-300 rounded"
          />
          {error && <p className="text-red-500">{error}</p>}
          <button onClick={addCategory} className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Add Category</button>
          <button onClick={resetForm} className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600">Reset Form</button>
        </div>
        <div className="mt-6">
          {categories.map((cat, index) => (
            <div key={index} className="flex items-center mb-2">
              <input 
                value={cat.name} 
                onChange={e => updateCategory(index, 'name', e.target.value)} 
                className="flex-grow p-2 border border-gray-300 rounded mr-2"
              />
              <input 
                type="number" 
                value={cat.value} 
                onChange={e => updateCategory(index, 'value', e.target.value)} 
                className="w-20 p-2 border border-gray-300 rounded"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 max-w-lg mx-auto">
        <Graph categories={categories} maxValue={maxValue} />
        <InsightsPanel categories={categories} totalSum={totalSum} averageValue={averageValue} />
      </div>
    </div>
  );
}

function Graph({ categories, maxValue }) {
  return (
    <svg width="100%" height="300" className="mt-4">
      {categories.map((cat, index) => {
        const barHeight = (cat.value / maxValue) * 250;
        return (
          <g key={index} transform={`translate(${index * 60}, 0)`}>
            <rect 
              y={300 - barHeight} 
              width="40" 
              height={barHeight} 
              fill="steelblue" 
              className="hover:fill-blue-700 cursor-pointer"
              onMouseOver={e => e.currentTarget.setAttribute('fill', 'blue-700')}
              onMouseOut={e => e.currentTarget.setAttribute('fill', 'steelblue')}
            >
              <title>{`${cat.name}: ${cat.value}`}</title>
            </rect>
            <text x="20" y="315" textAnchor="middle" fontSize="10">{cat.name}</text>
          </g>
        );
      })}
    </svg>
  );
}

function InsightsPanel({ categories, totalSum, averageValue }) {
  const [isOpen, setIsOpen] = useState(false);
  const highest = categories.reduce((prev, current) => (prev.value > current.value) ? prev : current, {name: '', value: 0});
  const lowest = categories.reduce((prev, current) => (prev.value < current.value) ? prev : current, {name: '', value: Infinity});

  return (
    <div className="mt-4 bg-white p-4 rounded-lg shadow">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full text-left font-bold">Insights {isOpen ? '▲' : '▼'}</button>
      {isOpen && (
        <div className="mt-2 space-y-2">
          <p>Highest Value: {highest.name} ({highest.value})</p>
          <p>Lowest Value: {lowest.name} ({lowest.value})</p>
          <p>Total Sum: {totalSum}</p>
          <p>Average Value: {averageValue.toFixed(2)}</p>
        </div>
      )}
    </div>
  );
}

export default App;