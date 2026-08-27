const User = require("../models/User");

/**
 * Calculate user level based on total XP
 * Formula: Level = floor(0.5 + sqrt(1 + 8 * totalXP / 100) / 2)
 */
function calculateLevel(totalXP) {
  if (totalXP <= 0) return 1;
  const level = Math.floor(0.5 + Math.sqrt(1 + (8 * totalXP) / 100) / 2);
  return Math.max(1, level);
}

/**
 * Award XP to a user and check for level upgrades and badges
 */
async function awardXP(userId, amount, reason = "focus_session") {
  const user = await User.findById(userId);
  if (!user) return null;

  if (!user.xp) {
    user.xp = { total: 0, weekly: 0, monthly: 0, level: 1 };
  }

  user.xp.total += amount;
  user.xp.weekly += amount;
  user.xp.monthly += amount;
  user.points += amount;

  const newLevel = calculateLevel(user.xp.total);
  const leveledUp = newLevel > user.xp.level;
  user.xp.level = newLevel;

  // Streak logic
  const now = new Date();
  const todayStr = now.toISOString().split("T")[0];
  const lastFocusStr = user.lastFocusDate
    ? new Date(user.lastFocusDate).toISOString().split("T")[0]
    : null;

  if (lastFocusStr !== todayStr) {
    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    if (lastFocusStr === yesterdayStr) {
      user.currentStreak += 1;
    } else if (!lastFocusStr) {
      user.currentStreak = 1;
    } else {
      // Streak broken, check shield
      if (user.streakShield && user.streakShield.active && user.streakShield.expiresAt > now) {
        user.streakShield.active = false; // consume shield
      } else {
        user.currentStreak = 1;
      }
    }

    user.lastFocusDate = now;
    if (user.currentStreak > user.longestStreak) {
      user.longestStreak = user.currentStreak;
    }
  }

  // Check badges
  const newlyEarnedBadges = [];
  const addBadge = (id, name, icon, tier) => {
    const exists = user.earnedBadges && user.earnedBadges.some((b) => b.id === id);
    if (!exists) {
      const badge = { id, name, icon, tier, earnedAt: new Date() };
      user.earnedBadges = user.earnedBadges || [];
      user.earnedBadges.push(badge);
      if (!user.badges.includes(id)) {
        user.badges.push(id);
      }
      newlyEarnedBadges.push(badge);
    }
  };

  // Badge triggers
  if (user.xp.total >= 10) addBadge("first_focus", "First Focus", "🎯", "bronze");
  if (user.currentStreak >= 7) addBadge("streak_7", "Week Warrior", "🔥", "silver");
  if (user.currentStreak >= 30) addBadge("streak_30", "Month Master", "💎", "gold");
  if (user.xp.total >= 1000) addBadge("xp_1000", "XP Collector", "⚡", "silver");
  if (user.xp.total >= 10000) addBadge("xp_10000", "XP Legend", "🏆", "platinum");
  if (user.roomsJoined >= 1) addBadge("room_social", "Social Studier", "👥", "bronze");

  await user.save();

  return {
    user,
    xpEarned: amount,
    totalXP: user.xp.total,
    level: user.xp.level,
    leveledUp,
    newlyEarnedBadges,
    currentStreak: user.currentStreak,
  };
}

module.exports = {
  calculateLevel,
  awardXP,
};
