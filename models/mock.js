const mongoose = require('mongoose');

const meritSchema = new mongoose.Schema({
  srNo: {
    type: Number,
    required: true,
    unique: true
  },
  nameOfInstitute: {
    type: String,
    required: true
  },
  instituteType: {
    type: String,
    enum: ['SFI', 'GIA', 'GOV'], // Add other types if any
    required: true
  },
  branch: {
    type: String,
    required: true
  },
  quota: {
    type: String,
    required: true
  },
  admissionCategory: {
    type: String,
    required: true
  },
  opening: {
    type: Number,
    required: true
  },
  closing: {
    type: Number,
    required: true
  }
}, { collection: 'mocks' });

module.exports = mongoose.model('Mock', meritSchema);