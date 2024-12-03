import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const albums = [
  {
    id: 1,
    title: "Random Access Memories",
    artist: "Daft Punk",
    cover: "https://picsum.photos/seed/album1/300/300",
    tracks: [
      { title: "Get Lucky", preview: "https://example.com/preview1.mp3" },
      { title: "Instant Crush", preview: "https://example.com/preview2.mp3" },
    ],
  },
  {
    id: 2,
    title: "21",
    artist: "Adele",
    cover: "https://picsum.photos/seed/album2/300/300",
    tracks: [
      { title: "Rolling in the Deep", preview: "https://example.com/preview3.mp3" },
      { title: "Someone Like You", preview: "https://example.com/preview4.mp3" },
    ],
  },
  {
    id: 3,
    title: "Thriller",
    artist: "Michael Jackson",
    cover: "https://picsum.photos/seed/album3/300/300",
    tracks: [
      { title: "Billie Jean", preview: "https://example.com/preview5.mp3" },
      { title: "Beat It", preview: "https://example.com/preview6.mp3" },
    ],
  },
  {
    id: 4,
    title: "Back in Black",
    artist: "AC/DC",
    cover: "https://picsum.photos/seed/album4/300/300",
    tracks: [
      { title: "You Shook Me All Night Long", preview: "https://example.com/preview7.mp3" },
      { title: "Back in Black", preview: "https://example.com/preview8.mp3" },
    ],
  },
];

function AlbumGrid({ albums, onAlbumClick, mostPlayedAlbum }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {albums.map((album) => (
        <Card
          key={album.id}
          className={cn(
            "cursor-pointer hover:shadow-lg transition-shadow",
            album.id === mostPlayedAlbum?.id && "ring-2 ring-primary"
          )}
          onClick={() => onAlbumClick(album)}
        >
          <div className="relative">
            <img
              src={album.cover}
              alt={`${album.title} by ${album.artist}`}
              className="w-full h-auto rounded-t-lg"
            />
            {album.id === mostPlayedAlbum?.id && (
              <Badge className="absolute top-2 right-2">Most Played</Badge>
            )}
          </div>
          <div className="p-4">
            <h3 className="font-semibold truncate">{album.title}</h3>
            <p className="text-sm text-gray-600 truncate">{album.artist}</p>
          </div>
        </Card>
      ))}
    </div>
  );
}

function AlbumDetails({ album, onClose }) {
  const [currentTrack, setCurrentTrack] = useState(null);

  const playTrack = (track) => {
    if (currentTrack === track) {
      setCurrentTrack(null);
    } else {
      setCurrentTrack(track);
    }
  };

  return (
    <Card className="fixed inset-0 z-50 overflow-auto bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto p-4 flex flex-col items-center">
        <Button className="self-end mb-4" onClick={onClose}>
          Close
        </Button>
        <img
          src={album.cover}
          alt={`${album.title} by ${album.artist}`}
          className="w-64 h-64 rounded-lg shadow-lg mb-4"
        />
        <h2 className="text-2xl font-bold mb-2">{album.title}</h2>
        <p className="text-xl mb-4">{album.artist}</p>
        <div className="w-full max-w-md">
          <h3 className="text-lg font-semibold mb-2">Tracks:</h3>
          <ul className="space-y-2">
            {album.tracks.map((track, index) => (
              <li key={index} className="flex items-center justify-between">
                <span>{track.title}</span>
                <Button
                  size="sm"
                  onClick={() => playTrack(track)}
                  variant={currentTrack === track ? "secondary" : "default"}
                >
                  {currentTrack === track ? "Pause" : "Play"}
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
}

export default function App() {
  const [shuffledAlbums, setShuffledAlbums] = useState(albums);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [mostPlayedAlbum, setMostPlayedAlbum] = useState(null);
  const [playCount, setPlayCount] = useState({});

  useEffect(() => {
    const maxPlayCount = Math.max(...Object.values(playCount));
    const mostPlayed = albums.find((album) => playCount[album.id] === maxPlayCount);
    setMostPlayedAlbum(mostPlayed);
  }, [playCount]);

  const shuffleAlbums = () => {
    setShuffledAlbums([...shuffledAlbums].sort(() => Math.random() - 0.5));
  };

  const handleAlbumClick = (album) => {
    setSelectedAlbum(album);
    setPlayCount((prev) => ({
      ...prev,
      [album.id]: (prev[album.id] || 0) + 1,
    }));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Music Album Visualizer</h1>
      <Button onClick={shuffleAlbums} className="mb-4">
        Shuffle Albums
      </Button>
      <AlbumGrid
        albums={shuffledAlbums}
        onAlbumClick={handleAlbumClick}
        mostPlayedAlbum={mostPlayedAlbum}
      />
      {selectedAlbum && (
        <AlbumDetails album={selectedAlbum} onClose={() => setSelectedAlbum(null)} />
      )}
    </div>
  );
}