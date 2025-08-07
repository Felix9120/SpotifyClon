import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Callback() {
    const navigate = useNavigate();

    useEffect(() => {
        const code = new URLSearchParams(window.location.search).get('code');
        const codeVerifier = localStorage.getItem('spotify_code_verifier'); 

        if (!code || !codeVerifier) {
            console.error('Faltan code o code_verifier');
            navigate('/login');
            return;
        }

        const body = new URLSearchParams({
            grant_type: 'authorization_code',
            code,
            redirect_uri: import.meta.env.VITE_SPOTIFY_REDIRECT_URI,
            client_id: import.meta.env.VITE_SPOTIFY_CLIENT_ID,
            code_verifier: codeVerifier,
        });

        console.log('Enviando solicitud de token a Spotify...');
        fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: body.toString(),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log('Respuesta de Spotify:', data);

                if (data.access_token) {
                    localStorage.setItem('spotify_token', data.access_token);
                    navigate('/');
                } else {
                    console.error('No se recibió access_token:', data);
                    navigate('/login');
                }
            })
            .catch((err) => {
                console.error('Error al obtener el token:', err);
                navigate('/login');
            });
    }, [navigate]);

    return <p style={{ color: 'white' }}>Procesando autenticación segura...</p>;
}

export default Callback;


