export const getLevelInfo = (points: number) => {
  if (points >= 20000)
    return {
      level: 7,
      name: 'Legend',
      tag: 'LEGEND',
      color: 'text-rose-500',
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/20',
      gradient: 'from-rose-500 via-purple-500 to-indigo-500',
      next: Infinity,
    };
  if (points >= 10000)
    return {
      level: 6,
      name: 'Grandmaster',
      tag: 'GRANDMASTER',
      color: 'text-red-500',
      bg: 'bg-red-500/10',
      border: 'border-red-500/20',
      gradient: 'from-red-600 to-orange-600',
      next: 20000,
    };
  if (points >= 5000)
    return {
      level: 5,
      name: 'Master',
      tag: 'MASTER',
      color: 'text-amber-500',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      gradient: 'from-amber-400 to-orange-500',
      next: 10000,
    };
  if (points >= 3000)
    return {
      level: 4,
      name: 'Expert',
      tag: 'EXPERT',
      color: 'text-purple-500',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20',
      gradient: 'from-purple-500 to-indigo-500',
      next: 5000,
    };
  if (points >= 1500)
    return {
      level: 3,
      name: 'Adept',
      tag: 'ADEPT',
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
      gradient: 'from-blue-400 to-cyan-500',
      next: 3000,
    };
  if (points >= 500)
    return {
      level: 2,
      name: 'Apprentice',
      tag: 'APPRENTICE',
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      gradient: 'from-emerald-400 to-green-500',
      next: 1500,
    };
  return {
    level: 1,
    name: 'Novice',
    tag: 'NOVICE',
    color: 'text-slate-500',
    bg: 'bg-slate-500/10',
    border: 'border-slate-500/20',
    gradient: 'from-slate-400 to-gray-500',
    next: 500,
  };
};

export const getProgressPercent = (points: number) => {
  const currentLevel = getLevelInfo(points);
  const levels = [0, 0, 500, 1500, 3000, 5000, 10000]; // Start thresholds for levels 1-7
  const startPoints = levels[currentLevel.level - 1] || 0;
  const nextPoints = currentLevel.next;

  if (nextPoints === Infinity) return 100;

  return Math.min(100, Math.max(0, ((points - startPoints) / (nextPoints - startPoints)) * 100));
};
