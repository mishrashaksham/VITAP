const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  date:        { type: Date, required: true },
  category:    { type: String, required: true },
  description: { type: String, required: true },
  link:        { type: String, default: '#' },
});

module.exports = mongoose.model('Event', eventSchema);
