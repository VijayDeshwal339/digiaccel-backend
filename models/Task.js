const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  date: {
    type: Date,
    required: true,
  },
  startTime: {
   type: String,
    required: true,
  },
  endTime: {
   type: String,
    required: true,
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Low',
  },
  status: {
    type: String,
    enum: ['true', 'false'],
    default: 'false',
  },
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
