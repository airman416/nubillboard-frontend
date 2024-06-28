import React, { useState, useEffect } from 'react';

const HomePage = () => {
    const [posters, setPosters] = useState([]);

    useEffect(() => {
        // Fetch posters from the API
        const fetchPosters = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/posters');
                const data = await response.json();
                setPosters(data);
            } catch (error) {
                console.error('Error fetching posters:', error);
            }
        };

        fetchPosters();
    }, []);

    return (
        <div className="h-screen flex flex-col">
            <div className="flex-grow overflow-auto relative bulletin-board bg-[url('https://i.pinimg.com/736x/fa/bb/b7/fabbb72b66b00f0e9c6c888b2bb9369a.jpg')] bg-cover shadow-inner rounded-lg">
                {posters.map((poster) => (
                    <div
                        key={poster.id}
                        style={{
                            position: 'absolute',
                            left: `${poster.x}px`,
                            top: `${poster.y}px`,
                            width: `${poster.width}px`,
                            height: `${poster.height}px`,
                        }}
                        className=""
                    >
                        <img
                            src={`http://localhost:3001${poster.imageUrl}`}
                            alt={poster.title}
                            className="object-cover rounded-md"
                        />
                        <span className="block text-center mt-2">{poster.title}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HomePage;
