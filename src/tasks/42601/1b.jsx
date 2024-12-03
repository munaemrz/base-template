import React, { useState, useEffect } from 'react';

// Mock data for albums
const albums = [
  { id: 1, title: 'Echoes', artist: 'Pink Floyd', cover: 'url_to_cover1.jpg', tracks: [{ name: 'Shine On', preview: 'preview_url1.mp3' }], plays: 102 },
  { id: 2, title: 'Thriller', artist: 'Michael Jackson', cover: 'url_to_cover2.jpg', tracks: [{ name: 'Beat It', preview: 'preview_url2.mp3' }], plays: 500 },
  // More albums can be added here...
];

// Placeholder for album cover
const placeholderCover = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==';

function AlbumGrid() {
  const [displayedAlbums, setDisplayedAlbums] = useState(albums);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const mostPlayed = albums.reduce((prev, current) => (prev.plays > current.plays) ? prev : current);

  useEffect(() => {
    setDisplayedAlbums(albums.sort(() => Math.random() - 0.5));
  }, []);

  const shuffleAlbums = () => {
    setDisplayedAlbums([...albums].sort(() => Math.random() - 0.5));
  };

  return (
    <div className="p-4">
      <button onClick={shuffleAlbums} className="mb-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Shuffle Albums
      </button>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {displayedAlbums.map(album => (
          <div 
            key={album.id} 
            className={`relative cursor-pointer ${album.id === mostPlayed.id ? 'border-4 border-yellow-400' : ''}`}
            onClick={() => setSelectedAlbum(album)}
          >
            <img src={album.cover || placeholderCover} alt={album.title} className="w-full h-auto object-cover" />
            {album.id === mostPlayed.id && <div className="absolute top-0 right-0 bg-yellow-400 text-xs p-1">Most Played</div>}
          </div>
        ))}
      </div>
      {selectedAlbum && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center" onClick={() => setSelectedAlbum(null)}>
          <div className="bg-white p-4 rounded-lg w-full sm:w-1/2" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold">{selectedAlbum.title}</h2>
            <p>by {selectedAlbum.artist}</p>
            <ul>
              {selectedAlbum.tracks.map(track => (
                <li key={track.name}>
                  {track.name} - <audio controls src={track.preview} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold p-4">Music Album Visualizer</h1>
        <AlbumGrid />
      </div>
    </div>
  );
}