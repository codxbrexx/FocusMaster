const mongoose = require('mongoose');

const sessionSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
    },
    type: {
      type: String,
      enum: ['focus', 'shortBreak', 'longBreak'],
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
    },
    duration: {
      type: Number, // in sec
      required: true,
    },
    mood: {
      type: String,
      enum: ['happy', 'neutral', 'sad', 'focused', 'distracted'],
    },
    completed: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Session = mongoose.model('Session', sessionSchema);

module.exports = Session;
