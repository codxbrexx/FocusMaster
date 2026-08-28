const ALL_BADGES = [
  {
    id: "first_focus",
    name: "First Focus",
    description: "Complete your first Pomodoro focus session",
    icon: "🎯",
    tier: "bronze",
  },
  {
    id: "streak_7",
    name: "Week Warrior",
    description: "Maintain a 7-day focus streak",
    icon: "🔥",
    tier: "silver",
  },
  {
    id: "streak_30",
    name: "Month Master",
    description: "Maintain a 30-day focus streak",
    icon: "💎",
    tier: "gold",
  },
  {
    id: "room_social",
    name: "Social Studier",
    description: "Join your first live co-working focus room",
    icon: "👥",
    tier: "bronze",
  },
  {
    id: "room_host",
    name: "Room Leader",
    description: "Host 5 public co-working focus rooms",
    icon: "👑",
    tier: "silver",
  },
  {
    id: "xp_1000",
    name: "XP Collector",
    description: "Earn a total of 1,000 XP",
    icon: "⚡",
    tier: "silver",
  },
  {
    id: "xp_10000",
    name: "XP Legend",
    description: "Earn a total of 10,000 XP",
    icon: "🏆",
    tier: "platinum",
  },
  {
    id: "leaderboard_top3",
    name: "Podium Finisher",
    description: "Finish in the weekly top 3 on the leaderboard",
    icon: "🥇",
    tier: "gold",
  },
  {
    id: "night_owl",
    name: "Night Owl",
    description: "Complete a focus session after 10:00 PM",
    icon: "🦉",
    tier: "bronze",
  },
  {
    id: "early_bird",
    name: "Early Bird",
    description: "Complete a focus session before 7:00 AM",
    icon: "🌅",
    tier: "bronze",
  },
  {
    id: "marathon",
    name: "Marathon Runner",
    description: "Accumulate 4+ hours of focus time in a single day",
    icon: "🏃",
    tier: "gold",
  },
  {
    id: "centurion",
    name: "Centurion",
    description: "Complete 100 Pomodoro sessions",
    icon: "💯",
    tier: "silver",
  },
];

/**
 * Check user eligibility for badges and return array of newly unlocked badges
 */
function evaluateUserBadges(user, sessionContext = {}) {
  const newlyEarnedBadges = [];

  const existingBadgeIds = new Set(user.earnedBadges ? user.earnedBadges.map((b) => b.id) : []);

  const tryAward = (badgeId) => {
    if (existingBadgeIds.has(badgeId)) return;
    const badgeDef = ALL_BADGES.find((b) => b.id === badgeId);
    if (!badgeDef) return;

    const newBadge = {
      id: badgeDef.id,
      name: badgeDef.name,
      icon: badgeDef.icon,
      tier: badgeDef.tier,
      earnedAt: new Date(),
    };

    user.earnedBadges = user.earnedBadges || [];
    user.earnedBadges.push(newBadge);

    user.badges = user.badges || [];
    if (!user.badges.includes(badgeId)) {
      user.badges.push(badgeId);
    }

    existingBadgeIds.add(badgeId);
    newlyEarnedBadges.push(newBadge);
  };

  const totalXP = user.xp?.total || 0;
  const streak = user.currentStreak || 0;
  const roomsJoined = user.roomsJoined || 0;

  // XP triggers
  if (totalXP >= 10) tryAward("first_focus");
  if (totalXP >= 1000) tryAward("xp_1000");
  if (totalXP >= 10000) tryAward("xp_10000");

  // Streak triggers
  if (streak >= 7) tryAward("streak_7");
  if (streak >= 30) tryAward("streak_30");

  // Social triggers
  if (roomsJoined >= 1) tryAward("room_social");
  if (sessionContext.roomsHosted >= 5) tryAward("room_host");

  // Session time triggers
  if (sessionContext.sessionHour !== undefined) {
    if (sessionContext.sessionHour >= 22 || sessionContext.sessionHour < 4) {
      tryAward("night_owl");
    }
    if (sessionContext.sessionHour >= 4 && sessionContext.sessionHour < 7) {
      tryAward("early_bird");
    }
  }

  // Session stats triggers
  if (sessionContext.dailyFocusMinutes >= 240) tryAward("marathon");
  if (sessionContext.totalPomodoroCount >= 100) tryAward("centurion");

  return newlyEarnedBadges;
}

module.exports = {
  ALL_BADGES,
  evaluateUserBadges,
};
