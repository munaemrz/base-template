import React, { useState } from 'react';
import { Button, Card, CardHeader, CardBody, CardFooter, Badge } from "@/components/ui/shadcn";

const newsData = [
  { id: 1, category: 'Sports', title: 'Local Team Wins Championship', content: 'The local basketball team won the regional championship last night...', breaking: true },
  { id: 2, category: 'Technology', title: 'New Tech Hub Opens Downtown', content: 'A new technology hub has been inaugurated in the downtown area...', breaking: false },
  { id: 3, category: 'Weather', title: 'Unexpected Snowfall in April', content: 'Residents were surprised by an unusual snowfall this April...', breaking: true },
  // More news items can be added here
];

function Article({ article, onToggleExpand }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="mb-4">
      <CardHeader>
        <Badge className="mr-2" variant={article.breaking ? "destructive" : "secondary"}>
          {article.breaking ? 'Breaking' : article.category}
        </Badge>
        <h2 className="text-lg font-semibold">{article.title}</h2>
      </CardHeader>
      <CardBody>
        {expanded ? article.content : `${article.content.substring(0, 100)}...`}
      </CardBody>
      <CardFooter>
        <Button onClick={() => { setExpanded(!expanded); onToggleExpand(article.id); }}>
          {expanded ? 'Collapse' : 'Read More'}
        </Button>
      </CardFooter>
    </Card>
  );
}

function NewsFeed({ viewMode }) {
  const [expandedArticles, setExpandedArticles] = useState([]);

  const toggleArticle = (id) => {
    setExpandedArticles(prev => 
      prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
    );
  };

  return (
    <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 gap-4' : 'flex flex-col'}>
      {newsData.map(article => (
        <Article key={article.id} article={article} onToggleExpand={toggleArticle} 
          className={viewMode === 'grid' ? 'w-full' : ''} />
      ))}
    </div>
  );
}

export default function App() {
  const [viewMode, setViewMode] = useState('list');

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Local News Dashboard</h1>
      <Button onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')} className="mb-4">
        Switch to {viewMode === 'list' ? 'Grid' : 'List'} View
      </Button>
      <NewsFeed viewMode={viewMode} />
    </div>
  );
}