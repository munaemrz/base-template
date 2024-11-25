import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

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

const PieChart = ({ data }) => {
  const total = data.reduce((sum, [_, value]) => sum + value, 0);
  let cumulativePercentage = 0;

  return (
    <div className="relative w-64 h-64">
      {data.map(([label, value], index) => {
        const percentage = (value / total) * 100;
        const startAngle = cumulativePercentage * 3.6;
        const endAngle = (cumulativePercentage + percentage) * 3.6;
        cumulativePercentage += percentage;

        return (
          <div
            key={label}
            className="absolute inset-0"
            style={{
              clipPath: `polygon(50% 50%, ${50 + 50 * Math.cos((startAngle * Math.PI) / 180)}% ${
                50 + 50 * Math.sin((startAngle * Math.PI) / 180)
              }%, ${50 + 50 * Math.cos((endAngle * Math.PI) / 180)}% ${
                50 + 50 * Math.sin((endAngle * Math.PI) / 180)
              }%)`,
              backgroundColor: `hsl(${(index * 360) / data.length}, 70%, 50%)`,
            }}
          ></div>
        );
      })}
    </div>
  );
};

export default function App() {
  const [text, setText] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [frequentWords, setFrequentWords] = useState([]);
  const [impactfulSentences, setImpactfulSentences] = useState([]);
  const [filter, setFilter] = useState("");
  const [frequencyThreshold, setFrequencyThreshold] = useState(1);

  useEffect(() => {
    const words = text.toLowerCase().match(/\b\w+\b/g) || [];
    setWordCount(words.length);

    const wordFrequency = words.reduce((acc, word) => {
      acc[word] = (acc[word] || 0) + 1;
      return acc;
    }, {});

    const sortedWords = Object.entries(wordFrequency)
      .sort((a, b) => b[1] - a[1])
      .filter(([word, count]) => count >= frequencyThreshold && word.length > 2);

    setFrequentWords(sortedWords.slice(0, 20));

    const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
    const keywordRegex = new RegExp(filter, "i");
    const sortedSentences = sentences
      .map((sentence) => ({
        text: sentence.trim(),
        score: (sentence.match(/\b\w+\b/g) || []).length,
      }))
      .sort((a, b) => b.score - a.score)
      .filter((sentence) => keywordRegex.test(sentence.text));

    setImpactfulSentences(sortedSentences.slice(0, 5));
  }, [text, filter, frequencyThreshold]);

  return (
    <div className="container mx-auto p-4 sm:p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Article Visualizer</h1>
      <Textarea
        placeholder="Paste your article here..."
        className="w-full h-40 mb-4"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <Input
          placeholder="Filter by keyword"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <div className="flex items-center space-x-4">
          <span>Frequency Threshold:</span>
          <Slider
            min={1}
            max={10}
            step={1}
            value={[frequencyThreshold]}
            onValueChange={([value]) => setFrequencyThreshold(value)}
          />
          <span>{frequencyThreshold}</span>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Word Count: {wordCount}</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart data={[["Words", wordCount]]} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Most Frequent Words</CardTitle>
          </CardHeader>
          <CardContent>
            <WordCloud words={frequentWords} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Word Frequency</CardTitle>
          </CardHeader>
          <CardContent>
            <PieChart data={frequentWords.slice(0, 5)} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <Collapsible>
              <CollapsibleTrigger asChild>
                <Button className="w-full mb-2">Toggle Impactful Sentences</Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <ul className="list-disc pl-5">
                  {impactfulSentences.map((sentence, index) => (
                    <li key={index} className="mb-2">
                      {sentence.text}
                    </li>
                  ))}
                </ul>
              </CollapsibleContent>
            </Collapsible>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}