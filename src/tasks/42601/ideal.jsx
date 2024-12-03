import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const albums = [
  {
    id: 1,
    title: "Viva la Vida",
    artist: "Coldplay",
    cover: "https://live.staticflickr.com/3781/32591401443_16609ded18_o.jpg",
    tracks: [
      {
        title: "Sky Full of Stars",
        preview:
          "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      },
      {
        title: "Fix You",
        preview:
          "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
      },
    ],
    plays: 0,
  },
  {
    id: 2,
    title: "Thriller",
    artist: "Michael Jackson",
    cover:
      "https://upload.wikimedia.org/wikipedia/en/5/55/Michael_Jackson_-_Thriller.png",
    tracks: [
      {
        title: "Billie Jean",
        preview:
          "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
      },
      {
        title: "Beat It",
        preview:
          "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
      },
    ],
    plays: 0,
  },
  {
    id: 3,
    title: "Maroon 5",
    artist: "Adam Levine",
    cover: "https://live.staticflickr.com/7321/9629216183_48143b45df_k.jpg",
    tracks: [
      {
        title: "Memories",
        preview:
          "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
      },
      {
        title: "Girls Like You",
        preview:
          "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
      },
    ],
    plays: 0,
  },
];

function AlbumGrid({ albums, onAlbumClick, mostPlayedAlbum }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {albums.map((album) => (
        <Card
          key={album.id}
          className={`cursor-pointer hover:shadow-lg ${
            album.id === mostPlayedAlbum?.id ? "ring-2 ring-yellow-400" : ""
          }`}
          onClick={() => onAlbumClick(album)}
        >
          <div className="aspect-w-1 aspect-h-1">
            <img
              src={album.cover}
              alt={`${album.title} by ${album.artist}`}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          <div className="p-4">
            <h3 className="font-semibold truncate">{album.title}</h3>
            <p className="text-sm text-gray-600 truncate">{album.artist}</p>
          </div>
          {album.id === mostPlayedAlbum?.id && (
            <Badge className="absolute top-2 right-2 bg-yellow-400 text-black">
              Most Played
            </Badge>
          )}
        </Card>
      ))}
    </div>
  );
}

function AlbumDetails({ album, onClose, onTrackPlay }) {
  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/30 backdrop-blur-sm">
      <Card className="relative w-full max-w-md mx-auto shadow-lg">
        <Button
          onClick={onClose}
          className="absolute top-4 right-4 bg-red-500 text-white"
        >
          Close
        </Button>
        <img
          src={album.cover}
          alt={`${album.title} by ${album.artist}`}
          className="w-full h-64 object-cover rounded-t-lg"
        />
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-2">{album.title}</h2>
          <p className="text-lg mb-4">{album.artist}</p>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Tracks:</h3>
            <ul className="space-y-2">
              {album.tracks.map((track, index) => (
                <li key={index} className="flex justify-between items-center">
                  <span>{track.title}</span>
                  <audio
                    controls
                    src={track.preview}
                    className="w-32"
                    preload="none"
                    onPlay={() => onTrackPlay(album.id)}
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default function App() {
  const [shuffledAlbums, setShuffledAlbums] = useState(albums);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [mostPlayedAlbum, setMostPlayedAlbum] = useState(null);

  useEffect(() => {
    const updateMostPlayed = () => {
      const maxPlays = Math.max(...shuffledAlbums.map((album) => album.plays));
      const mostPlayed = shuffledAlbums.find(
        (album) => album.plays === maxPlays
      );
      setMostPlayedAlbum(mostPlayed);
    };
    updateMostPlayed();
  }, [shuffledAlbums]);

  const shuffleAlbums = () => {
    setShuffledAlbums([...shuffledAlbums].sort(() => Math.random() - 0.5));
  };

  const handleAlbumClick = (album) => {
    setSelectedAlbum(album);
  };

  const handleTrackPlay = (albumId) => {
    setShuffledAlbums((prev) =>
      prev.map((album) =>
        album.id === albumId ? { ...album, plays: album.plays + 1 } : album
      )
    );
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Music Album Visualizer</h1>
      <div className="flex justify-center mb-6">
        <Button onClick={shuffleAlbums} className="bg-blue-500 text-white">
          Shuffle Albums
        </Button>
      </div>
      <AlbumGrid
        albums={shuffledAlbums}
        onAlbumClick={handleAlbumClick}
        mostPlayedAlbum={mostPlayedAlbum}
      />
      {selectedAlbum && (
        <AlbumDetails
          album={selectedAlbum}
          onClose={() => setSelectedAlbum(null)}
          onTrackPlay={handleTrackPlay}
        />
      )}
    </div>
  );
}
