import React, { useEffect, useState } from 'react';
import API from '../api/api';
import Navbar from '../components/Navbar';
import { Link, useNavigate } from 'react-router-dom';

const Dashboard = ({ setIsAuth }) => {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const fetchEvents = async () => {
    try {
      const res = await API.get('/events');
      setEvents(res.data);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to fetch events');
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleRSVP = async (id) => {
    try {
      await API.post(`/events/${id}/rsvp`);
      fetchEvents();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to RSVP');
    }
  };

  const handleCancel = async (id) => {
    try {
      await API.post(`/events/${id}/cancel`);
      fetchEvents();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel RSVP');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuth(false);
    navigate('/login');
  };

  return (
    <div>
      <Navbar />
      <div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: '800px', margin: '20px auto' }}>
        <h2>Upcoming Events</h2>
        <button 
    onClick={handleLogout} 
    style={{ 
      padding: '10px 2px', 
      fontSize: '12px', 
      height: 'fit-content', 
      backgroundColor: '#11103cff', 
      color: '#fff', 
      border: 'none', 
      borderRadius: '3px', 
      cursor: 'pointer' 
    }}
  >
    Logout
  </button>
      </div>

      <div style={{ maxWidth: '800px', margin: 'auto' }}>
        {events.length === 0 && <p>No events found.</p>}
        {events.map(event => (
          <div className="event-card" key={event._id}>
            <h3>{event.title}</h3>
            <p>{event.description}</p>
            <p>Date: {new Date(event.date).toLocaleString()}</p>
            <p>Location: {event.location}</p>
            <p>Capacity: {event.attendees.length} / {event.capacity}</p>
            {event.image && <img src={`http://localhost:5000/uploads/${event.image}`} alt="" />}
            <div className="event-actions" style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
              {event.attendees.includes(user.id) ? (
                <button onClick={() => handleCancel(event._id)}>Cancel RSVP</button>
              ) : (
                event.attendees.length < event.capacity && <button onClick={() => handleRSVP(event._id)}>RSVP</button>
              )}
              {event.creator._id === user.id && (
                <Link to={`/edit/${event._id}`}>Edit</Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
