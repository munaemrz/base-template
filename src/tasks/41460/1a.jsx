import React, { useState, useEffect } from 'react';
import { Button, Input } from "@shadcn/ui";

function App() {
  const [text, setText] = useState('');
  const [wordGraph, setWordGraph] = useState({});

  const stopWords = new Set(['the', 'is', 'in', 'to', 'and', 'of', 'a', 'an', 'for', 'with', 'by', 'on', 'at', 'from']);

  useEffect(() => {
    const words = text.toLowerCase().match(/\b\w+\b/g) || [];
    const wordCount = words.reduce((acc, word) => {
      if (!stopWords.has(word)) {
        acc[word] = (acc[word] || 0) + 1;
      }
      return acc;
    }, {});

    const maxCount = Math.max(...Object.values(wordCount));
    const graph = {};
    for (let [word, count] of Object.entries(wordCount)) {
      graph[word] = { 
        size: 10 + (count / maxCount) * 40, // scale size from 10px to 50px
        count: count
      };
    }
    setWordGraph(graph);
  }, [text]);

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Article Visualizer
          </h2>
        </div>
        <Input 
          as="textarea"
          placeholder="Paste your article here..."
          value={text}
          onChange={handleTextChange}
          className="min-h-[200px] resize-y"
        />
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-2">Word Frequency Graph</h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(wordGraph).map(([word, { size, count }]) => (
              <span 
                key={word} 
                style={{ fontSize: `${size}px` }} 
                className="text-blue-600"
              >
                {word}({count})
              </span>
            ))}
          </div>
        </div>
        <Button onClick={() => setText('')} className="mt-4">Clear Text</Button>
      </div>
    </div>
  );
}

export default App;