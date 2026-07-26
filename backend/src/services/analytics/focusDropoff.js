const Session = require("../../models/Session");

/**
 * Analyzes the user's session history to find their personal optimal focus duration.
 * It groups completed focus sessions by duration and calculates the completion rate 
 * to suggest ideal focus and break durations.
 *
 * @param {string} userId - Mongoose ObjectId string
 * @returns {Promise<Object>} Adaptive timer suggestion object
 */
async function analyzeFocusDropoff(userId) {
  // Fetch recent focus sessions
  const sessions = await Session.find({
    user: userId,
    type: "focus",
  }).sort({ startTime: -1 }).limit(100).lean();

  if (sessions.length < 10) {
    return {
      hasEnoughData: false,
      message: "Not enough data yet for adaptive suggestions.",
    };
  }

  // Group by duration buckets (e.g., 25, 30, 35, 40, etc.)
  const durationBuckets = {};

  sessions.forEach((s) => {
    // If the session has a targeted duration, we could use that.
    // If we only have actual duration and completed flag, we'll try to guess the intended duration 
    // from actual duration if it's completed, but normally we'd need intended duration.
    // Assuming `duration` is the intended duration in seconds and `completed` indicates if they made it.
    
    // Convert duration to minutes and round to nearest 5
    const durationMin = Math.round(s.duration / 60 / 5) * 5;
    
    // Ignore unusually short or long sessions (< 10 min or > 120 min)
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
  }).filter(dp => dp.total >= 3); // Only consider buckets with at least 3 sessions

  if (dataPoints.length === 0) {
    return {
      hasEnoughData: false,
      message: "Not enough grouped data for reliable adaptive suggestions.",
    };
  }

  // Find the highest duration that has a completion rate > 75%
  dataPoints.sort((a, b) => b.duration - a.duration);
  
  let suggestedFocusDuration = 25; // Default fallback
  
  for (const dp of dataPoints) {
    if (dp.completionRate >= 0.75) {
      suggestedFocusDuration = dp.duration;
      break;
    }
  }
  
  // If no duration had > 75% completion, find the highest completion rate
  if (suggestedFocusDuration === 25) {
    dataPoints.sort((a, b) => b.completionRate - a.completionRate);
    if (dataPoints.length > 0 && dataPoints[0].completionRate > 0) {
      suggestedFocusDuration = dataPoints[0].duration;
    }
  }
  
  // Calculate recommended breaks based on focus duration
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
