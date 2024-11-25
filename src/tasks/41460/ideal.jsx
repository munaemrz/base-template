import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";

const BarChart = ({ data }) => (
  <div className="flex items-end h-64 space-x-2">
    {data.map(([label, value]) => (
      <div key={label} className="flex flex-col items-center">
        <div
          className="w-8 bg-blue-500 rounded-t"
          style={{ height: `${(value / Math.max(...data.map((d) => d[1]))) * 100}%` }}
        ></div>
        <span className="text-xs mt-1">{label}</span>
      </div>
    ))}
  </div>
);

const WordCloud = ({ words }) => (
  <div className="flex flex-wrap justify-center">
    {words.map(([word, count]) => (
      <span
        key={word}
        className="m-1 p-1 bg-blue-100 rounded"
        style={{ fontSize: `${Math.log(count) * 10 + 12}px` }}
      >
        {word}
      </span>
    ))}
  </div>
);

export default function App() {
  const [text, setText] = useState("");
  const [metrics, setMetrics] = useState({ wordCount: 0, frequentWords: [], sentences: [] });
  const [filters, setFilters] = useState({ keyword: "", frequency: 1 });

  useEffect(() => {
    const words = text.toLowerCase().match(/\b\w+\b/g) || [];
    const wordCount = words.length;
    const wordFrequency = words.reduce((acc, word) => {
      acc[word] = (acc[word] || 0) + 1;
      return acc;
    }, {});

    const frequentWords = Object.entries(wordFrequency)
      .sort((a, b) => b[1] - a[1])
      .filter(([_, count]) => count >= filters.frequency);

    const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
    const impactfulSentences = sentences
      .filter((sentence) => sentence.includes(filters.keyword))
      .slice(0, 5);

    setMetrics({ wordCount, frequentWords, sentences: impactfulSentences });
  }, [text, filters]);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Article Visualizer</h1>
      <Textarea
        placeholder="Paste your article here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="mb-4"
      />
      <div className="flex space-x-4 mb-4">
        <Input
          placeholder="Keyword"
          value={filters.keyword}
          onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
        />
        <div className="flex items-center space-x-2">
          <span>Frequency</span>
          <Slider
            value={[filters.frequency]}
            min={1}
            max={10}
            onValueChange={([value]) => setFilters({ ...filters, frequency: value })}
          />
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Word Count: {metrics.wordCount}</CardTitle>
        </CardHeader>
        <CardContent>
          <BarChart data={metrics.frequentWords} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Frequent Words</CardTitle>
        </CardHeader>
        <CardContent>
          <WordCloud words={metrics.frequentWords} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Impactful Sentences</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5">
            {metrics.sentences.map((sentence, idx) => (
              <li key={idx}>{sentence}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
