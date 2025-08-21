// src/componentes/Playlist.jsx
import React, { useEffect, useState } from 'react';

function Playlist() {
  const [playlist, setPlaylist] = useState(null);
  const [artistTracks, setArtistTracks] = useState(null);

  // Cargar playlist seleccionada
  const loadPlaylist = () => {
    const token = localStorage.getItem("spotify_token");
    const playlistId = localStorage.getItem("selected_playlist");
    if (!token || !playlistId) return;

    fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        if (data) {
          setArtistTracks(null); // limpiamos si había artista
          setPlaylist(data);
        }
      })
      .catch(err => console.error("Error al obtener playlist:", err));
  };

  // Cargar canciones de un artista
  const loadArtist = (artistId) => {
    const token = localStorage.getItem("spotify_token");
    if (!token || !artistId) return;

    fetch(`https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=US`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        if (data.tracks) {
          setPlaylist(null); // limpiamos playlist
          setArtistTracks(data.tracks);
        }
      })
      .catch(err => console.error("Error al obtener tracks del artista:", err));
  };

  // Escuchar eventos
  useEffect(() => {
    loadPlaylist();

    // playlist desde Biblioteca
    window.addEventListener("search-update", loadPlaylist);

    // artista desde RecommendedArtists
    const handleArtistSelect = (e) => {
      loadArtist(e.detail.artistId);
    };
    window.addEventListener("artist-selected", handleArtistSelect);

    return () => {
      window.removeEventListener("search-update", loadPlaylist);
      window.removeEventListener("artist-selected", handleArtistSelect);
    };
  }, []);

  if (!playlist && !artistTracks) {
    return (
      <div className="bg-[#191919] flex-1 rounded-[10px] text-white p-5">
        <p className="text-gray-400">Selecciona una playlist o un artista</p>
      </div>
    );
  }

  return (
    <div className="bg-[#191919] flex-1 rounded-[10px] text-white p-5 overflow-y-auto">
      {/* Mostrar Playlist */}
      {playlist && (
        <>
          <div className="flex items-center gap-4 mb-5">
            <img
              src={playlist.images[0]?.url || "https://via.placeholder.com/150"}
              alt={playlist.name}
              className="w-32 h-32 object-cover rounded"
            />
            <div>
              <p className="uppercase text-xs text-gray-400">Playlist</p>
              <h2 className="text-2xl font-bold">{playlist.name}</h2>
              <p className="text-sm text-gray-400">
                {playlist.tracks?.total || 0} canciones
              </p>
            </div>
          </div>

          <div>
            {playlist.tracks.items.map((item, index) => {
              const track = item.track;
              if (!track) return null;
              return (
                <div
                  key={track.id || index}
                  className="flex items-center gap-3 mb-2 hover:bg-[#2a2a2a] p-2 rounded cursor-pointer"
                >
                  <img
                    src={track.album.images[0]?.url || "https://via.placeholder.com/50"}
                    alt={track.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div>
                    <p className="text-sm font-semibold">{track.name}</p>
                    <p className="text-xs text-gray-400">
                      {track.artists.map(a => a.name).join(", ")}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Mostrar canciones de artista */}
      {artistTracks && (
        <>
          <div className="flex items-center gap-4 mb-5">
            <div>
              <p className="uppercase text-xs text-gray-400">Artista</p>
              <h2 className="text-2xl font-bold">Canciones populares</h2>
            </div>
          </div>

          <div>
            {artistTracks.map((track, index) => (
              <div
                key={track.id || index}
                className="flex items-center gap-3 mb-2 hover:bg-[#2a2a2a] p-2 rounded cursor-pointer"
              >
                <img
                  src={track.album.images[0]?.url || "https://via.placeholder.com/50"}
                  alt={track.name}
                  className="w-12 h-12 object-cover rounded"
                />
                <div>
                  <p className="text-sm font-semibold">{track.name}</p>
                  <p className="text-xs text-gray-400">
                    {track.artists.map(a => a.name).join(", ")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Playlist;
