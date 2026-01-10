const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    picture: {
      type: String,
      default: 'https://github.com/shadcn.png'
    },
    password: {
      type: String,
      required: true,
    },
    settings: {
      theme: { type: String, default: 'light' },
      autoStartSession: { type: Boolean, default: false },
      autoStartBreak: { type: Boolean, default: false },
      motivationalQuotes: { type: Boolean, default: true },
      focusDuration: { type: Number, default: 25 },
      shortBreakDuration: { type: Number, default: 5 },
      longBreakDuration: { type: Number, default: 15 },
      dailyGoal: { type: Number, default: 8 },
      soundEnabled: { type: Boolean, default: true },
      strictMode: { type: Boolean, default: false },
    },
    points: {
      type: Number,
      default: 0
    },
    badges: [{ type: String }],
    isGuest: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
      required: true
    },
    status: {
      type: String,
      enum: ['active', 'banned', 'suspended'],
      default: 'active',
      index: true
    },
    banReason: {
      type: String,
      select: false // Do not return by default
    },
    emailOTP: {
      type: String,
      select: false
    },
    emailOTPExpires: {
      type: Date,
      select: false
    },
    newEmail: {
      type: String,
      select: false
    }
  },
  {
    timestamps: true,
  }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

module.exports = User;
