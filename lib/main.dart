import 'dart:async';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

void main() => runApp(const LifeQuestApp());

class LifeQuestApp extends StatelessWidget {
  const LifeQuestApp({super.key});
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        brightness: Brightness.dark,
        primaryColor: Colors.cyanAccent,
        useMaterial3: true,
      ),
      home: const GameDashboard(),
    );
  }
}

class GameDashboard extends StatefulWidget {
  const GameDashboard({super.key});
  @override
  State<GameDashboard> createState() => _GameDashboardState();
}

class _GameDashboardState extends State<GameDashboard> {
  int _xp = 0;
  int _level = 1;
  int _monsterHp = 100;
  final int _xpPerLevel = 100;

  int _physical = 10;
  int _knowledge = 10;
  int _energy = 10;

  final List<Map<String, dynamic>> _quests = [
    {"title": "Morning Walk", "desc": "Completed 4,000 steps today", "xp": 40, "isDone": false, "type": "task"},
    {"title": "Social Connection", "desc": "Had a meaningful conversation", "xp": 30, "isDone": false, "type": "task"},
    {"title": "Study Session", "desc": "Focused for 20 mins without distractions", "xp": 50, "isDone": false, "type": "boss"},
  ];

  @override
  void initState() {
    super.initState();
    _loadStats();
  }

  Future<void> _loadStats() async {
    final prefs = await SharedPreferences.getInstance();
    setState(() {
      _xp = prefs.getInt('xp') ?? 0;
      _level = prefs.getInt('level') ?? 1;
      _physical = prefs.getInt('physical') ?? 10;
      _knowledge = prefs.getInt('knowledge') ?? 10;
      _energy = prefs.getInt('energy') ?? 10;
    });
  }

  Future<void> _saveStats() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setInt('xp', _xp);
    await prefs.setInt('level', _level);
    await prefs.setInt('physical', _physical);
    await prefs.setInt('knowledge', _knowledge);
    await prefs.setInt('energy', _energy);
  }

  void _showLevelUpDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: const Color(0xFF1A1A1A),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(Icons.stars, color: Colors.amber, size: 80),
            const SizedBox(height: 20),
            const Text("LEVEL UP!", style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold, color: Colors.amber, letterSpacing: 2)),
            const SizedBox(height: 10),
            Text("You are now Level $_level", style: const TextStyle(fontSize: 18)),
            const SizedBox(height: 20),
            const Text("Your potential is growing. Keep going!", textAlign: TextAlign.center, style: TextStyle(color: Colors.white60)),
          ],
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text("AWESOME", style: TextStyle(color: Colors.cyanAccent))),
        ],
      ),
    );
  }

  void _completeQuest(int index) {
    if (_quests[index]['isDone']) return;
    setState(() {
      _quests[index]['isDone'] = true;
      _xp += _quests[index]['xp'] as int;

      if (_quests[index]['title'] == "Study Session") _knowledge += 5;
      if (_quests[index]['title'] == "Morning Walk") _energy += 5;
      if (_quests[index]['title'] == "Social Connection") _physical += 3;

      if (_xp >= _xpPerLevel) {
        _level++;
        _xp -= _xpPerLevel;
        _showLevelUpDialog();
      }
    });
    _saveStats();
  }

  void _startBossBattle() {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => StatefulBuilder(
        builder: (context, setDialogState) => AlertDialog(
          backgroundColor: const Color(0xFF1A1A1A),
          title: const Text("FOCUS CHALLENGE", style: TextStyle(color: Colors.redAccent)),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(Icons.timer_off, size: 60, color: Colors.redAccent),
              const SizedBox(height: 20),
              LinearProgressIndicator(value: _monsterHp / 100, color: Colors.redAccent, backgroundColor: Colors.white10),
              const SizedBox(height: 10),
              Text("Concentration: $_monsterHp%"),
            ],
          ),
          actions: [
            ElevatedButton(
              onPressed: () {
                setDialogState(() {
                  _monsterHp -= 25;
                  if (_monsterHp <= 0) {
                    Navigator.pop(context);
                    _completeQuest(2);
                    _monsterHp = 100;
                  }
                });
              },
              child: const Text("FOCUS"),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStatCard(String label, int value, IconData icon, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 8),
      width: 100,
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.05),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: color.withOpacity(0.2)),
      ),
      child: Column(
        children: [
          Icon(icon, size: 20, color: color),
          const SizedBox(height: 4),
          Text(label, style: const TextStyle(fontSize: 9, color: Colors.white38)),
          Text("$value", style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF121212),
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            expandedHeight: 200,
            pinned: true,
            flexibleSpace: FlexibleSpaceBar(
              background: Container(
                decoration: const BoxDecoration(
                  gradient: LinearGradient(colors: [Colors.deepPurple, Color(0xFF121212)], begin: Alignment.topCenter, end: Alignment.bottomCenter),
                ),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const SizedBox(height: 40),
                    const CircleAvatar(radius: 30, backgroundColor: Colors.cyanAccent, child: Icon(Icons.person, color: Colors.black)),
                    const SizedBox(height: 10),
                    Text("LEVEL $_level", style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 60, vertical: 10),
                      child: LinearProgressIndicator(value: _xp / _xpPerLevel, color: Colors.cyanAccent, backgroundColor: Colors.white10),
                    ),
                  ],
                ),
              ),
            ),
          ),
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: [
                  _buildStatCard("PHYSICAL", _physical, Icons.fitness_center, Colors.orangeAccent),
                  _buildStatCard("KNOWLEDGE", _knowledge, Icons.psychology, Colors.lightBlueAccent),
                  _buildStatCard("ENERGY", _energy, Icons.bolt, Colors.greenAccent),
                ],
              ),
            ),
          ),
          SliverList(
            delegate: SliverChildBuilderDelegate(
              (context, i) => Card(
                margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                color: _quests[i]['isDone'] ? Colors.green.withOpacity(0.1) : Colors.white.withOpacity(0.05),
                child: ListTile(
                  leading: Icon(_quests[i]['type'] == 'boss' ? Icons.stars : Icons.circle_outlined, color: Colors.cyanAccent),
                  title: Text(_quests[i]['title'], style: const TextStyle(fontWeight: FontWeight.bold)),
                  subtitle: Text(_quests[i]['desc']),
                  onTap: () => _quests[i]['type'] == 'boss' ? _startBossBattle() : _completeQuest(i),
                ),
              ),
              childCount: _quests.length,
            ),
          ),
        ],
      ),
    );
  }
}