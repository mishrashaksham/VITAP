const mongoose = require('mongoose');

const admissionSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  email:       { type: String, required: true },
  phone:       { type: String, default: '' },
  program:     { type: String, required: true },
  message:     { type: String, default: '' },
  submittedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Admission', admissionSchema);
