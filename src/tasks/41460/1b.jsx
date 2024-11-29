import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";

const stopWords = new Set([
  "the", "is", "in", "and", "to", "a", "of", "for", "on", "with", "as", "at",
  "by", "an", "be", "this", "that", "from", "or", "but", "not", "are", "was",
  "were", "it", "have", "has", "had", "will", "would", "could", "should",
]);

function processText(text) {
  const words = text.toLowerCase().match(/\b\w+\b/g) || [];
  const wordFreq = {};
  words.forEach((word) => {
    if (!stopWords.has(word)) {
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    }
  });
  return Object.entries(wordFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 50);
}

function WordCloud({ words }) {
  return (
    <div className="flex flex-wrap justify-center gap-2 p-4">
      {words.map(([word, freq]) => (
        <span
          key={word}
          className="inline-block"
          style={{
            fontSize: `${Math.max(1, Math.min(5, freq / 2))}rem`,
            opacity: Math.max(0.5, Math.min(1, freq / 10)),
          }}
        >
          {word}
        </span>
      ))}
    </div>
  );
}

function TextMetrics({ text }) {
  const wordCount = text.trim().split(/\s+/).length;
  const sentenceCount = (text.match(/[.!?]+/g) || []).length;
  const paragraphCount = text.split(/\n\s*\n/).length;

  return (
    <div className="grid grid-cols-3 gap-4 text-center">
      <Card className="p-4">
        <h3 className="text-lg font-semibold">Words</h3>
        <p className="text-2xl font-bold">{wordCount}</p>
      </Card>
      <Card className="p-4">
        <h3 className="text-lg font-semibold">Sentences</h3>
        <p className="text-2xl font-bold">{sentenceCount}</p>
      </Card>
      <Card className="p-4">
        <h3 className="text-lg font-semibold">Paragraphs</h3>
        <p className="text-2xl font-bold">{paragraphCount}</p>
      </Card>
    </div>
  );
}

export default function App() {
  const [text, setText] = useState("");
  const [processedWords, setProcessedWords] = useState([]);

  useEffect(() => {
    const words = processText(text);
    setProcessedWords(words);
  }, [text]);

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <h1 className="text-3xl font-bold mb-4">Article Visualizer</h1>
      <Textarea
        placeholder="Paste your article here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full h-48 mb-4"
      />
      <Button
        onClick={() => setText("")}
        className={cn(
          "mb-4",
          text.length === 0 && "opacity-50 cursor-not-allowed"
        )}
        disabled={text.length === 0}
      >
        Clear Text
      </Button>
      {text && (
        <>
          <TextMetrics text={text} />
          <h2 className="text-2xl font-semibold mt-8 mb-4">Word Frequency</h2>
          <WordCloud words={processedWords} />
        </>
      )}
    </div>
  );
}