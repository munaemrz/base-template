import React, { useState, useEffect } from 'react';

// Utility function to simulate real-time updates
function simulateRealTimeUpdate(setData, initialData) {
  const interval = setInterval(() => {
    setData(JSON.parse(localStorage.getItem('brainstormData')) || initialData);
  }, 1000);

  return () => clearInterval(interval);
}

// Topic Component
function Topic({ topic, onVote, onComment }) {
  return (
    <div className="border p-4 mb-4 rounded-lg shadow-sm">
      <h2 className="text-xl font-bold mb-2">{topic.title}</h2>
      <p>{topic.description}</p>
      <div className="mt-4">
        <button 
          onClick={() => onVote(topic.id)} 
          className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
        >
          Vote ({topic.votes})
        </button>
        <input 
          type="text" 
          placeholder="Add a comment..." 
          onKeyPress={(e) => {
            if (e.key === 'Enter') onComment(topic.id, e.target.value);
          }}
          className="border p-2 rounded w-full sm:w-auto"
        />
      </div>
      <div className="mt-2">
        {topic.comments.map((comment, idx) => (
          <p key={idx} className="text-sm italic">{comment}</p>
        ))}
      </div>
    </div>
  );
}

// TopIdeas Component
function TopIdeas({ topics }) {
  const sortedIdeas = [...topics].sort((a, b) => b.votes - a.votes);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Top Ideas</h2>
      {sortedIdeas.map(topic => (
        <div key={topic.id} className="mb-2">
          <span className="font-semibold">{topic.title}</span> - Votes: {topic.votes}
        </div>
      ))}
    </div>
  );
}

// Main App Component
export default function App() {
  const [topics, setTopics] = useState([
    { id: 1, title: 'New Feature', description: 'Implement dark mode', votes: 0, comments: [] },
    { id: 2, title: 'Bug Fix', description: 'Address login issues', votes: 0, comments: [] },
  ]);

  useEffect(() => {
    return simulateRealTimeUpdate(setTopics, topics);
  }, []);

  useEffect(() => {
    localStorage.setItem('brainstormData', JSON.stringify(topics));
  }, [topics]);

  const addTopic = (title, description) => {
    setTopics(prev => [
      ...prev, 
      { id: Date.now(), title, description, votes: 0, comments: [] }
    ]);
  };

  const handleVote = (id) => {
    setTopics(prevTopics => 
      prevTopics.map(topic => 
        topic.id === id ? { ...topic, votes: topic.votes + 1 } : topic
      )
    );
  };

  const handleComment = (id, comment) => {
    setTopics(prevTopics => 
      prevTopics.map(topic => 
        topic.id === id ? { ...topic, comments: [...topic.comments, comment] } : topic
      )
    );
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Brainstorm Board</h1>
      <div className="mb-4">
        <input 
          type="text" 
          placeholder="Topic Title" 
          id="title" 
          className="border p-2 rounded mb-2 w-full sm:w-auto"
        />
        <input 
          type="text" 
          placeholder="Description" 
          id="desc" 
          className="border p-2 rounded mb-2 w-full sm:w-auto"
        />
        <button 
          onClick={() => {
            const title = document.getElementById('title').value;
            const desc = document.getElementById('desc').value;
            if(title && desc) addTopic(title, desc);
          }}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Add Topic
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          {topics.map(topic => (
            <Topic 
              key={topic.id} 
              topic={topic} 
              onVote={handleVote} 
              onComment={handleComment} 
            />
          ))}
        </div>
        <div className="sm:mt-0 mt-4">
          <TopIdeas topics={topics} />
        </div>
      </div>
    </div>
  );
}