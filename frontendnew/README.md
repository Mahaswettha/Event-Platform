#Mini Event Platform – MERN Stack Full Stack  Project

---
##Overview

---
This is a Mini Event Platform built with the MERN stack(MongoDB, Express.js, React.js, Node.js).
Users can register, login, create events, view events, RSVP to events, and manage their own events.
The platform also enforces event capacity constraints and handles concurrent RSVPs to prevent overbooking.

##Features Implemented

---
###Authentication
Secure user Sign Up and Login.
JWT used for stateless authentication.
Passwords are hashed before storing in the database.

###Event Management
Create, Read, Update, Delete (CRUD) events.
Event details include:
Title
Description
Date & Time
Location
Capacity
Image Upload
Users can edit/delete only their own events.

###RSVP System

Users can RSVP to an event or cancel RSVP.
Enforces event capacity (cannot RSVP if full).
Prevents duplicate RSVPs per user per event.
Handles concurrent RSVPs safely using MongoDB atomic operations.

###Dashboard & UI

Fully responsive design for desktop, tablet, and mobile.
Displays all upcoming events.
Shows user-attended events and allows editing owned events.
Logout button to exit session.


##Technical Explanation: RSVP Capacity & Concurrency

----
The RSVP system must prevent overbooking when multiple users attempt to RSVP at the same time.
###Strategy used:

MongoDB atomic update with conditions using findOneAndUpdate.
The update checks:
Event capacity is not exceeded.
User has not already RSVPed.
If conditions are satisfied, user ID is added to the attendees array.
Otherwise, an error is returned.

##Installation & Running Locally

---
###Backend
Clone the repository:

git clone https://github.com/yourusername/mini-event-platform.git
cd mini-event-platform/backend

Install dependencies:
npm install
Create .env file in backend folder:

MONGO_URI=<Your MongoDB Atlas URI>
JWT_SECRET=<Your JWT Secret Key>
PORT=5000

Start the backend server:
npm run dev

###Frontend

Navigate to frontend folder:
cd ../frontend
Install dependencies:
npm install
Start the frontend:
npm start


Open browser at http://localhost:3000

Project Structure
backend/
  ├── models/
  ├── routes/
  ├── middleware/
  ├── server.js
frontend/
  ├── src/
      ├── api/
      ├── components/
      ├── pages/
      ├── App.js