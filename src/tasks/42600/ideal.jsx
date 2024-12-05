import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";

const VoteIcon = () => (
  <svg
    className="w-4 h-4"
    fill="currentColor"
    viewBox="0 0 20 20"
  >
    <path d="M10 15l-5.5-5.5 1.42-1.42L10 12.17l4.08-4.09L15.5 9.5z" />
  </svg>
);

const TopicCard = ({ topic, onAddIdea, onVote, onAddComment }) => {
  const [newIdea, setNewIdea] = useState("");
  const [comments, setComments] = useState({});

  const toggleComments = (ideaId) => {
    setComments((prev) => ({
      ...prev,
      [ideaId]: !prev[ideaId],
    }));
  };

  const handleAddIdea = () => {
    if (newIdea.trim()) {
      onAddIdea(topic.id, newIdea);
      setNewIdea("");
    }
  };

  return (
    <Card className="p-4 mb-4 shadow-lg">
      <h3 className="text-xl font-bold">{topic.title}</h3>
      <p className="text-gray-600">{topic.description}</p>
      <div className="mt-4">
        <Input
          placeholder="Add a new idea"
          value={newIdea}
          onChange={(e) => setNewIdea(e.target.value)}
        />
        <Button className="mt-2" onClick={handleAddIdea}>
          Add Idea
        </Button>
      </div>
      <ul className="mt-4 space-y-2">
        {topic.ideas.map((idea) => (
          <li key={idea.id} className="border rounded-lg p-3">
            <div className="flex justify-between items-center">
              <p>{idea.text}</p>
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  onClick={() => onVote(topic.id, idea.id)}
                  className="flex items-center space-x-1"
                >
                  <VoteIcon />
                  <span>{idea.votes}</span>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toggleComments(idea.id)}
                >
                  💬 {idea.comments.length}
                </Button>
              </div>
            </div>
            {comments[idea.id] && (
              <div className="mt-2">
                <ul className="space-y-1">
                  {idea.comments.map((comment, index) => (
                    <li key={index} className="text-sm text-gray-600">
                      {comment}
                    </li>
                  ))}
                </ul>
                <Input
                  className="mt-2"
                  placeholder="Add a comment"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.target.value.trim()) {
                      onAddComment(topic.id, idea.id, e.target.value);
                      e.target.value = "";
                    }
                  }}
                />
              </div>
            )}
          </li>
        ))}
      </ul>
    </Card>
  );
};

const TopIdeas = ({ topics }) => {
  const [sortOrder, setSortOrder] = useState("desc");

  const sortedIdeas = topics
    .flatMap((topic) =>
      topic.ideas.map((idea) => ({ ...idea, topicTitle: topic.title }))
    )
    .sort((a, b) => {
      if (sortOrder === "asc") {
        return a.votes - b.votes;
      } else {
        return b.votes - a.votes;
      }
    })
    .slice(0, 5);

  return (
    <Card className="p-4 shadow-lg">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Top Ideas</h2>
        <div>
          <label className="mr-2 text-sm text-gray-600">Sort by:</label>
          <select
            className="border rounded px-2 py-1"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="desc">Most Voted</option>
            <option value="asc">Least Voted</option>
          </select>
        </div>
      </div>
      <ul className="mt-4 space-y-2">
        {sortedIdeas.map((idea, index) => (
          <li key={index} className="text-gray-700 border-b pb-2">
            <p className="font-medium">{idea.text}</p>
            <p className="text-sm text-gray-500">
              Votes: {idea.votes} (from {idea.topicTitle})
            </p>
          </li>
        ))}
      </ul>
    </Card>
  );
};

export default function App() {
  const [topics, setTopics] = useState([]);
  const [showTopIdeas, setShowTopIdeas] = useState(true);
  const [newTopic, setNewTopic] = useState({ title: "", description: "" });

  const handleAddTopic = () => {
    if (newTopic.title.trim() && newTopic.description.trim()) {
      setTopics((prev) => [
        ...prev,
        {
          id: Date.now(),
          title: newTopic.title,
          description: newTopic.description,
          ideas: [],
        },
      ]);
      setNewTopic({ title: "", description: "" });
    }
  };

  const handleAddIdea = (topicId, ideaText) => {
    setTopics((prev) =>
      prev.map((topic) =>
        topic.id === topicId
          ? {
              ...topic,
              ideas: [
                ...topic.ideas,
                {
                  id: Date.now(),
                  text: ideaText,
                  votes: 0,
                  comments: [],
                },
              ],
            }
          : topic
      )
    );
  };

  const handleVote = (topicId, ideaId) => {
    setTopics((prev) =>
      prev.map((topic) =>
        topic.id === topicId
          ? {
              ...topic,
              ideas: topic.ideas.map((idea) =>
                idea.id === ideaId
                  ? { ...idea, votes: idea.votes + 1 }
                  : idea
              ),
            }
          : topic
      )
    );
  };

  const handleAddComment = (topicId, ideaId, comment) => {
    setTopics((prev) =>
      prev.map((topic) =>
        topic.id === topicId
          ? {
              ...topic,
              ideas: topic.ideas.map((idea) =>
                idea.id === ideaId
                  ? {
                      ...idea,
                      comments: [...idea.comments, comment],
                    }
                  : idea
              ),
            }
          : topic
      )
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">
        Collaborative Brainstorming Board
      </h1>
      <Card className="p-4 mb-6 shadow-lg">
        <h2 className="text-xl font-bold mb-4">Add New Topic</h2>
        <Input
          placeholder="Topic Title"
          value={newTopic.title}
          onChange={(e) =>
            setNewTopic((prev) => ({ ...prev, title: e.target.value }))
          }
          className="mb-2"
        />
        <Textarea
          placeholder="Topic Description"
          value={newTopic.description}
          onChange={(e) =>
            setNewTopic((prev) => ({ ...prev, description: e.target.value }))
          }
          className="mb-2"
        />
        <Button onClick={handleAddTopic}>Add Topic</Button>
      </Card>
      <div className="flex flex-col sm:flex-row">
        <div className="sm:w-2/3 sm:pr-4">
          <div>
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
        </div>
        <div className="sm:w-1/3 sm:pl-4 mt-6 sm:mt-0">
          {showTopIdeas && <TopIdeas topics={topics} />}
        </div>
      </div>
    </div>
  );
}
