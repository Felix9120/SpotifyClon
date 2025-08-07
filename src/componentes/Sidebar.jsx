import React, { useState, useEffect } from 'react';
import Home from '../assets/Home_Fill_S.png';
import Buscar from '../assets/Search_S.png';
import Logo from '../assets/logo.png';
import { useNavigate } from 'react-router-dom';

function Sidebar() {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [suggestions, setSuggestions] = useState({ tracks: [], artists: [], albums: [] });
    const token = localStorage.getItem('spotify_token');

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && search.trim() !== '') {
            runSearch(search.trim());
        }
    };

    const runSearch = (query) => {
        localStorage.setItem('search_query', query);
        window.dispatchEvent(new Event('search-update'));
        setSearch('');
        setSuggestions({ tracks: [], artists: [], albums: [] });
    };

    const handleGoHome = () => {
        localStorage.removeItem('search_query');
        localStorage.removeItem('selected_playlist');
        window.dispatchEvent(new Event('search-update')); // 🔁 Solo usamos este evento
        navigate('/');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (search.trim() === '' || !token) {
                setSuggestions({ tracks: [], artists: [], albums: [] });
                return;
            }

            try {
                const res = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(search)}&type=track,artist,album&limit=5`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await res.json();
                setSuggestions({
                    tracks: data.tracks?.items?.slice(0, 3) || [],
                    artists: data.artists?.items?.slice(0, 2) || [],
                    albums: data.albums?.items?.slice(0, 2) || [],
                });
            } catch (err) {
                console.error('Error al obtener sugerencias:', err);
                setSuggestions({ tracks: [], artists: [], albums: [] });
            }
        };

        const debounce = setTimeout(fetchSuggestions, 300);
        return () => clearTimeout(debounce);
    }, [search, token]);

    return (
        <div className="text-white rounded-[10px] w-full flex-col justify-between p-5 bg-black relative">
            <div className='flex gap-2.5 items-center'>
                <img
                    src={Logo}
                    alt="Logo"
                    className='w-[50px] cursor-pointer'
                    onClick={handleGoHome}
                />

                <div
                    className='bg-[#191919] w-[50px] h-[50px] rounded-[10px] flex items-center justify-center cursor-pointer'
                    onClick={handleGoHome}
                >
                    <img src={Home} alt="Home" />
                </div>

                {/* Input con sugerencias */}
                <div className='relative'>
                    <div className='flex items-center gap-2 bg-[#232323] px-3 py-1 rounded-2xl'>
                        <img src={Buscar} alt="" className="w-[18px] h-[18px]" />
                        <input
                            type="text"
                            placeholder="¿Qué quieres reproducir?"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="text-white px-3 py-2 outline-none w-[360px] bg-transparent"
                        />
                        {search && (
                            <button
                                onClick={() => {
                                    setSearch('');
                                    setSuggestions({ tracks: [], artists: [], albums: [] });
                                }}
                                className="text-white hover:text-red-400 transition"
                                title="Limpiar búsqueda"
                            >
                                ❌
                            </button>
                        )}
                    </div>

                    {/* Sugerencias */}
                    {(suggestions.tracks.length > 0 ||
                        suggestions.artists.length > 0 ||
                        suggestions.albums.length > 0) && (
                            <ul className="absolute z-10 bg-[#181818] mt-1 rounded w-full shadow-lg max-h-80 overflow-y-auto border border-[#333]">
                                {suggestions.tracks.map((track) => (
                                    <li
                                        key={track.id}
                                        className="flex items-center px-3 py-2 hover:bg-[#282828] cursor-pointer"
                                        onClick={() => runSearch(track.name)}
                                    >
                                        <img
                                            src={track.album.images[0]?.url}
                                            alt={track.name}
                                            className="w-10 h-10 rounded mr-3"
                                        />
                                        <div>
                                            <p className="text-sm font-medium">{track.name}</p>
                                            <p className="text-xs text-gray-400">{track.artists.map(a => a.name).join(', ')}</p>
                                        </div>
                                    </li>
                                ))}

                                {suggestions.artists.map((artist) => (
                                    <li
                                        key={artist.id}
                                        className="flex items-center px-3 py-2 hover:bg-[#282828] cursor-pointer"
                                        onClick={() => runSearch(artist.name)}
                                    >
                                        <img
                                            src={artist.images[0]?.url || 'https://via.placeholder.com/40'}
                                            alt={artist.name}
                                            className="w-10 h-10 rounded-full mr-3"
                                        />
                                        <div>
                                            <p className="text-sm font-medium">{artist.name}</p>
                                            <p className="text-xs text-gray-400">Artista</p>
                                        </div>
                                    </li>
                                ))}

                                {suggestions.albums.map((album) => (
                                    <li
                                        key={album.id}
                                        className="flex items-center px-3 py-2 hover:bg-[#282828] cursor-pointer"
                                        onClick={() => runSearch(album.name)}
                                    >
                                        <img
                                            src={album.images[0]?.url}
                                            alt={album.name}
                                            className="w-10 h-10 rounded mr-3"
                                        />
                                        <div>
                                            <p className="text-sm font-medium">{album.name}</p>
                                            <p className="text-xs text-gray-400">Álbum de {album.artists.map(a => a.name).join(', ')}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                </div>
            </div>
        </div>
    );
}

export default Sidebar;
