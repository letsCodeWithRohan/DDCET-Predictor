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
    enum: ['SFI', 'GIA'], // Add other types if any
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
  firstAdmittedDDCETMarks: {
    type: Number,
    required: true
  },
  firstAdmittedDDCETRank: {
    type: Number,
    required: true
  },
  lastAdmittedDDCETMarks: {
    type: Number,
    required: true
  },
  lastAdmittedDDCETRank: {
    type: Number,
    required: true
  }
}, { collection: 'merits' });

module.exports = mongoose.model('Merit', meritSchema);