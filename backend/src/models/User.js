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
  },
  {
    timestamps: true,
  }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

module.exports = User;
