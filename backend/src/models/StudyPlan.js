const mongoose = require("mongoose");

const dailySubjectSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    hours: { type: Number, required: true },
    activity: { type: String, default: "Study" },
  },
  { _id: false },
);

const dailyPlanSchema = mongoose.Schema(
  {
    day: { type: String, required: true },
    subjects: [dailySubjectSchema],
  },
  { _id: false },
);

const weekPlanSchema = mongoose.Schema(
  {
    weekNumber: { type: Number, required: true },
    startDate: { type: Date },
    endDate: { type: Date },
    dailyPlans: [dailyPlanSchema],
  },
  { _id: false },
);

const studyPlanSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
      index: true,
    },
    weeks: [weekPlanSchema],
    examDate: { type: Date },
    totalWeeks: { type: Number, default: 0 },
    stream: { type: String },
    subjects: [{ type: String }],
    generatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  },
);

const StudyPlan = mongoose.model("StudyPlan", studyPlanSchema);

module.exports = StudyPlan;
