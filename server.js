const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DB_PATH = path.join(__dirname, 'data', 'db.json');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

function readDB() {
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
}
function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

app.post('/api/contact', (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !message) return res.status(400).json({ success: false, error: 'Name, email, and message are required.' });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ success: false, error: 'Invalid email.' });
  const db = readDB();
  db.contacts.push({ id: Date.now(), name, email, subject: subject || 'General', message, submittedAt: new Date().toISOString() });
  writeDB(db);
  res.json({ success: true, message: 'Thank you! We will get back to you soon.' });
});

app.post('/api/admissions/inquiry', (req, res) => {
  const { name, email, phone, program, message } = req.body;
  if (!name || !email || !program) return res.status(400).json({ success: false, error: 'Name, email, and program are required.' });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ success: false, error: 'Invalid email.' });
  const db = readDB();
  db.admissions.push({ id: Date.now(), name, email, phone: phone || '', program, message: message || '', submittedAt: new Date().toISOString() });
  writeDB(db);
  res.json({ success: true, message: 'Inquiry submitted! Our admissions team will contact you shortly.' });
});

app.post('/api/newsletter', (req, res) => {
  const { email } = req.body;
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ success: false, error: 'Valid email is required.' });
  const db = readDB();
  if (db.newsletter.find(s => s.email === email)) return res.json({ success: true, message: 'Already subscribed!' });
  db.newsletter.push({ email, subscribedAt: new Date().toISOString() });
  writeDB(db);
  res.json({ success: true, message: 'Successfully subscribed to our newsletter!' });
});

app.get('/api/events', (req, res) => {
  res.json({ success: true, events: readDB().events });
});

app.get('/api/stats', (req, res) => {
  res.json({ success: true, stats: { students: 15000, faculty: 1000, programs: 200, placements: 95, research_papers: 8500, patents: 350, campus_acres: 150, countries: 45 } });
});

app.listen(PORT, () => {
  console.log(`\n  VIT-AP University Server running at http://localhost:${PORT}\n`);
});
