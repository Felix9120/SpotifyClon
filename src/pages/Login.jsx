import React from 'react';
import { generateCodeVerifier, generateCodeChallenge } from '../utils/pkce';

function Login() {
    const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
    const redirectUri = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;
    const scopes = import.meta.env.VITE_SPOTIFY_SCOPES;

    const handleLogin = async () => {
        const codeVerifier = generateCodeVerifier();
        const codeChallenge = await generateCodeChallenge(codeVerifier);

        localStorage.setItem('spotify_code_verifier', codeVerifier); // ✅ clave corregida

        const authUrl = `https://accounts.spotify.com/authorize?` +
            `response_type=code&client_id=${clientId}` +
            `&scope=${encodeURIComponent(scopes)}` +
            `&redirect_uri=${encodeURIComponent(redirectUri)}` +
            `&code_challenge_method=S256&code_challenge=${codeChallenge}`;

        window.location.href = authUrl;
    };

    return (
        <div style={{ background: 'black', color: 'white', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <h1>Clon de Spotify</h1>
            <button
                onClick={handleLogin}
                style={{ padding: '10px 20px', fontSize: '16px', backgroundColor: '#1DB954', border: 'none', borderRadius: '4px', color: 'white' }}
            >
                Iniciar sesión con Spotify
            </button>
        </div>
    );
}

export default Login;
