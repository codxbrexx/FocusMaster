const Session = require("../../models/Session");
const User = require("../../models/User");

/**
 * Analyzes the user's session history to find their personal optimal focus duration.
 * Provides subject & stream-aware recommendations when session data is accumulating.
 *
 * @param {string} userId - Mongoose ObjectId string
 * @returns {Promise<Object>} Adaptive timer suggestion object
 */
async function analyzeFocusDropoff(userId) {
  // Fetch user profile for subject/stream context
  const user = await User.findById(userId).select("studyProfile").lean();
  const profile = user?.studyProfile || {};
  const stream = (profile.stream || "").toLowerCase();

  // Fetch recent focus sessions
  const sessions = await Session.find({
    user: userId,
    type: "focus",
  }).sort({ startTime: -1 }).limit(100).lean();

  if (sessions.length < 5) {
    // Smart default recommendations based on stream/subjects
    let defaultDuration = 25;
    let shortBreak = 5;
    let longBreak = 15;
    let reason = "Initial recommendation based on your target stream.";

    if (stream.includes("engineering") || stream.includes("jee") || stream.includes("gate")) {
      defaultDuration = 45;
      shortBreak = 8;
      longBreak = 20;
      reason = "Recommended 45-min deep work block optimized for numerical problem-solving.";
    } else if (stream.includes("medical") || stream.includes("neet")) {
      defaultDuration = 30;
      shortBreak = 5;
      longBreak = 15;
      reason = "Recommended 30-min active-recall block optimized for high-yield biology review.";
    } else if (stream.includes("upsc") || stream.includes("ca")) {
      defaultDuration = 50;
      shortBreak = 10;
      longBreak = 25;
      reason = "Recommended 50-min stamina block for long-form case studies & answer writing.";
    }

    return {
      hasEnoughData: false,
      message: "Build more focus sessions to refine recommendations. " + reason,
      suggestedFocusDuration: defaultDuration,
      suggestedShortBreak: shortBreak,
      suggestedLongBreak: longBreak,
      confidence: "low",
    };
  }

  // Group by duration buckets (nearest 5 minutes)
  const durationBuckets = {};

  sessions.forEach((s) => {
    const durationMin = Math.round(s.duration / 60 / 5) * 5;
    if (durationMin < 10 || durationMin > 120) return;

    if (!durationBuckets[durationMin]) {
      durationBuckets[durationMin] = { total: 0, completed: 0 };
    }
    
    durationBuckets[durationMin].total += 1;
    if (s.completed) {
      durationBuckets[durationMin].completed += 1;
    }
  });

  const dataPoints = Object.keys(durationBuckets).map((d) => {
    const bucket = durationBuckets[d];
    return {
      duration: parseInt(d, 10),
      total: bucket.total,
      completed: bucket.completed,
      completionRate: bucket.total > 0 ? bucket.completed / bucket.total : 0,
    };
  }).filter(dp => dp.total >= 2);

  if (dataPoints.length === 0) {
    return {
      hasEnoughData: false,
      message: "Collecting session metrics...",
      suggestedFocusDuration: 30,
      suggestedShortBreak: 5,
      suggestedLongBreak: 15,
      confidence: "low",
    };
  }

  // Find optimal duration with completion rate > 75%
  dataPoints.sort((a, b) => b.duration - a.duration);
  let suggestedFocusDuration = 30;
  
  for (const dp of dataPoints) {
    if (dp.completionRate >= 0.75) {
      suggestedFocusDuration = dp.duration;
      break;
    }
  }
  
  if (suggestedFocusDuration === 30) {
    dataPoints.sort((a, b) => b.completionRate - a.completionRate);
    if (dataPoints.length > 0 && dataPoints[0].completionRate > 0) {
      suggestedFocusDuration = dataPoints[0].duration;
    }
  }
  
  const suggestedShortBreak = suggestedFocusDuration <= 30 ? 5 : 10;
  const suggestedLongBreak = suggestedFocusDuration <= 30 ? 15 : 20;

  return {
    hasEnoughData: true,
    suggestedFocusDuration,
    suggestedShortBreak,
    suggestedLongBreak,
    confidence: dataPoints.length > 3 ? "high" : "medium",
    dataPoints,
  };
}

module.exports = { analyzeFocusDropoff };
