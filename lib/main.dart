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
  int _xp = 0;
  int _level = 1;
  int _monsterHp = 100;
  final int _xpPerLevel = 100;

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

  void _loadStats() async {
    final prefs = await SharedPreferences.getInstance();
    setState(() {
      _xp = prefs.getInt('xp') ?? 0;
      _level = prefs.getInt('level') ?? 1;
    });
  }

  void _saveStats() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setInt('xp', _xp);
    await prefs.setInt('level', _level);
  }

  void _completeQuest(int index) {
    if (_quests[index]['isDone']) return;
    setState(() {
      _quests[index]['isDone'] = true;
      _xp += _quests[index]['xp'] as int;
      if (_xp >= _xpPerLevel) {
        _level++;
        _xp -= _xpPerLevel;
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
          title: const Text("BATTLE: PROCRASTINATION", style: TextStyle(color: Colors.redAccent)),
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
                  _monsterHp -= 15;
                  if (_monsterHp <= 0) {
                    Navigator.pop(context);
                    _completeQuest(2); // Completes the Monster Hunter quest
                    _monsterHp = 100; // Reset
                  }
                });
              },
              child: const Text("TAP TO STUDY / ATTACK"),
            ),
          ],
        ),
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
                  gradient: LinearGradient(colors: [Colors.deepPurple, Colors.black]),
                ),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const CircleAvatar(radius: 40, backgroundColor: Colors.white10, child: Icon(Icons.bolt, color: Colors.amber, size: 40)),
                    const SizedBox(height: 10),
                    Text("LVL $_level HERO", style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold)),
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 40),
                      child: LinearProgressIndicator(value: _xp / _xpPerLevel, color: Colors.amber),
                    ),
                  ],
                ),
              ),
            ),
          ),
          SliverList(
            delegate: SliverChildBuilderDelegate(
              (context, i) => Card(
                margin: const EdgeInsets.all(10),
                color: _quests[i]['isDone'] ? Colors.green.withOpacity(0.05) : Colors.white.withOpacity(0.05),
                child: ListTile(
                  leading: Icon(_quests[i]['type'] == 'boss' ? Icons.whatshot : Icons.eco, 
                    color: _quests[i]['isDone'] ? Colors.green : Colors.deepPurpleAccent),
                  title: Text(_quests[i]['title']),
                  subtitle: Text(_quests[i]['desc']),
                  trailing: Text("+${_quests[i]['xp']} XP", style: const TextStyle(color: Colors.amber)),
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