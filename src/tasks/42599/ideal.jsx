import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { List, Grid } from "lucide-react"; // Assuming Lucide React icons are available

// Mock data for local news articles
const newsArticles = [
  {
    id: 1,
    title: "Local Team Wins Championship",
    category: "Sports",
    content:
      "In a thrilling match, our local team secured the championship after a nail-biting finish!",
    isBreaking: true,
  },
  {
    id: 2,
    title: "New Tech Hub Opens Downtown",
    category: "Technology",
    content:
      "A state-of-the-art tech hub has opened its doors in the city center, attracting startups and innovators. Many of the investors are looking into new businesses to invest in and take it to the wall street.",
    isBreaking: false,
  },
  {
    id: 3,
    title: "Severe Weather Warning Issued",
    category: "Weather",
    content:
      "Meteorologists predict heavy storms in the area for the next 48 hours. Stay safe and prepare accordingly.",
    isBreaking: true,
  },
];

const categoryColors = {
  Sports: "bg-green-500 text-white",
  Technology: "bg-purple-500 text-white",
  Weather: "bg-yellow-500 text-black",
};

const NewsArticle = ({ article, isExpanded, onToggleExpand }) => (
  <Card className="mb-4">
    <div className="p-4">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold">{article.title}</h3>
        <Badge className={categoryColors[article.category] || "bg-gray-300"}>
          {article.category}
        </Badge>
      </div>
      {article.isBreaking && (
        <Badge className="bg-red-500 text-white mb-2">Breaking News</Badge>
      )}
      <p className={`text-gray-700 ${isExpanded ? "" : "line-clamp-2"}`}>
        {article.content}
      </p>
      {article.content.length > 150 && (
        <Button
          className="mt-2 text-sm px-2 py-1 bg-indigo-500 hover:bg-indigo-600"
          onClick={() => onToggleExpand(article.id)}
        >
          {isExpanded ? "Collapse" : "Expand"}
        </Button>
      )}
    </div>
  </Card>
);

const NewsFeed = ({ articles, viewMode, expandedArticles, onToggleExpand }) => (
  <div
    className={`grid gap-4 ${
      viewMode === "grid" ? "sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
    }`}
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
  const [selectedCategory, setSelectedCategory] = useState("");

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

  const categories = [
    ...new Set(newsArticles.map((article) => article.category)), // Get unique categories
  ];

  const filteredArticles = selectedCategory
    ? newsArticles.filter(
        (article) => article.category === selectedCategory
      )
    : newsArticles;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6 text-center text-blue-600">
        Local News Dashboard
      </h1>
      {/* View Mode Toggle + Category Filter */}
      <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
        <button
          onClick={toggleViewMode}
          className="p-2 rounded-full bg-gray-200 hover:bg-gray-300"
        >
          {viewMode === "list" ? (
            <Grid className="w-5 h-5 text-gray-700" />
          ) : (
            <List className="w-5 h-5 text-gray-700" />
          )}
        </button>
        <Button
          onClick={() => setSelectedCategory("")}
          className={`px-4 py-2 border-2 ${
            selectedCategory === ""
              ? "bg-blue-500 text-white border-blue-500"
              : "bg-white border-black text-black hover:bg-gray-200"
          }`}
        >
          All
        </Button>
        {categories.map((category) => (
          <Button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 border-2 ${
              selectedCategory === category
                ? `${categoryColors[category]} border-0`
                : "bg-white border-black text-black hover:bg-gray-200"
            }`}
          >
            {category}
          </Button>
        ))}
      </div>
      <NewsFeed
        articles={filteredArticles}
        viewMode={viewMode}
        expandedArticles={expandedArticles}
        onToggleExpand={toggleExpand}
      />
    </div>
  );
}
