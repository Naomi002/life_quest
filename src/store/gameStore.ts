// LifeQuest Game State Management
export interface Quest {
  id: string;
  title: string;
  desc: string;
  xp: number;
  coins: number;
  isDone: boolean;
  type: 'health' | 'knowledge' | 'fitness' | 'happiness' | 'social';
  category: 'daily' | 'main' | 'boss' | 'secret';
  difficulty: 'easy' | 'medium' | 'hard' | 'legendary';
  deadline?: string;
  subTasks?: { title: string; done: boolean }[];
}

export interface Achievement {
  id: string;
  title: string;
  desc: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface SkillNode {
  id: string;
  name: string;
  branch: 'knowledge' | 'fitness' | 'creativity' | 'social' | 'productivity';
  level: number;
  maxLevel: number;
  unlocked: boolean;
  desc: string;
  xpBonus: number;
  requires?: string;
}

export interface BossBattle {
  id: string;
  name: string;
  desc: string;
  hp: number;
  maxHp: number;
  xpReward: number;
  coinReward: number;
  requiredQuests: string[];
  defeated: boolean;
  icon: string;
}

export interface GameState {
  heroName: string;
  xp: number;
  level: number;
  totalXp: number;
  coins: number;
  streak: number;
  bestStreak: number;
  comboMultiplier: number;
  lastActiveDate: string;
  stats: {
    health: number;
    knowledge: number;
    fitness: number;
    happiness: number;
    social: number;
  };
  quests: Quest[];
  achievements: Achievement[];
  skills: SkillNode[];
  bossBattles: BossBattle[];
  inventory: { id: string; name: string; type: string; rarity: string }[];
  moodLog: { date: string; mood: number; note: string }[];
  focusSessions: number;
  totalQuestsCompleted: number;
}

const XP_PER_LEVEL_BASE = 100;
const XP_GROWTH = 1.15;

export function getXpForLevel(level: number): number {
  return Math.floor(XP_PER_LEVEL_BASE * Math.pow(XP_GROWTH, level - 1));
}

export function getLevelTitle(level: number): string {
  if (level < 5) return 'Apprentice';
  if (level < 10) return 'Adventurer';
  if (level < 15) return 'Warrior';
  if (level < 20) return 'Knight';
  if (level < 30) return 'Champion';
  if (level < 40) return 'Hero';
  if (level < 50) return 'Legend';
  return 'Mythic';
}

export function getLevelColor(level: number): string {
  if (level < 5) return '#9CA3AF';
  if (level < 10) return '#60A5FA';
  if (level < 15) return '#A78BFA';
  if (level < 20) return '#F59E0B';
  if (level < 30) return '#EF4444';
  if (level < 40) return '#EC4899';
  if (level < 50) return '#06B6D4';
  return '#FFD700';
}

const DEFAULT_DAILY_QUESTS: Quest[] = [
  { id: 'dq1', title: '🌅 Morning Ritual', desc: 'Complete your morning routine', xp: 30, coins: 10, isDone: false, type: 'health', category: 'daily', difficulty: 'easy' },
  { id: 'dq2', title: '📚 Study Session', desc: '30 minutes of focused learning', xp: 50, coins: 15, isDone: false, type: 'knowledge', category: 'daily', difficulty: 'medium' },
  { id: 'dq3', title: '🏃 Physical Training', desc: 'Exercise for 20+ minutes', xp: 45, coins: 12, isDone: false, type: 'fitness', category: 'daily', difficulty: 'medium' },
  { id: 'dq4', title: '🧘 Meditation', desc: '10 minutes of mindfulness', xp: 25, coins: 8, isDone: false, type: 'happiness', category: 'daily', difficulty: 'easy' },
  { id: 'dq5', title: '🤝 Connect', desc: 'Reach out to a friend or family', xp: 20, coins: 8, isDone: false, type: 'social', category: 'daily', difficulty: 'easy' },
  { id: 'dq6', title: '💧 Hydration Quest', desc: 'Drink 8 glasses of water', xp: 15, coins: 5, isDone: false, type: 'health', category: 'daily', difficulty: 'easy' },
  { id: 'dq7', title: '📖 Read 10 Pages', desc: 'Read from any book', xp: 35, coins: 10, isDone: false, type: 'knowledge', category: 'daily', difficulty: 'easy' },
  { id: 'dq8', title: '🎯 Focus Sprint', desc: 'Complete a 25-min Pomodoro session', xp: 40, coins: 12, isDone: false, type: 'knowledge', category: 'daily', difficulty: 'medium' },
];

const DEFAULT_MAIN_QUESTS: Quest[] = [
  { id: 'mq1', title: '🎓 Master a Course', desc: 'Complete an online course or university module', xp: 500, coins: 200, isDone: false, type: 'knowledge', category: 'main', difficulty: 'hard', subTasks: [
    { title: 'Enroll in course', done: false },
    { title: 'Complete 50% of lessons', done: false },
    { title: 'Pass final assessment', done: false },
  ]},
  { id: 'mq2', title: '💻 Build a Project', desc: 'Create and deploy a complete project', xp: 600, coins: 250, isDone: false, type: 'knowledge', category: 'main', difficulty: 'hard', subTasks: [
    { title: 'Plan the project', done: false },
    { title: 'Build MVP', done: false },
    { title: 'Deploy it live', done: false },
  ]},
  { id: 'mq3', title: '🏋️ Fitness Challenge', desc: '30-day fitness transformation', xp: 400, coins: 150, isDone: false, type: 'fitness', category: 'main', difficulty: 'hard', subTasks: [
    { title: 'Week 1 complete', done: false },
    { title: 'Week 2 complete', done: false },
    { title: 'Week 3 complete', done: false },
    { title: 'Week 4 complete', done: false },
  ]},
  { id: 'mq4', title: '📝 Journal Journey', desc: 'Write in your journal for 21 consecutive days', xp: 300, coins: 120, isDone: false, type: 'happiness', category: 'main', difficulty: 'medium' },
  { id: 'mq5', title: '🌐 Network Builder', desc: 'Make 10 new professional connections', xp: 350, coins: 140, isDone: false, type: 'social', category: 'main', difficulty: 'medium' },
];

const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  { id: 'a1', title: 'First Steps', desc: 'Complete your first quest', icon: '👣', unlocked: false, rarity: 'common' },
  { id: 'a2', title: 'On Fire!', desc: 'Reach a 7-day streak', icon: '🔥', unlocked: false, rarity: 'rare' },
  { id: 'a3', title: 'Unstoppable', desc: 'Reach a 30-day streak', icon: '⚡', unlocked: false, rarity: 'epic' },
  { id: 'a4', title: 'Level 10', desc: 'Reach level 10', icon: '⭐', unlocked: false, rarity: 'rare' },
  { id: 'a5', title: 'Level 25', desc: 'Reach level 25', icon: '🌟', unlocked: false, rarity: 'epic' },
  { id: 'a6', title: 'Boss Slayer', desc: 'Defeat your first boss', icon: '⚔️', unlocked: false, rarity: 'rare' },
  { id: 'a7', title: 'Completionist', desc: 'Complete all daily quests in one day', icon: '🏆', unlocked: false, rarity: 'rare' },
  { id: 'a8', title: 'Scholar', desc: 'Reach 50 Knowledge stat', icon: '🎓', unlocked: false, rarity: 'rare' },
  { id: 'a9', title: 'Athlete', desc: 'Reach 50 Fitness stat', icon: '💪', unlocked: false, rarity: 'rare' },
  { id: 'a10', title: 'Zen Master', desc: 'Complete 50 focus sessions', icon: '🧘', unlocked: false, rarity: 'epic' },
  { id: 'a11', title: 'Rich!', desc: 'Collect 1000 coins', icon: '💰', unlocked: false, rarity: 'epic' },
  { id: 'a12', title: 'Legend Born', desc: 'Reach level 50', icon: '👑', unlocked: false, rarity: 'legendary' },
];

