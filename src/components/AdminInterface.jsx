import React, {useState, useEffect} from 'react';
import {Rnd} from 'react-rnd';
import axios from 'axios';
import {FaPlus, FaTimes} from 'react-icons/fa';


const AdminInterface = () => {
    const [posters, setPosters] = useState([]);
    const [authenticated, setAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [authError, setAuthError] = useState(false);

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

    const handlePasswordSubmit = async () => {
        try {
            const response = await axios.post('http://localhost:3001/api/authenticate', { password });
            if (response.data.success) {
                setAuthenticated(true);
                setAuthError(false);
            } else {
                setAuthError(true);
            }
        } catch (error) {
            setAuthError(true);
        }
    };

    const updatePoster = async (id, x, y, width, height) => {
        try {
            await axios.put(`http://localhost:3001/api/posters/${id}`, {x, y, width, height});
        } catch (error) {
            console.error('Error updating poster:', error);
        }
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append('image', file);
        formData.append('title', "TITLE");
        formData.append('x', 0);
        formData.append('y', 0);
        formData.append('width', 0.25);
        formData.append('height', 0.25);

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
            await fetch(`http://localhost:3001/api/posters/${posterId}`, {method: 'DELETE'});
            setPosters(posters.filter((poster) => poster.id !== posterId));
        } catch (error) {
            console.error('Error deleting poster:', error);
        }
    };

    const handleDragStop = (id, e, d) => {
        const newPosters = posters.map(poster =>
            poster.id === id ? {...poster, x: d.x / window.innerWidth, y: d.y / window.innerHeight} : poster
        );
        setPosters(newPosters);
        const poster = newPosters.find(poster => poster.id === id);
        updatePoster(id, poster.x, poster.y, poster.width, poster.height);
    };

    const handleResizeStop = (id, e, direction, ref, delta, position) => {
        const newPosters = posters.map(poster =>
            poster.id === id ? {
                ...poster,
                width: parseInt(ref.style.width) / window.innerWidth,
                height: parseInt(ref.style.height) / window.innerHeight,
                x: position.x / window.innerWidth,
                y: position.x / window.innerHeight
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
        <div className="flex flex-col" style={{height: '100vh'}}>
            {!authenticated ? (
                <div className="flex items-center justify-center h-full">
                    <div className="p-4 bg-white shadow rounded">
                        <h2 className="text-xl font-bold mb-4">Enter Password</h2>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="border border-gray-500 p-2 mb-4 w-full"
                        />
                        {authError && <p className="text-red-500 mb-4">Authentication failed. Please try again.</p>}
                        <button
                            onClick={handlePasswordSubmit}
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                        >
                            Submit
                        </button>
                    </div>
                </div>
            ) : (
                <div className="flex-grow overflow-hidden relative bulletin-board bg-[url('https://i.pinimg.com/736x/fa/bb/b7/fabbb72b66b00f0e9c6c888b2bb9369a.jpg')] bg-cover">
                    <input
                        type="file"
                        accept="image/jpeg"
                        name="image"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="file-upload"
                    />
                    <label htmlFor="file-upload" className="absolute top-0 right-0 m-4 cursor-pointer">
                        <FaPlus className="text-3xl text-gray-500 hover:text-gray-700" />
                    </label>
                    {posters.map((poster) => (
                        <Rnd
                            key={poster.id}
                            size={{width: poster.width * window.innerWidth, height: poster.height * window.innerHeight}}
                            position={{x: poster.x * window.innerWidth, y: poster.y * window.innerHeight}}
                            onDragStart={preventDragHandler}
                            onDragStop={(e, d) => handleDragStop(poster.id, e, d)}
                            onResizeStop={(e, direction, ref, delta, position) =>
                                handleResizeStop(poster.id, e, direction, ref, delta, position)}
                            bounds="parent"
                        >
                            <div className="relative flex items-center justify-between bg-white rounded shadow">
                                <img
                                    src={`http://localhost:3001${poster.imageUrl}`}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                    }}
                                    alt={poster.title}
                                    className="object-cover"
                                />
                                <button
                                    onClick={() => handleDelete(poster.id)}
                                    className="absolute top-0 right-0 bg-red-500 text-white m-2 p-2 rounded-full"
                                >
                                    <FaTimes className="text-lg" />
                                </button>
                            </div>
                        </Rnd>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminInterface;
