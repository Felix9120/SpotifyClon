import React from 'react';

function PlaylistTracks({ playlist }) {
    const handleTrackClick = (track) => {
        localStorage.setItem('current_track', JSON.stringify(track));
        window.dispatchEvent(new Event('track-selected'));
    };

    return (
        <div className="text-white p-4 w-[900px] h-[400px] overflow-auto bg-[#191919] mt-2.5 rounded-[10px]">
            <h2 className="text-2xl font-bold mb-4">{playlist.name}</h2>
            <ul>
                {playlist.tracks.items.map(({ track }) => (
                    <li
                        key={track.id}
                        className="mb-3 flex items-center gap-3 cursor-pointer hover:bg-[#282828] p-2 rounded"
                        onClick={() => handleTrackClick(track)}
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

export default PlaylistTracks;