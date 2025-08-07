import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function Playlibrary() {
  const { playlistId } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const token = localStorage.getItem('spotify_token');

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const res = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setPlaylist(data);
      } catch (error) {
        console.error('Error fetching playlist:', error);
      }
    };

    if (playlistId) fetchPlaylist();
  }, [playlistId, token]);

  if (!playlist) return <p className='text-white'>Cargando playlist...</p>;

  return (
    <div className="text-white p-4 w-[400px]">
      <h2 className="text-2xl font-bold mb-2">{playlist.name}</h2>
      <button className="bg-green-500 text-white px-4 py-2 rounded mb-4">▶ Reproducir toda</button>
      <ul>
        {playlist.tracks.items.map(({ track }) => (
          <li key={track.id} className="mb-2">
            <img src={track.album.images[0]?.url} alt="Cover" className="w-12 h-12 inline-block mr-2" />
            {track.name} - {track.artists.map(a => a.name).join(', ')}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Playlibrary;


