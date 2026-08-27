const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const { ALL_BADGES } = require("../services/badgeService");
const { calculateLevel, getXPForLevel, activateStreakShield } = require("../services/xpService");

// @desc    Get user XP and gamification summary
// @route   GET /api/xp/me
// @access  Private
const getXpSummary = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("xp points currentStreak longestStreak streakShield earnedBadges badges");

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const totalXP = user.xp?.total || 0;
  const currentLevel = user.xp?.level || calculateLevel(totalXP);
  const currentLevelXPThreshold = getXPForLevel(currentLevel);
  const nextLevelXPThreshold = getXPForLevel(currentLevel + 1);
  const levelXPProgress = Math.max(0, totalXP - currentLevelXPThreshold);
  const levelXPRequired = Math.max(1, nextLevelXPThreshold - currentLevelXPThreshold);
  const progressPercent = Math.min(100, Math.round((levelXPProgress / levelXPRequired) * 100));

  res.status(200).json({
    totalXP,
    weeklyXP: user.xp?.weekly || 0,
    monthlyXP: user.xp?.monthly || 0,
    level: currentLevel,
    currentLevelXPThreshold,
    nextLevelXPThreshold,
    progressPercent,
    currentStreak: user.currentStreak || 0,
    longestStreak: user.longestStreak || 0,
    streakShield: user.streakShield || { active: false },
    earnedBadgesCount: user.earnedBadges?.length || 0,
    totalBadgesCount: ALL_BADGES.length,
  });
});

// @desc    Get user badge shelf
// @route   GET /api/xp/badges
// @access  Private
const getBadges = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("earnedBadges badges");
  const earnedMap = new Map();

  if (user && user.earnedBadges) {
    user.earnedBadges.forEach((b) => {
      earnedMap.set(b.id, b);
    });
  }

  const badgeShelf = ALL_BADGES.map((badge) => {
    const earned = earnedMap.get(badge.id);
    return {
      ...badge,
      unlocked: !!earned,
      earnedAt: earned ? earned.earnedAt : null,
    };
  });

  res.status(200).json(badgeShelf);
});

// @desc    Activate a streak shield
// @route   POST /api/xp/streak-shield
// @access  Private
const toggleStreakShield = asyncHandler(async (req, res) => {
  const streakShield = await activateStreakShield(req.user._id);
  res.status(200).json({
    message: "Streak shield activated successfully!",
    streakShield,
  });
});

module.exports = {
  getXpSummary,
  getBadges,
  toggleStreakShield,
};
