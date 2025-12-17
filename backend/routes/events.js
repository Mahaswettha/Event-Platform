const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const { protect } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Multer setup
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// Create Event
router.post('/', protect, upload.single('image'), async (req, res) => {
    const { title, description, date, location, capacity } = req.body;
    try {
        const event = new Event({
            title,
            description,
            date,
            location,
            capacity,
            image: req.file ? req.file.filename : null,
            creator: req.user._id
        });
        await event.save();
        res.status(201).json(event);
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
});

// Get All Events
router.get('/', async (req, res) => {
    try {
        const events = await Event.find().populate('creator', 'name email').sort({ date: 1 });
        res.json(events);
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
});

// Update Event
router.put('/:id', protect, upload.single('image'), async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if(!event) return res.status(404).json({ message: "Event not found" });
        if(event.creator.toString() !== req.user._id.toString()) return res.status(401).json({ message: "Not authorized" });

        const { title, description, date, location, capacity } = req.body;
        event.title = title || event.title;
        event.description = description || event.description;
        event.date = date || event.date;
        event.location = location || event.location;
        event.capacity = capacity || event.capacity;
        if(req.file) event.image = req.file.filename;

        await event.save();
        res.json(event);
    } catch(err){
        res.status(500).json({ message: err.message });
    }
});

// Delete Event
router.delete('/:id', protect, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if(!event) return res.status(404).json({ message: "Event not found" });
        if(event.creator.toString() !== req.user._id.toString()) return res.status(401).json({ message: "Not authorized" });

        await event.remove();
        res.json({ message: "Event deleted" });
    } catch(err){
        res.status(500).json({ message: err.message });
    }
});

// RSVP
router.post('/:id/rsvp', protect, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if(!event) return res.status(404).json({ message: "Event not found" });

        // Duplicate check
        if(event.attendees.includes(req.user._id)) return res.status(400).json({ message: "Already RSVPed" });

        // Capacity enforcement
        if(event.attendees.length >= event.capacity) return res.status(400).json({ message: "Event full" });

        event.attendees.push(req.user._id);
        await event.save();
        res.json({ message: "RSVP successful", event });
    } catch(err){
        res.status(500).json({ message: err.message });
    }
});

// Cancel RSVP
router.post('/:id/cancel', protect, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if(!event) return res.status(404).json({ message: "Event not found" });

        event.attendees = event.attendees.filter(u => u.toString() !== req.user._id.toString());
        await event.save();
        res.json({ message: "RSVP cancelled", event });
    } catch(err){
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
