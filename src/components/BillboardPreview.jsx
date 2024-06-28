import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Poster = ({ poster, isSelected, onClick }) => (
    <div
        className={`absolute cursor-pointer transition-all duration-300 ${isSelected ? 'ring-4 ring-blue-500' : ''}`}
        style={{
            left: `${poster.x}px`,
            top: `${poster.y}px`,
            width: `${poster.width}px`,
            height: `${poster.height}px`,
        }}
        onClick={() => onClick(poster.id)}
    >
        <img
            src={`http://localhost:3001${poster.imageUrl}`}
            style={{
                left: `${poster.x}px`,
                top: `${poster.y}px`,
                width: `${poster.width}px`,
                height: `${poster.height}px`,
            }}
            alt={poster.title}
            className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2">
            {poster.title}
        </div>
    </div>
);

const BillboardPreview = () => {
    const [posters, setPosters] = useState([]);
    const [selectedPosterId, setSelectedPosterId] = useState(null);

    useEffect(() => {
        fetchPosters();
    }, []);

    const fetchPosters = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/posters');
            setPosters(response.data);
        } catch (error) {
            console.error('Error fetching posters:', error);
        }
    };

    const handlePosterClick = (id) => {
        setSelectedPosterId(id === selectedPosterId ? null : id);
    };

    const handleMove = async (direction) => {
        if (selectedPosterId) {
            const poster = posters.find(p => p.id === selectedPosterId);
            let newX = poster.x;
            let newY = poster.y;

            switch (direction) {
                case 'up': newY = Math.max(0, poster.y - 10); break;
                case 'down': newY = poster.y + 10; break;
                case 'left': newX = Math.max(0, poster.x - 10); break;
                case 'right': newX = poster.x + 10; break;
                default: break;
            }

            try {
                await axios.put(`http://localhost:3001/api/posters/${selectedPosterId}`, { x: newX, y: newY });
                setPosters(posters.map(p => p.id === selectedPosterId ? { ...p, x: newX, y: newY } : p));
            } catch (error) {
                console.error('Error updating poster position:', error);
            }
        }
    };

    return (
        <div className="flex flex-col items-center">
            <div className="relative w-[800px] h-[600px] bg-gray-200 overflow-hidden mb-4">
                {posters.map((poster) => (
                    <Poster
                        key={poster.id}
                        poster={poster}
                        isSelected={poster.id === selectedPosterId}
                        onClick={handlePosterClick}
                    />
                ))}
            </div>
            <div className="flex space-x-2">
                <button onClick={() => handleMove('up')} className="px-4 py-2 bg-blue-500 text-white rounded">Move Up</button>
                <button onClick={() => handleMove('down')} className="px-4 py-2 bg-blue-500 text-white rounded">Move Down</button>
                <button onClick={() => handleMove('left')} className="px-4 py-2 bg-blue-500 text-white rounded">Move Left</button>
                <button onClick={() => handleMove('right')} className="px-4 py-2 bg-blue-500 text-white rounded">Move Right</button>
            </div>
        </div>
    );
};

export default BillboardPreview;