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
        primaryColor: Colors.deepPurpleAccent,
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
  // Game Logic Variables
  int _xp = 0;
  int _level = 1;
  int _monsterHp = 100;
  final int _xpPerLevel = 100;

  // Character Attributes
  int _strength = 10;
  int _intelligence = 10;
  int _stamina = 10;
  int _skillPoints = 0;

  final List<Map<String, dynamic>> _quests = [
    {"title": "Step Master", "desc": "Walk 4,000 steps", "xp": 40, "isDone": false, "type": "task"},
    {"title": "Social Link", "desc": "Talk to 1 new person", "xp": 30, "isDone": false, "type": "task"},
    {"title": "Monster Hunter", "desc": "Study: Defeat Procrastination", "xp": 50, "isDone": false, "type": "boss"},
  ];

  @override
  void initState() {
    super.initState();
    _loadStats();
  }

  // --- PERSISTENCE LAYER ---
  Future<void> _loadStats() async {
    final prefs = await SharedPreferences.getInstance();
    setState(() {
      _xp = prefs.getInt('xp') ?? 0;
      _level = prefs.getInt('level') ?? 1;
      _strength = prefs.getInt('strength') ?? 10;
      _intelligence = prefs.getInt('intelligence') ?? 10;
      _stamina = prefs.getInt('stamina') ?? 10;
      _skillPoints = prefs.getInt('skillPoints') ?? 0;
    });
  }

  Future<void> _saveStats() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setInt('xp', _xp);
    await prefs.setInt('level', _level);
    await prefs.setInt('strength', _strength);
    await prefs.setInt('intelligence', _intelligence);
    await prefs.setInt('stamina', _stamina);
    await prefs.setInt('skillPoints', _skillPoints);
  }

  // --- GAMEPLAY LOGIC ---
  void _completeQuest(int index) {
    if (_quests[index]['isDone']) return;
    setState(() {
      _quests[index]['isDone'] = true;
      _xp += _quests[index]['xp'] as int;

      // Attribute Growth Logic
      if (_quests[index]['title'] == "Monster Hunter") _intelligence += 5;
      if (_quests[index]['title'] == "Step Master") _stamina += 5;
      if (_quests[index]['title'] == "Social Link") _strength += 3;

      if (_xp >= _xpPerLevel) {
        _level++;
        _xp -= _xpPerLevel;
        _skillPoints++;
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
          title: const Text("BATTLE: PROCRASTINATION", style: TextStyle(color: Colors.redAccent, letterSpacing: 2)),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(Icons.adb, size: 80, color: Colors.redAccent),
              const SizedBox(height: 20),
              LinearProgressIndicator(value: _monsterHp / 100, color: Colors.redAccent, backgroundColor: Colors.white10),
              const SizedBox(height: 10),
              Text("Monster HP: $_monsterHp", style: const TextStyle(fontWeight: FontWeight.bold)),
            ],
          ),
          actions: [
            ElevatedButton(
              onPressed: () {
                setDialogState(() {
                  _monsterHp -= 20;
                  if (_monsterHp <= 0) {
                    Navigator.pop(context);
                    _completeQuest(2);
                    _monsterHp = 100;
                  }
                });
              },
              child: const Text("TAP TO STUDY"),
            ),
          ],
        ),
      ),
    );
  }

  // --- UI COMPONENTS ---
  Widget _buildStatCard(String label, int value, IconData icon, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 16),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.05),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: color.withOpacity(0.2)),
      ),
      child: Column(
        children: [
          Icon(icon, size: 20, color: color),
          const SizedBox(height: 4),
          Text(label, style: const TextStyle(fontSize: 10, color: Colors.white38)),
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
            expandedHeight: 220,
            pinned: true,
            flexibleSpace: FlexibleSpaceBar(
              background: Container(
                decoration: const BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                    colors: [Colors.deepPurple, Color(0xFF121212)],
                  ),
                ),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const SizedBox(height: 40),
                    const CircleAvatar(radius: 35, backgroundColor: Colors.white10, child: Icon(Icons.bolt, color: Colors.amber, size: 30)),
                    const SizedBox(height: 10),
                    Text("LVL $_level HERO", style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold, letterSpacing: 2)),
                    const SizedBox(height: 8),
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 50),
                      child: LinearProgressIndicator(value: _xp / _xpPerLevel, color: Colors.amber, backgroundColor: Colors.white10),
                    ),
                    const SizedBox(height: 5),
                    Text("XP: $_xp / $_xpPerLevel", style: const TextStyle(fontSize: 10, color: Colors.white38)),
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
                  _buildStatCard("STR", _strength, Icons.fitness_center, Colors.orangeAccent),
                  _buildStatCard("INT", _intelligence, Icons.psychology, Colors.lightBlueAccent),
                  _buildStatCard("STM", _stamina, Icons.bolt, Colors.greenAccent),
                ],
              ),
            ),
          ),
          SliverList(
            delegate: SliverChildBuilderDelegate(
              (context, i) => Card(
                margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                color: _quests[i]['isDone'] ? Colors.green.withOpacity(0.05) : Colors.white.withOpacity(0.05),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                child: ListTile(
                  contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
                  leading: Icon(
                    _quests[i]['type'] == 'boss' ? Icons.fireplace : Icons.auto_awesome, 
                    color: _quests[i]['isDone'] ? Colors.green : Colors.deepPurpleAccent
                  ),
                  title: Text(_quests[i]['title'], style: const TextStyle(fontWeight: FontWeight.bold)),
                  subtitle: Text(_quests[i]['desc'], style: const TextStyle(fontSize: 12, color: Colors.white60)),
                  trailing: Text("+${_quests[i]['xp']} XP", style: const TextStyle(color: Colors.amber, fontWeight: FontWeight.bold)),
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