const DEFAULT_SKILLS: SkillNode[] = [
  { id: 'sk1', name: 'Speed Reader', branch: 'knowledge', level: 0, maxLevel: 5, unlocked: false, desc: '+10% Knowledge XP per level', xpBonus: 10 },
  { id: 'sk2', name: 'Deep Focus', branch: 'productivity', level: 0, maxLevel: 5, unlocked: false, desc: '+15% XP from focus sessions', xpBonus: 15 },
  { id: 'sk3', name: 'Iron Will', branch: 'fitness', level: 0, maxLevel: 5, unlocked: false, desc: '+10% Fitness XP per level', xpBonus: 10 },
  { id: 'sk4', name: 'Social Butterfly', branch: 'social', level: 0, maxLevel: 5, unlocked: false, desc: '+10% Social XP per level', xpBonus: 10 },
  { id: 'sk5', name: 'Creative Mind', branch: 'creativity', level: 0, maxLevel: 5, unlocked: false, desc: 'Unlock creative quest types', xpBonus: 10 },
  { id: 'sk6', name: 'Combo Master', branch: 'productivity', level: 0, maxLevel: 3, unlocked: false, desc: '+0.1x combo multiplier per level', xpBonus: 0, requires: 'sk2' },
  { id: 'sk7', name: 'Polyglot', branch: 'knowledge', level: 0, maxLevel: 5, unlocked: false, desc: 'Language learning XP bonus', xpBonus: 20, requires: 'sk1' },
  { id: 'sk8', name: 'Marathon Runner', branch: 'fitness', level: 0, maxLevel: 3, unlocked: false, desc: 'Endurance quest bonus', xpBonus: 15, requires: 'sk3' },
];

