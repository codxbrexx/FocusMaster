const User = require("../models/User");
const { evaluateUserBadges } = require("./badgeService");

/**
 * Calculate user level based on total XP
 * Formula: Level = floor(0.5 + sqrt(1 + 8 * totalXP / 100) / 2)
 */
function calculateLevel(totalXP) {
  if (!totalXP || totalXP <= 0) return 1;
  const level = Math.floor(0.5 + Math.sqrt(1 + (8 * totalXP) / 100) / 2);
  return Math.max(1, level);
}

/**
 * Get total XP required to reach a specific level
 */
function getXPForLevel(level) {
  if (level <= 1) return 0;
  return Math.floor((Math.pow(2 * level - 1, 2) - 1) * 12.5);
}

/**
 * Award XP to a user and check for level upgrades and badges
 */
async function awardXP(userId, amount, reason = "focus_session", sessionContext = {}) {
  const user = await User.findById(userId);
  if (!user) return null;

  if (!user.xp) {
    user.xp = { total: 0, weekly: 0, monthly: 0, level: 1 };
  }

  const previousLevel = user.xp.level || calculateLevel(user.xp.total);
  let totalAwarded = amount;

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
      // Streak broken — check if active shield is valid
      if (user.streakShield && user.streakShield.active && user.streakShield.expiresAt > now) {
        user.streakShield.active = false; // consume shield to save streak
      } else {
        user.currentStreak = 1; // streak reset
      }
    }

    user.lastFocusDate = now;
    if (user.currentStreak > user.longestStreak) {
      user.longestStreak = user.currentStreak;
    }

    // Milestone streak XP bonuses
    if (user.currentStreak === 7) totalAwarded += 50;
    if (user.currentStreak === 30) totalAwarded += 200;
  }

  user.xp.total += totalAwarded;
  user.xp.weekly += totalAwarded;
  user.xp.monthly += totalAwarded;
  user.points += totalAwarded;

  const newLevel = calculateLevel(user.xp.total);
  const leveledUp = newLevel > previousLevel;
  user.xp.level = newLevel;

  // Badge evaluation
  const newlyEarnedBadges = evaluateUserBadges(user, {
    ...sessionContext,
    sessionHour: now.getHours(),
  });

  await user.save();

  return {
    user,
    xpEarned: totalAwarded,
    totalXP: user.xp.total,
    weeklyXP: user.xp.weekly,
    level: user.xp.level,
    leveledUp,
    newlyEarnedBadges,
    currentStreak: user.currentStreak,
    longestStreak: user.longestStreak,
  };
}

/**
 * Activate a streak shield for a user (valid for 7 days)
 */
async function activateStreakShield(userId) {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  user.streakShield = {
    active: true,
    expiresAt,
  };

  await user.save();
  return user.streakShield;
}

module.exports = {
  calculateLevel,
  getXPForLevel,
  awardXP,
  activateStreakShield,
};
