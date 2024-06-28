import React, { useState, useEffect } from 'react';
import { Rnd } from 'react-rnd';
import axios from 'axios';

const AdminInterface = () => {
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

    const updatePoster = async (id, x, y, width, height) => {
        try {
            await axios.put(`http://localhost:3001/api/posters/${id}`, { x, y, width, height });
        } catch (error) {
            console.error('Error updating poster:', error);
        }
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append('image', file);
        formData.append('title', "TITLE");
        formData.append('x', 50);
        formData.append('y', 50);
        formData.append('width', 100);
        formData.append('height', 100);

        try {
            const response = await axios.post("http://localhost:3001/api/posters", formData);
            const newPoster = response.data;
            setPosters([...posters, newPoster]);
        } catch (error) {
            console.error('Error uploading poster:', error);
        }
    };

    const handleDelete = async (posterId) => {
        try {
            await fetch(`http://localhost:3001/api/posters/${posterId}`, { method: 'DELETE' });
            setPosters(posters.filter((poster) => poster.id !== posterId));
        } catch (error) {
            console.error('Error deleting poster:', error);
        }
    };

    const handleDragStop = (id, e, d) => {
        const newPosters = posters.map(poster =>
            poster.id === id ? { ...poster, x: d.x, y: d.y } : poster
        );
        setPosters(newPosters);
        const poster = newPosters.find(poster => poster.id === id);
        updatePoster(id, poster.x, poster.y, poster.width, poster.height);
    };

    const handleResizeStop = (id, e, direction, ref, delta, position) => {
        const newPosters = posters.map(poster =>
            poster.id === id ? {
                ...poster,
                width: parseInt(ref.style.width),
                height: parseInt(ref.style.height),
                x: position.x,
                y: position.y
            } : poster
        );
        setPosters(newPosters);
        const poster = newPosters.find(poster => poster.id === id);
        updatePoster(id, poster.x, poster.y, poster.width, poster.height);
    };

    function preventDragHandler(e) {
        e.preventDefault();
    }

    return (
        <div className="p-4 h-screen flex flex-col">
            <div className="mb-4">
                <h1 className="text-2xl font-bold mb-4">Admin Interface</h1>
                <input
                    type="file"
                    accept="image/jpeg"
                    name="image"
                    onChange={handleFileUpload}
                    className="mb-4"
                />
            </div>
            <div className="flex-grow overflow-auto relative" style={{height: '100vh'}}>
                {posters.map((poster) => (
                    <Rnd
                        key={poster.id}
                        size={{ width: poster.width, height: poster.height }}
                        position={{ x: poster.x, y: poster.y }}
                        onDragStart={preventDragHandler}
                        onDragStop={(e, d) => handleDragStop(poster.id, e, d)}
                        onResizeStop={(e, direction, ref, delta, position) =>
                            handleResizeStop(poster.id, e, direction, ref, delta, position)}
                        bounds="parent"
                    >
                        <div
                            className="flex items-center justify-between bg-white p-2 mb-2 rounded shadow"
                        >
                            <img
                                src={`http://localhost:3001${poster.imageUrl}`}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                }}
                                alt={poster.title}
                                className="object-cover"
                            />
                            <span>{poster.title}</span>
                            <button
                                onClick={() => handleDelete(poster.id)}
                                className="bg-red-500 text-white px-2 py-1 rounded"
                            >
                                Delete
                            </button>
                        </div>
                    </Rnd>
                ))}
            </div>
        </div>
    );
};

export default AdminInterface;
