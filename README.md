# LifeQuest

**Turn your real life into a game you actually want to play.**

LifeQuest started as a Flutter side project and grew into something much bigger. The idea was simple — what if the same mechanics that make video games addictive could be used to build real habits, hit real goals, and actually track personal growth? That question became this app.

It is a web app built with React and TypeScript that works like an RPG. You complete real tasks, earn XP, level up a character, unlock skills, and fight boss battles based on things like exams, fitness challenges, or work projects. The more you show up in real life, the stronger your character gets.

---

## What it does

**Character and stats**

Every user has a character profile with five core stats: Health, Knowledge, Fitness, Happiness, and Social. Completing different types of tasks increases different stats. Reading boosts Knowledge. Exercise boosts Fitness. Staying social boosts your Social stat. Your character visually evolves as you level up, moving through tiers from Apprentice all the way to Mythic.

**Daily Quests**

These are your recurring tasks — things like drinking enough water, studying for an hour, or going for a walk. Complete them to earn XP and coins. A combo multiplier builds up the more quests you complete in a single day.

**Life Quests**

Bigger goals with sub-tasks attached. Things like finishing a course, building a project, or training for a race. These give large XP rewards when completed and track your long-term progress in a meaningful way.

**Boss Battles**

Some challenges in life are just harder than others. Boss battles let you take on major obstacles — a final exam, a startup project, a fitness challenge — by completing preparation quests that deal damage to the boss. Defeating a boss gives large rewards.

**Skill Tree**

Five skill branches: Knowledge, Fitness, Creativity, Social, and Productivity. Spend coins to unlock skills that give XP multipliers and open up new quest types. Skills have prerequisites, so you build in a logical order.

**World Map**

A visual map of life areas represented as regions. Study City, Fitness Mountains, Career Kingdom, Adventure Island, Social Village. Each region has its own quests and progress tracking.

**Focus Mode**

A built-in Pomodoro timer with 15, 25, 45, and 60 minute modes. Sessions are tracked and contribute to your daily progress.

**Mood Tracker**

Log how you are feeling each day on a simple scale. Your history is stored and visualized so you can see patterns over time.

**Achievements**

Milestone badges with four rarity tiers: Common, Rare, Epic, and Legendary. They unlock automatically as you hit targets across the app.

**AI Mentor**

A companion character that sends contextual messages based on your progress, celebrates achievements, and suggests quests when you are stuck.

---

## Tech stack

- React 18
- TypeScript
- Tailwind CSS
- Vite
- Zustand for state management with localStorage persistence
- Lucide React for icons

---

## Running it locally

Clone the repo and install dependencies:

```bash
git clone https://github.com/Naomi002/life_quest.git
cd life_quest
npm install
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Mobile

The app is fully responsive and works on mobile browsers. It is designed to feel comfortable on a phone screen, which is where most people will actually use something like this.

---

## Contributing

If you want to add something or fix something, pull requests are open. If you have an idea that does not fit neatly into a PR, open an issue and explain it.

---

## License

MIT. Use it, fork it, build on it.
