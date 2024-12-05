import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

// Mock data for initial state
const initialTopics = [
  {
    id: 1,
    title: "New Product Ideas",
    description: "Brainstorm innovative product concepts for our company.",
    ideas: [
      { id: 1, text: "Smart home assistant", votes: 5, comments: [] },
      { id: 2, text: "Eco-friendly water bottle", votes: 3, comments: [] },
    ],
  },
  {
    id: 2,
    title: "Marketing Strategies",
    description: "Discuss effective marketing approaches for our target audience.",
    ideas: [
      { id: 1, text: "Influencer partnerships", votes: 4, comments: [] },
      { id: 2, text: "Interactive social media campaigns", votes: 2, comments: [] },
    ],
  },
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

const Input = ({ value, onChange, placeholder, className }) => (
  <input
    type="text"
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={cn(
      "border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500",
      className
    )}
  />
);

const Textarea = ({ value, onChange, placeholder, className }) => (
  <textarea
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={cn(
      "border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500",
      className
    )}
  />
);

const TopicCard = ({ topic, onAddIdea, onVote, onAddComment }) => {
  const [newIdea, setNewIdea] = useState("");
  const [showComments, setShowComments] = useState({});

  const handleAddIdea = () => {
    if (newIdea.trim()) {
      onAddIdea(topic.id, newIdea);
      setNewIdea("");
    }
  };

  const toggleComments = (ideaId) => {
    setShowComments((prev) => ({ ...prev, [ideaId]: !prev[ideaId] }));
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4">
      <h2 className="text-xl font-bold mb-2">{topic.title}</h2>
      <p className="text-gray-600 mb-4">{topic.description}</p>
      <div className="mb-4">
        <Input
          value={newIdea}
          onChange={(e) => setNewIdea(e.target.value)}
          placeholder="Add a new idea"
          className="mb-2"
        />
        <Button onClick={handleAddIdea}>Add Idea</Button>
      </div>
      <ul>
        {topic.ideas.map((idea) => (
          <li key={idea.id} className="mb-2">
            <div className="flex items-center">
              <span className="mr-2">{idea.text}</span>
              <Button
                onClick={() => onVote(topic.id, idea.id)}
                className="px-2 py-1 text-sm"
              >
                👍 {idea.votes}
              </Button>
              <Button
                onClick={() => toggleComments(idea.id)}
                className="px-2 py-1 text-sm ml-2"
              >
                💬 {idea.comments.length}
              </Button>
            </div>
            {showComments[idea.id] && (
              <div className="mt-2 ml-4">
                {idea.comments.map((comment, index) => (
                  <p key={index} className="text-sm text-gray-600">
                    {comment}
                  </p>
                ))}
                <Input
                  placeholder="Add a comment"
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && e.target.value.trim()) {
                      onAddComment(topic.id, idea.id, e.target.value);
                      e.target.value = "";
                    }
                  }}
                  className="mt-2"
                />
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

const TopIdeasView = ({ topics }) => {
  const allIdeas = topics.flatMap((topic) =>
    topic.ideas.map((idea) => ({ ...idea, topicTitle: topic.title }))
  );
  const sortedIdeas = allIdeas.sort((a, b) => b.votes - a.votes).slice(0, 5);

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4">
      <h2 className="text-xl font-bold mb-4">Top Ideas</h2>
      <ul>
        {sortedIdeas.map((idea) => (
          <li key={idea.id} className="mb-2">
            <div className="flex items-center">
              <span className="mr-2">
                {idea.text} (from {idea.topicTitle})
              </span>
              <span className="text-sm text-gray-600">👍 {idea.votes}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default function App() {
  const [topics, setTopics] = useState(initialTopics);
  const [newTopic, setNewTopic] = useState({ title: "", description: "" });
  const [showTopIdeas, setShowTopIdeas] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulating real-time updates
      setTopics((prevTopics) => {
        return prevTopics.map((topic) => ({
          ...topic,
          ideas: topic.ideas.map((idea) => ({
            ...idea,
            votes: idea.votes + Math.floor(Math.random() * 2),
          })),
        }));
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleAddTopic = () => {
    if (newTopic.title && newTopic.description) {
      setTopics([
        ...topics,
        {
          id: topics.length + 1,
          ...newTopic,
          ideas: [],
        },
      ]);
      setNewTopic({ title: "", description: "" });
    }
  };

  const handleAddIdea = (topicId, ideaText) => {
    setTopics(
      topics.map((topic) =>
        topic.id === topicId
          ? {
              ...topic,
              ideas: [
                ...topic.ideas,
                { id: topic.ideas.length + 1, text: ideaText, votes: 0, comments: [] },
              ],
            }
          : topic
      )
    );
  };

  const handleVote = (topicId, ideaId) => {
    setTopics(
      topics.map((topic) =>
        topic.id === topicId
          ? {
              ...topic,
              ideas: topic.ideas.map((idea) =>
                idea.id === ideaId ? { ...idea, votes: idea.votes + 1 } : idea
              ),
            }
          : topic
      )
    );
  };

  const handleAddComment = (topicId, ideaId, comment) => {
    setTopics(
      topics.map((topic) =>
        topic.id === topicId
          ? {
              ...topic,
              ideas: topic.ideas.map((idea) =>
                idea.id === ideaId
                  ? { ...idea, comments: [...idea.comments, comment] }
                  : idea
              ),
            }
          : topic
      )
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Collaborative Brainstorming Board</h1>
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Add New Topic</h2>
        <Input
          value={newTopic.title}
          onChange={(e) => setNewTopic({ ...newTopic, title: e.target.value })}
          placeholder="Topic Title"
          className="mb-2"
        />
        <Textarea
          value={newTopic.description}
          onChange={(e) => setNewTopic({ ...newTopic, description: e.target.value })}
          placeholder="Topic Description"
          className="mb-2"
        />
        <Button onClick={handleAddTopic}>Add Topic</Button>
      </div>
      <div className="mb-4">
        <Button onClick={() => setShowTopIdeas(!showTopIdeas)}>
          {showTopIdeas ? "Hide Top Ideas" : "Show Top Ideas"}
        </Button>
      </div>
      {showTopIdeas && <TopIdeasView topics={topics} />}
      {topics.map((topic) => (
        <TopicCard
          key={topic.id}
          topic={topic}
          onAddIdea={handleAddIdea}
          onVote={handleVote}
          onAddComment={handleAddComment}
        />
      ))}
    </div>
  );
}