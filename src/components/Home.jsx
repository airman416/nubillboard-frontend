import React, { useState, useEffect } from 'react';

const Billboard = () => {
    const [posters, setPosters] = useState([]);

    useEffect(() => {
        // Fetch posters from the API
        const fetchPosters = async () => {
            try {
                const response = await fetch('/api/posters');
                const data = await response.json();
                setPosters(data);
            } catch (error) {
                console.error('Error fetching posters:', error);
            }
        };

        fetchPosters();
    }, []);

    return (
        <div className="relative w-full h-screen bg-gray-200 overflow-hidden">
            {posters.map((poster) => (
                <img
                    key={poster.id}
                    src={poster.imageUrl}
                    alt={poster.title}
                    className="absolute"
                    style={{
                        left: `${poster.x}px`,
                        top: `${poster.y}px`,
                        width: `${poster.width}px`,
                        height: `${poster.height}px`,
                    }}
                />
            ))}
        </div>
    );
};

export default Billboard;