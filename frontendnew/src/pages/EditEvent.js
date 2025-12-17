import React, { useEffect, useState } from 'react';
import API from '../api/api';
import Navbar from '../components/Navbar';
import { useNavigate, useParams } from 'react-router-dom';

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [capacity, setCapacity] = useState('');
  const [image, setImage] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await API.get('/events');
        const event = res.data.find(ev => ev._id === id);
        if (event) {
          setTitle(event.title);
          setDescription(event.description);
          setDate(new Date(event.date).toISOString().slice(0,16));
          setLocation(event.location);
          setCapacity(event.capacity);
        }
      } catch(err) {
        alert('Failed to load event');
      }
    };
    fetchEvent();
  }, [id]);

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
      await API.put(`/events/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      navigate('/');
    } catch(err) {
      alert(err.response?.data?.message || 'Failed to update event');
    }
  };

  return (
    <div>
      <Navbar />
      <h2>Edit Event</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required/>
        <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)}></textarea>
        <input type="datetime-local" value={date} onChange={e => setDate(e.target.value)} required/>
        <input type="text" placeholder="Location" value={location} onChange={e => setLocation(e.target.value)} />
        <input type="number" placeholder="Capacity" value={capacity} onChange={e => setCapacity(e.target.value)} required/>
        <input type="file" onChange={e => setImage(e.target.files[0])} />
        <button type="submit">Update Event</button>
      </form>
    </div>
  );
};

export default EditEvent;
