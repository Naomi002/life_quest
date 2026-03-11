import { useState, useCallback } from 'react';
import { Sidebar, type Page } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { DailyQuests } from './components/DailyQuests';
import { LifeQuests } from './components/LifeQuests';
import { BossBattlesView } from './components/BossBattles';
import { SkillTree } from './components/SkillTree';
import { WorldMap } from './components/WorldMap';
import { Achievements } from './components/Achievements';
import { FocusMode } from './components/FocusMode';
import { MoodLog } from './components/MoodLog';
import { SettingsPage } from './components/SettingsPage';
import { Notifications, type Notification } from './components/Notifications';
import {
  GameState,
  loadGameState,
  saveGameState,
  getXpForLevel,
  Quest,
} from './store/gameStore';

export function App() {
  const [state, setState] = useState<GameState>(() => loadGameState());
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((message: string, type: Notification['type']) => {
    const id = `notif_${Date.now()}_${Math.random()}`;
    setNotifications(prev => [...prev, { id, message, type }]);
  }, []);

  const dismissNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const updateState = useCallback((newState: GameState) => {
    setState(newState);
    saveGameState(newState);
  }, []);

  // Check and unlock achievements
  const checkAchievements = useCallback((s: GameState): GameState => {
    const updated = { ...s, achievements: [...s.achievements.map(a => ({ ...a }))] };
    let changed = false;

    const checks: { id: string; condition: boolean }[] = [
      { id: 'a1', condition: s.totalQuestsCompleted >= 1 },
      { id: 'a2', condition: s.streak >= 7 },
      { id: 'a3', condition: s.streak >= 30 },
      { id: 'a4', condition: s.level >= 10 },
      { id: 'a5', condition: s.level >= 25 },
      { id: 'a6', condition: s.bossBattles.some(b => b.defeated) },
      { id: 'a7', condition: s.quests.filter(q => q.category === 'daily').every(q => q.isDone) },
      { id: 'a8', condition: s.stats.knowledge >= 50 },
      { id: 'a9', condition: s.stats.fitness >= 50 },
      { id: 'a10', condition: s.focusSessions >= 50 },
      { id: 'a11', condition: s.coins >= 1000 },
      { id: 'a12', condition: s.level >= 50 },
    ];

    for (const check of checks) {
      const ach = updated.achievements.find(a => a.id === check.id);
      if (ach && !ach.unlocked && check.condition) {
        ach.unlocked = true;
        ach.unlockedAt = new Date().toISOString();
        changed = true;
        addNotification(`Achievement Unlocked: ${ach.title} ${ach.icon}`, 'achievement');
      }
    }

    return changed ? updated : s;
  }, [addNotification]);

  // Handle quest toggle
  const handleToggleQuest = useCallback((questId: string) => {
    setState(prev => {
      const newState = { ...prev, quests: prev.quests.map(q => ({ ...q })) };
      const quest = newState.quests.find(q => q.id === questId);
      if (!quest) return prev;

      if (quest.isDone) {
        // Undo
        quest.isDone = false;
        newState.xp = Math.max(0, newState.xp - quest.xp);
        newState.totalXp = Math.max(0, newState.totalXp - quest.xp);
        newState.coins = Math.max(0, newState.coins - quest.coins);
        newState.totalQuestsCompleted = Math.max(0, newState.totalQuestsCompleted - 1);

        // Undo stat boost
        const statBoost = quest.difficulty === 'easy' ? 2 : quest.difficulty === 'medium' ? 3 : quest.difficulty === 'hard' ? 5 : 8;
        const statKey = quest.type as keyof typeof newState.stats;
        if (newState.stats[statKey] !== undefined) {
          newState.stats = { ...newState.stats, [statKey]: Math.max(1, newState.stats[statKey] - statBoost) };
        }
      } else {
        // Complete
        quest.isDone = true;
        const xpGain = Math.floor(quest.xp * newState.comboMultiplier);
        newState.xp += xpGain;
        newState.totalXp += xpGain;
        newState.coins += quest.coins;
        newState.totalQuestsCompleted += 1;

        // Stat boost
        const statBoost = quest.difficulty === 'easy' ? 2 : quest.difficulty === 'medium' ? 3 : quest.difficulty === 'hard' ? 5 : 8;
        const statKey = quest.type as keyof typeof newState.stats;
        if (newState.stats[statKey] !== undefined) {
          newState.stats = { ...newState.stats, [statKey]: newState.stats[statKey] + statBoost };
        }

        addNotification(`+${xpGain} XP, +${quest.coins} Coins!`, 'xp');

        // Update combo multiplier
        const dailyDone = newState.quests.filter(q => q.category === 'daily' && q.isDone).length;
        newState.comboMultiplier = 1.0 + (dailyDone * 0.1);

        // Level up check
        let xpNeeded = getXpForLevel(newState.level);
        while (newState.xp >= xpNeeded) {
          newState.xp -= xpNeeded;
          newState.level += 1;
          xpNeeded = getXpForLevel(newState.level);
          addNotification(`🎉 LEVEL UP! You are now Level ${newState.level}!`, 'level');
        }
      }

      const finalState = checkAchievements(newState);
      saveGameState(finalState);
      return finalState;
    });
  }, [addNotification, checkAchievements]);

  // Handle adding custom quest
  const handleAddQuest = useCallback((quest: Quest) => {
    setState(prev => {
      const newState = { ...prev, quests: [...prev.quests, quest] };
      saveGameState(newState);
      return newState;
    });
    addNotification(`New quest added: ${quest.title}`, 'xp');
  }, [addNotification]);

  // Handle removing quest
  const handleRemoveQuest = useCallback((questId: string) => {
    setState(prev => {
      const newState = { ...prev, quests: prev.quests.filter(q => q.id !== questId) };
      saveGameState(newState);
      return newState;
    });
  }, []);

  // Handle reset day
  const handleResetDay = useCallback(() => {
    setState(prev => {
      const newState = {
        ...prev,
        quests: prev.quests.map(q => q.category === 'daily' ? { ...q, isDone: false } : q),
        streak: prev.streak + 1,
        bestStreak: Math.max(prev.bestStreak, prev.streak + 1),
        comboMultiplier: 1.0,
        lastActiveDate: new Date().toISOString().split('T')[0],
      };
      const finalState = checkAchievements(newState);
      saveGameState(finalState);
      addNotification(`🔥 Day ${newState.streak} streak! Keep it going!`, 'streak');
      return finalState;
    });
  }, [addNotification, checkAchievements]);

  // Handle sub-task toggle
  const handleToggleSubTask = useCallback((questId: string, taskIndex: number) => {
    setState(prev => {
      const newState = { ...prev, quests: prev.quests.map(q => {
        if (q.id === questId && q.subTasks) {
          const newSubTasks = q.subTasks.map((t, i) => i === taskIndex ? { ...t, done: !t.done } : { ...t });
          return { ...q, subTasks: newSubTasks };
        }
        return q;
      })};
      saveGameState(newState);
      return newState;
    });
  }, []);

  // Handle boss attack
  const handleAttackBoss = useCallback((bossId: string, damage: number) => {
    setState(prev => {
      const newState = { ...prev, bossBattles: prev.bossBattles.map(b => {
        if (b.id === bossId && !b.defeated) {
          const newHp = Math.max(0, b.hp - damage);
          const defeated = newHp === 0;
          if (defeated) {
            addNotification(`⚔️ BOSS DEFEATED: ${b.name}! +${b.xpReward} XP`, 'boss');
          }
          return { ...b, hp: newHp, defeated };
        }
        return b;
      })};

      // If boss just defeated, award rewards
      const boss = prev.bossBattles.find(b => b.id === bossId);
      if (boss && !boss.defeated) {
        const newHp = Math.max(0, boss.hp - damage);
        if (newHp === 0) {
          newState.xp += boss.xpReward;
          newState.totalXp += boss.xpReward;
          newState.coins += boss.coinReward;

          // Level up check
          let xpNeeded = getXpForLevel(newState.level);
          while (newState.xp >= xpNeeded) {
            newState.xp -= xpNeeded;
            newState.level += 1;
            xpNeeded = getXpForLevel(newState.level);
            addNotification(`🎉 LEVEL UP! Level ${newState.level}!`, 'level');
          }
        }
      }

      const finalState = checkAchievements(newState);
      saveGameState(finalState);
      return finalState;
    });
  }, [addNotification, checkAchievements]);

  // Handle skill upgrade
  const handleUpgradeSkill = useCallback((skillId: string) => {
    const COST = 50;
    setState(prev => {
      if (prev.coins < COST) return prev;
      const newState = {
        ...prev,
        coins: prev.coins - COST,
        skills: prev.skills.map(s => {
          if (s.id === skillId && s.level < s.maxLevel) {
            return { ...s, level: s.level + 1, unlocked: true };
          }
          return s;
        }),
      };
      addNotification(`⚡ Skill upgraded! -${COST} coins`, 'coin');
      saveGameState(newState);
      return newState;
    });
  }, [addNotification]);

  // Handle focus complete
  const handleFocusComplete = useCallback(() => {
    setState(prev => {
      const xpGain = 40;
      const newState = {
        ...prev,
        focusSessions: prev.focusSessions + 1,
        xp: prev.xp + xpGain,
        totalXp: prev.totalXp + xpGain,
        stats: { ...prev.stats, knowledge: prev.stats.knowledge + 2 },
      };

      // Level check
      let xpNeeded = getXpForLevel(newState.level);
      while (newState.xp >= xpNeeded) {
        newState.xp -= xpNeeded;
        newState.level += 1;
        xpNeeded = getXpForLevel(newState.level);
        addNotification(`🎉 LEVEL UP! Level ${newState.level}!`, 'level');
      }

      addNotification(`🎯 Focus session complete! +${xpGain} XP`, 'xp');
      const finalState = checkAchievements(newState);
      saveGameState(finalState);
      return finalState;
    });
  }, [addNotification, checkAchievements]);

  // Handle mood log
  const handleAddMood = useCallback((mood: number, note: string) => {
    setState(prev => {
      const today = new Date().toISOString().split('T')[0];
      const newState = {
        ...prev,
        moodLog: [...prev.moodLog.filter(m => m.date !== today), { date: today, mood, note }],
        xp: prev.xp + 10,
        totalXp: prev.totalXp + 10,
        stats: { ...prev.stats, happiness: prev.stats.happiness + 1 },
      };
      addNotification('📝 Mood logged! +10 XP', 'xp');
      saveGameState(newState);
      return newState;
    });
  }, [addNotification]);

  const handleNavigate = useCallback((page: string) => {
    setCurrentPage(page as Page);
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard state={state} onNavigate={handleNavigate} />;
      case 'quests':
        return (
          <DailyQuests
            quests={state.quests}
            comboMultiplier={state.comboMultiplier}
            onToggleQuest={handleToggleQuest}
            onAddQuest={handleAddQuest}
            onRemoveQuest={handleRemoveQuest}
            onResetDay={handleResetDay}
          />
        );
      case 'lifeQuests':
        return (
          <LifeQuests
            quests={state.quests}
            onToggleQuest={handleToggleQuest}
            onToggleSubTask={handleToggleSubTask}
          />
        );
      case 'bossBattles':
        return (
          <BossBattlesView
            bosses={state.bossBattles}
            onAttackBoss={handleAttackBoss}
          />
        );
      case 'skillTree':
        return (
          <SkillTree
            skills={state.skills}
            coins={state.coins}
            level={state.level}
            onUpgradeSkill={handleUpgradeSkill}
          />
        );
      case 'worldMap':
        return <WorldMap state={state} onNavigate={handleNavigate} />;
      case 'achievements':
        return <Achievements achievements={state.achievements} />;
      case 'focus':
        return (
          <FocusMode
            focusSessions={state.focusSessions}
            onCompleteFocus={handleFocusComplete}
          />
        );
      case 'mood':
        return (
          <MoodLog
            moodLog={state.moodLog}
            onAddMood={handleAddMood}
          />
        );
      case 'settings':
        return (
          <SettingsPage
            state={state}
            onUpdateState={updateState}
          />
        );
      default:
        return <Dashboard state={state} onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-cyber-darker">
      <Notifications notifications={notifications} onDismiss={dismissNotification} />
      <Sidebar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        level={state.level}
        heroName={state.heroName}
      />

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen">
        {/* Top Bar */}
        <header className="sticky top-0 z-20 glass-card border-b border-cyber-border px-6 py-3">
          <div className="flex items-center justify-between max-w-6xl mx-auto">
            <div className="flex items-center gap-4 ml-10 lg:ml-0">
              <h1 className="font-orbitron text-sm font-semibold capitalize">
                {currentPage === 'lifeQuests' ? 'Life Quests' : 
                 currentPage === 'bossBattles' ? 'Boss Battles' : 
                 currentPage === 'skillTree' ? 'Skill Tree' : 
                 currentPage === 'worldMap' ? 'World Map' : 
                 currentPage}
              </h1>
            </div>
            <div className="flex items-center gap-4 text-xs font-rajdhani">
              <span className="text-gray-500">LVL <span className="text-neon-cyan font-orbitron">{state.level}</span></span>
              <span className="text-gray-500">🪙 <span className="text-neon-gold font-orbitron">{state.coins}</span></span>
              <span className="text-gray-500">🔥 <span className="text-neon-orange font-orbitron">{state.streak}</span></span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4 lg:p-6 max-w-6xl mx-auto">
          {renderPage()}
        </div>
      </main>
    </div>
  );
}
