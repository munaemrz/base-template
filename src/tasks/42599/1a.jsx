import React, { useState } from "react";
import { cn } from "@/lib/utils";

// Mock data for local news articles
const newsArticles = [
  {
    id: 1,
    title: "Local Team Wins Championship",
    category: "Sports",
    content: "In a thrilling match, our local team secured the championship...",
    isBreaking: true,
  },
  {
    id: 2,
    title: "New Tech Hub Opens Downtown",
    category: "Technology",
    content: "A state-of-the-art tech hub has opened its doors in the city center...",
    isBreaking: false,
  },
  {
    id: 3,
    title: "Severe Weather Warning Issued",
    category: "Weather",
    content: "Meteorologists predict heavy storms in the area for the next 48 hours...",
    isBreaking: true,
  },
  // Add more mock articles as needed
];

const Button = ({ children, onClick, className }) => (
  <button
    className={cn(
      "px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors",
      className
    )}
    onClick={onClick}
  >
    {children}
  </button>
);

const Badge = ({ children, className }) => (
  <span
    className={cn(
      "px-2 py-1 text-xs font-semibold rounded-full",
      className
    )}
  >
    {children}
  </span>
);

const Card = ({ children, className }) => (
  <div
    className={cn(
      "bg-white shadow-md rounded-lg overflow-hidden",
      className
    )}
  >
    {children}
  </div>
);

const NewsArticle = ({ article, isExpanded, onToggleExpand }) => (
  <Card className="mb-4">
    <div className="p-4">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold">{article.title}</h3>
        <Badge className="bg-gray-200 text-gray-700">{article.category}</Badge>
      </div>
      {article.isBreaking && (
        <Badge className="bg-red-500 text-white mb-2">Breaking News</Badge>
      )}
      <p className={cn("text-gray-600", isExpanded ? "" : "line-clamp-2")}>
        {article.content}
      </p>
      <Button
        className="mt-2 text-sm px-2 py-1"
        onClick={() => onToggleExpand(article.id)}
      >
        {isExpanded ? "Collapse" : "Expand"}
      </Button>
    </div>
  </Card>
);

const NewsFeed = ({ articles, viewMode, expandedArticles, onToggleExpand }) => (
  <div
    className={cn(
      "grid gap-4",
      viewMode === "grid" ? "sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
    )}
  >
    {articles.map((article) => (
      <NewsArticle
        key={article.id}
        article={article}
        isExpanded={expandedArticles.includes(article.id)}
        onToggleExpand={onToggleExpand}
      />
    ))}
  </div>
);

export default function App() {
  const [viewMode, setViewMode] = useState("list");
  const [expandedArticles, setExpandedArticles] = useState([]);

  const toggleViewMode = () => {
    setViewMode(viewMode === "list" ? "grid" : "list");
  };

  const toggleExpand = (articleId) => {
    setExpandedArticles((prev) =>
      prev.includes(articleId)
        ? prev.filter((id) => id !== articleId)
        : [...prev, articleId]
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Local News Dashboard</h1>
      <div className="mb-4">
        <Button onClick={toggleViewMode}>
          Switch to {viewMode === "list" ? "Grid" : "List"} View
        </Button>
      </div>
      <NewsFeed
        articles={newsArticles}
        viewMode={viewMode}
        expandedArticles={expandedArticles}
        onToggleExpand={toggleExpand}
      />
    </div>
  );
}