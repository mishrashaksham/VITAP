require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

// Models
const Contact    = require('./models/Contact');
const Admission  = require('./models/Admission');
const Newsletter = require('./models/Newsletter');
const Event      = require('./models/Event');

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// ── MongoDB Connection ──
const MONGO_URI = process.env.MONGO_URI;

if (MONGO_URI) {
  mongoose.connect(MONGO_URI)
    .then(async () => {
      console.log('  ✅ Connected to MongoDB');
      await seedEvents();
    })
    .catch(err => console.error('  ❌ MongoDB connection error:', err.message));
} else {
  console.warn('  ⚠️  MONGO_URI not set — API routes will return errors. Static frontend still works.');
}

// Seed default events if collection is empty
async function seedEvents() {
  const count = await Event.countDocuments();
  if (count === 0) {
    await Event.insertMany([
      { title: 'VITEEE 2026 Registration Open', date: '2026-05-15', category: 'Admissions', description: 'Register now for VIT Engineering Entrance Examination 2026. Last date to apply is May 15, 2026.' },
      { title: 'International Conference on AI & ML', date: '2026-06-10', category: 'Conference', description: '3-day international conference on Artificial Intelligence and Machine Learning applications.' },
      { title: 'Gravitas 2026 — Technical Festival', date: '2026-09-20', category: 'Festival', description: 'Annual technical festival featuring hackathons, workshops, guest lectures, and competitions.' },
      { title: 'Campus Placement Drive — TCS & Infosys', date: '2026-07-05', category: 'Placements', description: 'On-campus recruitment drive by top IT companies. Pre-register on VTOP portal.' },
      { title: 'Research Symposium 2026', date: '2026-08-18', category: 'Research', description: 'Annual research symposium showcasing PhD and faculty research across all schools.' },
    ]);
    console.log('  📦 Seeded default events');
  }
}

// ── Middleware: check DB connection ──
function requireDB(req, res, next) {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ success: false, error: 'Database not connected. Set MONGO_URI in .env' });
  }
  next();
}

// ── API Routes ──

app.post('/api/contact', requireDB, async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) return res.status(400).json({ success: false, error: 'Name, email, and message are required.' });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ success: false, error: 'Invalid email.' });
    await Contact.create({ name, email, subject: subject || 'General', message });
    res.json({ success: true, message: 'Thank you! We will get back to you soon.' });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error.' });
  }
});

app.post('/api/admissions/inquiry', requireDB, async (req, res) => {
  try {
    const { name, email, phone, program, message } = req.body;
    if (!name || !email || !program) return res.status(400).json({ success: false, error: 'Name, email, and program are required.' });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ success: false, error: 'Invalid email.' });
    await Admission.create({ name, email, phone: phone || '', program, message: message || '' });
    res.json({ success: true, message: 'Inquiry submitted! Our admissions team will contact you shortly.' });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error.' });
  }
});

app.post('/api/newsletter', requireDB, async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ success: false, error: 'Valid email is required.' });
    const exists = await Newsletter.findOne({ email });
    if (exists) return res.json({ success: true, message: 'Already subscribed!' });
    await Newsletter.create({ email });
    res.json({ success: true, message: 'Successfully subscribed to our newsletter!' });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error.' });
  }
});

app.get('/api/events', requireDB, async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json({ success: true, events });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error.' });
  }
});

app.get('/api/stats', (req, res) => {
  res.json({ success: true, stats: { students: 15000, faculty: 1000, programs: 200, placements: 95, research_papers: 8500, patents: 350, campus_acres: 150, countries: 45 } });
});

app.listen(PORT, () => {
  console.log(`\n  VIT-AP University Server running at http://localhost:${PORT}\n`);
});
