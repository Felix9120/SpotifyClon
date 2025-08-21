import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Callback from './pages/Callback';
import Inicio from './pages/Inicio';
import Playlibrary from './pages/Playlibrary';

function App() {

 
  const [token, setToken] = useState(localStorage.getItem('spotify_token'));

  // Escucha cuando el token cambia (útil si se guarda desde otra pestaña)
  useEffect(() => {
    const handleStorage = () => {
      setToken(localStorage.getItem('spotify_token'));
    };

    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('storage', handleStorage);
    };


  }, []);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/callback" element={<Callback setToken={setToken} />} />     
      <Route path="/" element={token ? <Inicio /> : <Navigate to="/login" />} />
      <Route path="/playlist/:playlistId" element={<Playlibrary />} />
      
    </Routes>
  );
}

export default App;
