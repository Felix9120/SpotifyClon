// src/componentes/RecommendedArtists.jsx
import React, { useEffect, useState } from "react";

function RecommendedArtists() {
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("spotify_token");
    if (!token) return;

    fetch("https://api.spotify.com/v1/me/top/artists?limit=10", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.items) setArtists(data.items);
      })
      .catch((err) => console.error("Error al obtener artistas:", err));
  }, []);

  // ✅ LÓGICA AÑADIDA (sin tocar estilos)
  const handleArtistClick = (artistId) => {
    localStorage.setItem("selected_artist", artistId);
    localStorage.removeItem("selected_playlist"); // opcional: limpiar selección de playlist
    window.dispatchEvent(new CustomEvent("artist-selected", { detail: { artistId } }));
  };

  return (
    <div className="text-white p-4">
      <h2 className="text-xl font-semibold mb-3">🎵 Tus artistas más escuchados</h2>

      {/* Scroll horizontal (sin cambios) */}
      <div className="flex gap-4 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent pb-2">
        {artists.map((artist) => (
          <button
            key={artist.id}
            onClick={() => handleArtistClick(artist.id)}
            className="flex-shrink-0 w-28 flex flex-col items-center focus:outline-none hover:scale-105 transition"
          >
            <img
              src={artist.images?.[0]?.url}
              alt={artist.name}
              className="w-24 h-24 rounded-full object-cover shadow-md"
            />
            <p className="mt-2 text-sm text-center truncate w-full">{artist.name}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

export default RecommendedArtists;
