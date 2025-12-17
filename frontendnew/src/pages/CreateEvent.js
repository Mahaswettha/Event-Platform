import React, { useState } from 'react';
import API from '../api/api';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

const CreateEvent = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [capacity, setCapacity] = useState('');
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('date', date);
    formData.append('location', location);
    formData.append('capacity', capacity);
    if(image) formData.append('image', image);

    try {
      await API.post('/events', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      navigate('/');
    } catch(err) {
      alert(err.response?.data?.message || 'Failed to create event');
    }
  };

  return (
    <div>
      <Navbar />
      <h2>Create Event</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required/>
        <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)}></textarea>
        <input type="datetime-local" value={date} onChange={e => setDate(e.target.value)} required/>
        <input type="text" placeholder="Location" value={location} onChange={e => setLocation(e.target.value)} />
        <input type="number" placeholder="Capacity" value={capacity} onChange={e => setCapacity(e.target.value)} required/>
        <input type="file" onChange={e => setImage(e.target.files[0])} />
        <br /><br />
        <button type="submit">Create Event</button>
      </form>
    </div>
  );
};

export default CreateEvent;
