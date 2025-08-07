import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Agregar from '../assets/Group 18.png';
import Buscar from '../assets/Search_S.png';


function Biblioteca() {
  const [playlists, setPlaylists] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  

  useEffect(() => {
    const token = localStorage.getItem('spotify_token');
    if (!token) return;

    fetch('https://api.spotify.com/v1/me/playlists?limit=50', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        setPlaylists(data.items || []);
        setFiltered(data.items || []);
      })
      .catch(err => console.error('Error al obtener playlists:', err));
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setQuery(value);
    const filteredList = playlists.filter(p => p.name.toLowerCase().includes(value));
    setFiltered(filteredList);
  };

  const handleClick = (id) => {
  localStorage.setItem('selected_playlist', id);
  window.location.reload(); // Forzamos recarga para que Playlist.jsx detecte el cambio
};

  return (
    <div className='bg-[#191919] w-[412px] h-[660px] rounded-[10px]'>
      <div className='flex items-center justify-between p-5'>
        <div className='flex items-center gap-2.5 p-2.5 text-white'>
          <img src={Agregar} alt="" />
          <p>Your Library</p>
        </div>
       
      </div>

      <div className='flex justify-around text-white text-sm px-2'>
        <button className='bg-[#232323] w-[75px] rounded-[10px]'>Playlists</button>
        <button className='bg-[#232323] w-[139px] rounded-[10px]'>Podcasts & Shows</button>
        <button className='bg-[#232323] w-[75px] rounded-[10px]'>Albums</button>
        <button className='bg-[#232323] w-[75px] rounded-[10px]'>Artists</button>
      </div>

      <div className='flex justify-between mt-5 mx-5 text-white items-center'>
        <div className='flex items-center gap-2 bg-[#232323] px-3 py-1 rounded'>
          <img src={Buscar} alt="" className="w-[18px] h-[18px]" />
          <input
            type="text"
            value={query}
            onChange={handleSearch}
            placeholder="Buscar en biblioteca..."
            className="bg-transparent outline-none text-sm text-white"
          />
        </div>
        
      </div>

      {/* Playlists */}
      <div className="mt-4 px-4 text-white overflow-auto h-[480px]">
        {filtered.map((playlist) => (
          <div
            key={playlist.id}
            onClick={() => handleClick(playlist.id)}
            className="flex items-center gap-1 mb-3 hover:bg-[#2a2a2a] p-2 rounded cursor-pointer transition"
          >
            <img
              src={playlist.images[0]?.url}
              alt={playlist.name}
              className="w-12 h-12 object-cover rounded"
            />
            <div>
              <p className="text-sm font-semibold">{playlist.name}</p>
              <p className="text-xs text-gray-400">{playlist.tracks.total} canciones</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Biblioteca;
