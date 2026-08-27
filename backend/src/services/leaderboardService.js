const User = require("../models/User");
const LeaderboardSnapshot = require("../models/LeaderboardSnapshot");

/**
 * Get Leaderboard rankings filtered by period and study stream
 */
const getLeaderboard = async ({ period = "weekly", stream = "global", limit = 50, currentUserId = null }) => {
  let sortField = "xp.weekly";
  if (period === "monthly") sortField = "xp.monthly";
  if (period === "alltime") sortField = "xp.total";

  const query = {};
  if (stream && stream !== "global") {
    query.$or = [
      { stream: stream },
      { studyStream: stream }
    ];
  }

  // Fetch top ranked users
  const topUsers = await User.find(query)
    .select("name picture xp currentStreak stream studyStream badges")
    .sort({ [sortField]: -1, "xp.total": -1 })
    .limit(limit)
    .lean();

  const rankings = topUsers.map((u, index) => {
    let xpValue = u.xp?.weekly || 0;
    if (period === "monthly") xpValue = u.xp?.monthly || 0;
    if (period === "alltime") xpValue = u.xp?.total || 0;

    return {
      rank: index + 1,
      userId: u._id,
      name: u.name || "Anonymous Student",
      picture: u.picture || "https://github.com/shadcn.png",
      level: u.xp?.level || 1,
      xp: xpValue,
      totalXp: u.xp?.total || 0,
      streak: u.currentStreak || 0,
      stream: u.stream || u.studyStream || "engineering",
      badgeCount: u.badges?.length || 0,
    };
  });

  // Calculate current logged in user's position
  let userRank = null;

  if (currentUserId) {
    const userInTop = rankings.find(r => r.userId.toString() === currentUserId.toString());

    if (userInTop) {
      userRank = userInTop;
    } else {
      const currentUser = await User.findById(currentUserId).select("name picture xp currentStreak stream studyStream badges").lean();
      if (currentUser) {
        let userXp = currentUser.xp?.weekly || 0;
        if (period === "monthly") userXp = currentUser.xp?.monthly || 0;
        if (period === "alltime") userXp = currentUser.xp?.total || 0;

        // Count users with higher XP
        const higherCountQuery = {
          ...query,
          [sortField]: { $gt: userXp }
        };
        const exactRank = (await User.countDocuments(higherCountQuery)) + 1;

        userRank = {
          rank: exactRank,
          userId: currentUser._id,
          name: currentUser.name,
          picture: currentUser.picture || "https://github.com/shadcn.png",
          level: currentUser.xp?.level || 1,
          xp: userXp,
          totalXp: currentUser.xp?.total || 0,
          streak: currentUser.currentStreak || 0,
          stream: currentUser.stream || currentUser.studyStream || "engineering",
          badgeCount: currentUser.badges?.length || 0,
        };
      }
    }
  }

  const totalParticipants = await User.countDocuments(query);

  return {
    period,
    stream,
    rankings,
    userRank,
    totalParticipants,
  };
};

/**
 * Generate weekly snapshot and reset weekly XP counters
 */
const generateWeeklySnapshots = async () => {
  const streams = ["global", "engineering", "medical", "commerce", "competitive"];
  const weekOf = new Date();
  weekOf.setHours(0, 0, 0, 0);
  const mondayOffset = (weekOf.getDay() + 6) % 7;
  weekOf.setDate(weekOf.getDate() - mondayOffset);

  for (const stream of streams) {
    const data = await getLeaderboard({ period: "weekly", stream, limit: 100 });
    const snapshotRankings = data.rankings.map(r => ({
      rank: r.rank,
      user: r.userId,
      userName: r.name,
      avatar: r.picture,
      xp: r.xp,
      level: r.level,
      streak: r.streak,
    }));

    await LeaderboardSnapshot.create({
      period: "weekly",
      stream,
      weekOf,
      rankings: snapshotRankings,
    });
  }
};

/**
 * Reset weekly XP for all users (Cron job target)
 */
const resetWeeklyXP = async () => {
  await User.updateMany({}, { $set: { "xp.weekly": 0 } });
};

module.exports = {
  getLeaderboard,
  generateWeeklySnapshots,
  resetWeeklyXP,
};
