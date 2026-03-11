import { 
  Flame, TrendingUp, Coins, Star, Zap, Heart, Brain, 
  Dumbbell, Smile, Users, ChevronRight, Award, Target
} from 'lucide-react';
import { GameState, getXpForLevel, getLevelTitle, getLevelColor } from '../store/gameStore';

interface DashboardProps {
  state: GameState;
  onNavigate: (page: string) => void;
}

export function Dashboard({ state, onNavigate }: DashboardProps) {
  const xpNeeded = getXpForLevel(state.level);
  const xpPercent = Math.min((state.xp / xpNeeded) * 100, 100);
  const levelTitle = getLevelTitle(state.level);
  const levelColor = getLevelColor(state.level);
  const totalStats = state.stats.health + state.stats.knowledge + state.stats.fitness + state.stats.happiness + state.stats.social;
  const dailyQuests = state.quests.filter(q => q.category === 'daily');
  const completedToday = dailyQuests.filter(q => q.isDone).length;
  const unlockedAchievements = state.achievements.filter(a => a.unlocked).length;

  const statItems = [
    { label: 'Health', value: state.stats.health, icon: <Heart size={16} />, color: '#ff2d78', barClass: 'stat-bar-health' },
    { label: 'Knowledge', value: state.stats.knowledge, icon: <Brain size={16} />, color: '#0a84ff', barClass: 'stat-bar-knowledge' },
    { label: 'Fitness', value: state.stats.fitness, icon: <Dumbbell size={16} />, color: '#ff9f0a', barClass: 'stat-bar-fitness' },
    { label: 'Happiness', value: state.stats.happiness, icon: <Smile size={16} />, color: '#30d158', barClass: 'stat-bar-happiness' },
    { label: 'Social', value: state.stats.social, icon: <Users size={16} />, color: '#bf5af2', barClass: 'stat-bar-social' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl glass-card border border-cyber-border p-6 lg:p-8">
        <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/5 via-neon-purple/5 to-neon-pink/5" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-neon-cyan/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-neon-purple/5 rounded-full blur-3xl" />
        
        <div className="relative flex flex-col lg:flex-row items-center gap-6">
          {/* Character Avatar */}
          <div className="relative">
            <div 
              className="w-28 h-28 rounded-2xl bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 border-2 flex items-center justify-center hero-glow"
              style={{ borderColor: levelColor }}
            >
              <span className="text-5xl">
                {state.level < 5 ? '🧑‍💻' : state.level < 10 ? '⚔️' : state.level < 20 ? '🛡️' : state.level < 30 ? '👑' : '🌟'}
              </span>
            </div>
            <div 
              className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-lg text-xs font-orbitron font-bold border"
              style={{ backgroundColor: `${levelColor}20`, borderColor: `${levelColor}50`, color: levelColor }}
            >
              LVL {state.level}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 text-center lg:text-left">
            <p className="text-xs font-rajdhani text-gray-500 uppercase tracking-widest mb-1">{levelTitle}</p>
            <h2 className="text-3xl font-orbitron font-bold mb-1">{state.heroName}</h2>
            <p className="text-sm text-gray-400 font-rajdhani mb-4">
              Total Power: <span className="text-neon-cyan font-semibold">{totalStats}</span> • 
              Quests Done: <span className="text-neon-green font-semibold">{state.totalQuestsCompleted}</span>
            </p>

            {/* XP Bar */}
            <div className="max-w-md mx-auto lg:mx-0">
              <div className="flex justify-between text-xs mb-1">
                <span className="font-rajdhani text-gray-400">Experience</span>
                <span className="font-orbitron text-neon-cyan">{state.xp} / {xpNeeded} XP</span>
              </div>
              <div className="h-3 bg-cyber-card rounded-full overflow-hidden border border-cyber-border">
                <div className="h-full xp-bar rounded-full transition-all duration-700 ease-out" style={{ width: `${xpPercent}%` }} />
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex gap-3 flex-wrap justify-center">
            <QuickStat icon={<Flame size={18} />} label="Streak" value={`${state.streak}d`} color="#ff9f0a" />
            <QuickStat icon={<Coins size={18} />} label="Coins" value={`${state.coins}`} color="#ffd700" />
            <QuickStat icon={<Zap size={18} />} label="Combo" value={`${state.comboMultiplier.toFixed(1)}x`} color="#00f0ff" />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Character Stats */}
        <div className="glass-card rounded-2xl border border-cyber-border p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-orbitron text-sm font-semibold flex items-center gap-2">
              <Star size={16} className="text-neon-gold" />
              Character Stats
            </h3>
            <span className="text-xs text-gray-500 font-rajdhani">Power {totalStats}</span>
          </div>
          <div className="space-y-4">
            {statItems.map(stat => (
              <div key={stat.label} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
                  {stat.icon}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-rajdhani font-medium">{stat.label}</span>
                    <span className="font-orbitron" style={{ color: stat.color }}>{stat.value}</span>
                  </div>
                  <div className="h-2 bg-cyber-card rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${stat.barClass} rounded-full transition-all duration-500`} 
                      style={{ width: `${Math.min((stat.value / 100) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Today's Progress */}
        <div className="glass-card rounded-2xl border border-cyber-border p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-orbitron text-sm font-semibold flex items-center gap-2">
              <Target size={16} className="text-neon-cyan" />
              Today's Progress
            </h3>
            <button 
              onClick={() => onNavigate('quests')}
              className="text-xs text-neon-cyan hover:text-neon-cyan/80 flex items-center gap-1 font-rajdhani"
            >
              View All <ChevronRight size={14} />
            </button>
          </div>

          {/* Circular Progress */}
          <div className="flex items-center justify-center mb-5">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="52" fill="none" stroke="#1e1e2e" strokeWidth="8" />
                <circle 
                  cx="60" cy="60" r="52" fill="none" 
                  stroke="url(#progressGrad)" strokeWidth="8" strokeLinecap="round"
                  strokeDasharray={`${(completedToday / Math.max(dailyQuests.length, 1)) * 327} 327`}
                />
                <defs>
                  <linearGradient id="progressGrad">
                    <stop offset="0%" stopColor="#00f0ff" />
                    <stop offset="100%" stopColor="#bf5af2" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-orbitron font-bold">{completedToday}</span>
                <span className="text-[10px] text-gray-500 font-rajdhani">of {dailyQuests.length}</span>
              </div>
            </div>
          </div>

          {/* Quest Mini List */}
          <div className="space-y-2">
            {dailyQuests.slice(0, 4).map(q => (
              <div key={q.id} className={`flex items-center gap-3 p-2 rounded-lg ${q.isDone ? 'bg-neon-green/5' : 'bg-white/[0.02]'}`}>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${q.isDone ? 'border-neon-green bg-neon-green/20' : 'border-gray-600'}`}>
                  {q.isDone && <span className="text-neon-green text-xs">✓</span>}
                </div>
                <span className={`text-sm font-rajdhani ${q.isDone ? 'line-through text-gray-500' : ''}`}>{q.title}</span>
                {!q.isDone && <span className="ml-auto text-xs text-neon-cyan font-orbitron">+{q.xp}</span>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ActionCard
          icon={<TrendingUp size={20} />}
          title="Best Streak"
          value={`${state.bestStreak} days`}
          color="#ff9f0a"
          onClick={() => {}}
        />
        <ActionCard
          icon={<Award size={20} />}
          title="Achievements"
          value={`${unlockedAchievements} / ${state.achievements.length}`}
          color="#bf5af2"
          onClick={() => onNavigate('achievements')}
        />
        <ActionCard
          icon={<Zap size={20} />}
          title="Focus Sessions"
          value={`${state.focusSessions} completed`}
          color="#00f0ff"
          onClick={() => onNavigate('focus')}
        />
      </div>

      {/* AI Mentor */}
      <div className="glass-card rounded-2xl border border-neon-purple/20 p-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-neon-purple/5 rounded-full blur-3xl" />
        <div className="relative flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-purple/20 to-neon-pink/20 flex items-center justify-center text-2xl flex-shrink-0 animate-float">
            🤖
          </div>
          <div>
            <p className="font-orbitron text-sm font-semibold text-neon-purple mb-1">AI Mentor</p>
            <p className="text-sm text-gray-300 font-rajdhani leading-relaxed">
              {getMentorMessage(state)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickStat({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  return (
    <div className="glass-card rounded-xl border border-cyber-border p-3 min-w-[80px] text-center">
      <div className="flex justify-center mb-1" style={{ color }}>{icon}</div>
      <p className="font-orbitron text-sm font-bold">{value}</p>
      <p className="text-[10px] text-gray-500 font-rajdhani uppercase">{label}</p>
    </div>
  );
}

function ActionCard({ icon, title, value, color, onClick }: { icon: React.ReactNode; title: string; value: string; color: string; onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="glass-card rounded-xl border border-cyber-border p-4 text-left hover:border-opacity-50 transition-all group"
      style={{ borderColor: `${color}20` }}
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}15`, color }}>
          {icon}
        </div>
        <span className="text-xs text-gray-500 font-rajdhani uppercase">{title}</span>
      </div>
      <p className="font-orbitron text-lg font-bold group-hover:translate-x-1 transition-transform">{value}</p>
    </button>
  );
}

function getMentorMessage(state: GameState): string {
  const dailyDone = state.quests.filter(q => q.category === 'daily' && q.isDone).length;
  const dailyTotal = state.quests.filter(q => q.category === 'daily').length;
  
  if (dailyDone === 0) return `Good day, ${state.heroName}! Ready to conquer today's quests? Your adventure awaits. Start with something small — momentum is your greatest power! 🚀`;
  if (dailyDone < dailyTotal / 2) return `Great progress, ${state.heroName}! You've completed ${dailyDone} quests so far. Keep pushing — every quest brings you closer to greatness! 💪`;
  if (dailyDone < dailyTotal) return `Almost there, ${state.heroName}! Just ${dailyTotal - dailyDone} more quests to complete today. You're on fire! 🔥`;
  if (state.streak >= 7) return `INCREDIBLE, ${state.heroName}! All daily quests DONE and a ${state.streak}-day streak! You're truly becoming a legend! ⚡👑`;
  return `AMAZING, ${state.heroName}! You've completed ALL daily quests! Your dedication is inspiring. Keep building that streak! 🏆`;
}
