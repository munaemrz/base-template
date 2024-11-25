import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { BarChart } from "@/components/charts"; // Assume these are custom components for charts
import { TagCloud } from "@/components/TagCloud"; // Assume this is a custom component for tag clouds

const TextProcessor = () => {
  const [text, setText] = useState("");
  const [metrics, setMetrics] = useState({
    wordCount: 0,
    frequentWords: [],
    impactSentences: [],
  });
  const [filters, setFilters] = useState({
    keyword: "",
    frequency: 1,
    sentenceLength: 0,
  });

  const processText = () => {
    // Simplified text processing logic
    const words = text.toLowerCase().match(/\b\w+\b/g) || [];
    const wordCount = words.length;
    const wordFrequency = words.reduce((acc, word) => {
      acc[word] = (acc[word] || 0) + 1;
      return acc;
    }, {});

    const frequentWords = Object.entries(wordFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    const sentences = text.split(".");
    const impactSentences = sentences.filter(
      (sentence) =>
        sentence.includes(filters.keyword) ||
        sentence.length > filters.sentenceLength
    );

    setMetrics({
      wordCount,
      frequentWords,
      impactSentences,
    });
  };

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Article Analyzer</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your article here..."
            className="mb-4"
          />
          <Button onClick={processText}>Analyze Text</Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Word Count</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{metrics.wordCount}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Frequent Words</CardTitle>
          </CardHeader>
          {/* <CardContent>
            <TagCloud words={metrics.frequentWords} />
          </CardContent> */}
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Word Distribution</CardTitle>
          </CardHeader>
          {/* <CardContent>
            <BarChart data={metrics.frequentWords} />
          </CardContent> */}
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Impact Sentences</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible>
              {metrics.impactSentences.map((sentence, index) => (
                <AccordionItem value={`item-${index}`} key={index}>
                  <AccordionTrigger>{`Sentence ${index + 1}`}</AccordionTrigger>
                  <AccordionContent>{sentence.trim()}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-2">
          <Input
            placeholder="Keyword"
            value={filters.keyword}
            onChange={(e) =>
              setFilters({ ...filters, keyword: e.target.value })
            }
          />
          <Input
            type="number"
            placeholder="Frequency"
            value={filters.frequency}
            onChange={(e) =>
              setFilters({ ...filters, frequency: parseInt(e.target.value) })
            }
          />
          <Input
            type="number"
            placeholder="Sentence Length"
            value={filters.sentenceLength}
            onChange={(e) =>
              setFilters({
                ...filters,
                sentenceLength: parseInt(e.target.value),
              })
            }
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default function App() {
  return (
    <div className="min-h-screen bg-background">
      <TextProcessor />
    </div>
  );
}
