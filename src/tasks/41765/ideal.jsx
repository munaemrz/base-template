import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

function Flashcard({ term, translation, learned, onToggleLearned }) {
  return (
    <Card className="p-4">
      <CardHeader>
        <h3 className="text-lg font-bold">{term}</h3>
      </CardHeader>
      <CardContent>
        <p>{translation}</p>
        <Button
          onClick={onToggleLearned}
          variant={learned ? "outline" : "default"}
          className="mt-2"
        >
          {learned ? "Mark as To Review" : "Mark as Learned"}
        </Button>
      </CardContent>
    </Card>
  );
}

export default function App() {
  const [flashcards, setFlashcards] = useState([]);
  const [term, setTerm] = useState("");
  const [translation, setTranslation] = useState("");
  const [isPracticeMode, setIsPracticeMode] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const addFlashcard = () => {
    if (term && translation) {
      setFlashcards([...flashcards, { term, translation, learned: false }]);
      setTerm("");
      setTranslation("");
    }
  };

  const toggleLearned = (index) => {
    setFlashcards((prev) =>
      prev.map((card, i) =>
        i === index ? { ...card, learned: !card.learned } : card
      )
    );
  };

  const shuffleFlashcards = () => {
    const shuffled = [...flashcards].sort(() => Math.random() - 0.5);
    setFlashcards(shuffled);
    setCurrentIndex(0);
  };

  const nextFlashcard = () => {
    setCurrentIndex((prev) => (prev + 1) % flashcards.length);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-center mb-6">Language Flashcards</h1>
      <div className="space-y-4">
        {isPracticeMode ? (
          flashcards.length > 0 ? (
            <div>
              <Flashcard
                term={flashcards[currentIndex].term}
                translation={flashcards[currentIndex].translation}
                learned={flashcards[currentIndex].learned}
                onToggleLearned={() => toggleLearned(currentIndex)}
              />
              <Button onClick={nextFlashcard} className="mt-4 w-full">
                Next Card
              </Button>
            </div>
          ) : (
            <p className="text-center">No flashcards available for practice.</p>
          )
        ) : (
          <>
            <Input
              placeholder="Term"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              className="w-full"
            />
            <Input
              placeholder="Translation"
              value={translation}
              onChange={(e) => setTranslation(e.target.value)}
              className="w-full"
            />
            <Button onClick={addFlashcard} className="w-full">
              Add Flashcard
            </Button>
            <Button onClick={shuffleFlashcards} className="w-full mt-4">
              Shuffle Flashcards
            </Button>
            <div className="space-y-4 mt-6">
              {flashcards.map((card, index) => (
                <Flashcard
                  key={index}
                  term={card.term}
                  translation={card.translation}
                  learned={card.learned}
                  onToggleLearned={() => toggleLearned(index)}
                />
              ))}
            </div>
          </>
        )}
        <Button
          onClick={() => setIsPracticeMode(!isPracticeMode)}
          className="w-full mt-4"
        >
          {isPracticeMode ? "Go to Add Mode" : "Go to Practice Mode"}
        </Button>
      </div>
    </div>
  );
}