const DEFAULT_BOSSES: BossBattle[] = [
  { id: 'b1', name: '📝 Final Exam Boss', desc: 'Conquer your biggest academic challenge', hp: 100, maxHp: 100, xpReward: 500, coinReward: 200, requiredQuests: [], defeated: false, icon: '📝' },
  { id: 'b2', name: '💼 Career Dragon', desc: 'Land your dream job or internship', hp: 150, maxHp: 150, xpReward: 800, coinReward: 350, requiredQuests: [], defeated: false, icon: '💼' },
  { id: 'b3', name: '🏔️ Fitness Titan', desc: 'Complete an extreme fitness challenge', hp: 120, maxHp: 120, xpReward: 600, coinReward: 250, requiredQuests: [], defeated: false, icon: '🏔️' },
  { id: 'b4', name: '🚀 Startup Kraken', desc: 'Launch your own project or startup', hp: 200, maxHp: 200, xpReward: 1000, coinReward: 500, requiredQuests: [], defeated: false, icon: '🚀' },
];

export function getDefaultState(): GameState {
  return {
    heroName: 'Hero',
    xp: 0,
    level: 1,
    totalXp: 0,
    coins: 50,
    streak: 0,
    bestStreak: 0,
    comboMultiplier: 1.0,
    lastActiveDate: new Date().toISOString().split('T')[0],
    stats: { health: 10, knowledge: 10, fitness: 10, happiness: 10, social: 10 },
    quests: [...DEFAULT_DAILY_QUESTS, ...DEFAULT_MAIN_QUESTS],
    achievements: DEFAULT_ACHIEVEMENTS,
    skills: DEFAULT_SKILLS,
    bossBattles: DEFAULT_BOSSES,
    inventory: [],
    moodLog: [],
    focusSessions: 0,
    totalQuestsCompleted: 0,
  };
}

export function loadGameState(): GameState {
  try {
    const saved = localStorage.getItem('lifequest_state');
    if (saved) {
      const parsed = JSON.parse(saved);
      const defaults = getDefaultState();
      return { ...defaults, ...parsed };
    }
  } catch (e) {
    console.error('Failed to load game state', e);
  }
  return getDefaultState();
}

export function saveGameState(state: GameState): void {
  localStorage.setItem('lifequest_state', JSON.stringify(state));
}

export function calculateStatTotal(stats: GameState['stats']): number {
  return stats.health + stats.knowledge + stats.fitness + stats.happiness + stats.social;
}

export function getRandomDailyQuest(): Quest {
  const randoms: Quest[] = [
    { id: `rq_${Date.now()}`, title: '🎲 Mystery Challenge', desc: 'Do something completely out of your comfort zone', xp: 60, coins: 25, isDone: false, type: 'happiness', category: 'daily', difficulty: 'medium' },
    { id: `rq_${Date.now()}`, title: '🌳 Nature Walk', desc: 'Spend 30 minutes outdoors in nature', xp: 35, coins: 10, isDone: false, type: 'health', category: 'daily', difficulty: 'easy' },
    { id: `rq_${Date.now()}`, title: '🎨 Creative Hour', desc: 'Spend an hour on any creative activity', xp: 45, coins: 15, isDone: false, type: 'happiness', category: 'daily', difficulty: 'medium' },
    { id: `rq_${Date.now()}`, title: '📱 Digital Detox', desc: 'No social media for 4 hours', xp: 40, coins: 20, isDone: false, type: 'happiness', category: 'daily', difficulty: 'medium' },
    { id: `rq_${Date.now()}`, title: '🍳 Cook Something New', desc: 'Try a new recipe', xp: 30, coins: 10, isDone: false, type: 'health', category: 'daily', difficulty: 'easy' },
  ];
  return randoms[Math.floor(Math.random() * randoms.length)];
}
