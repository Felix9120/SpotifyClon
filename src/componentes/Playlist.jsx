import React, { useEffect, useState } from 'react';

function Playlist() {
  const [playlist, setPlaylist] = useState(null);
  const [searchResults, setSearchResults] = useState(null);

  const playlistId = localStorage.getItem('selected_playlist');
  const token = localStorage.getItem('spotify_token');

  useEffect(() => {
    if (!playlistId || !token) return;

    fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => setPlaylist(data))
      .catch(err => console.error('Error al obtener playlist:', err));
  }, [playlistId, token]);

  useEffect(() => {
    const handleSearchUpdate = () => {
      const query = localStorage.getItem('search_query');
      const updatedPlaylistId = localStorage.getItem('selected_playlist');

      if (!query && !updatedPlaylistId) {
        setSearchResults(null);
        setPlaylist(null);
        return;
      }

      if (query && token) {
        fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=50`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((res) => res.json())
          .then((data) => setSearchResults(data.tracks.items))
          .catch((err) => {
            console.error('Error al buscar canciones:', err);
            setSearchResults([]);
          });
      }

      if (updatedPlaylistId && token) {
        fetch(`https://api.spotify.com/v1/playlists/${updatedPlaylistId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
          .then(res => res.json())
          .then(data => setPlaylist(data))
          .catch(err => console.error('Error al obtener playlist:', err));
      }
    };

    window.addEventListener('search-update', handleSearchUpdate);
    return () => window.removeEventListener('search-update', handleSearchUpdate);
  }, [token]);

  if (!searchResults && !playlistId) {
    return (
      <div className="text-white p-4 w-[900px] h-[400px] overflow-auto bg-[#191919] mt-2.5 rounded-[10px]">
        <p>Bienvenido. Selecciona una playlist o realiza una búsqueda.</p>
      </div>
    );
  }

  if (searchResults && searchResults.length > 0) {
    return (
      <div className="text-white p-4 w-[900px] h-[400px] overflow-auto bg-[#191919] mt-2.5 rounded-[10px]">
        <h2 className="text-2xl font-bold mb-4">Resultados de búsqueda</h2>
        <ul>
          {searchResults.map((track) => (
            <li
              key={track.id}
              className="mb-3 flex items-center gap-3 cursor-pointer hover:bg-[#282828] p-2 rounded"
              onClick={() => {
                if (track.preview_url) {
                  localStorage.setItem('current_track', JSON.stringify(track));
                  window.dispatchEvent(new Event('player-update'));
                } else {
                  alert('Este track no tiene preview disponible.');
                }
              }}
            >
              <img src={track.album.images[0]?.url} alt="cover" className="w-12 h-12 rounded" />
              <div>
                <p className="font-semibold">{track.name}</p>
                <p className="text-sm text-gray-400">{track.artists.map(a => a.name).join(', ')}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="text-white p-4 w-[900px] h-[400px] overflow-auto bg-[#191919] mt-2.5 rounded-[10px]">
        <p>Cargando playlist...</p>
      </div>
    );
  }

  return (
    <div className="text-white p-4 w-[900px] h-[400px] overflow-auto bg-[#191919] mt-2.5 rounded-[10px]">
      <h2 className="text-2xl font-bold mb-4">{playlist.name}</h2>
      <ul>
        {playlist.tracks.items.map(({ track }) => (
          <li
            key={track.id}
            className="mb-3 flex items-center gap-3 cursor-pointer hover:bg-[#282828] p-2 rounded"
            onClick={() => {
              if (track.preview_url) {
                localStorage.setItem('current_track', JSON.stringify(track));
                window.dispatchEvent(new Event('player-update'));
              } else {
                alert('Este track no tiene preview disponible.');
              }
            }}
          >
            <img src={track.album.images[0]?.url} alt="cover" className="w-12 h-12 rounded" />
            <div>
              <p className="font-semibold">{track.name}</p>
              <p className="text-sm text-gray-400">{track.artists.map(a => a.name).join(', ')}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Playlist;
