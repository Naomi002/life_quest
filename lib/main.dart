import 'dart:async';
import 'dart:typed_data';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:image_picker/image_picker.dart';

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
  int _streak = 0;
  final int _xpPerLevel = 100;

  int _physical = 10;
  int _knowledge = 10;
  int _energy = 10;
  
  Uint8List? _webImage;
  String _heroName = "NABILA";

  List<Map<String, dynamic>> _quests = [
    {"title": "Morning Walk", "desc": "4,000 steps for physical health", "xp": 40, "isDone": false, "type": "physical"},
    {"title": "Study Session", "desc": "20 mins of focused CC 299 work", "xp": 50, "isDone": false, "type": "knowledge"},
    {"title": "Social Check-in", "desc": "Connect with teammates/friends", "xp": 30, "isDone": false, "type": "energy"},
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
      _streak = prefs.getInt('streak') ?? 0;
      _heroName = prefs.getString('heroName') ?? "NABILA";
    });
  }

  Future<void> _saveStats() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setInt('xp', _xp);
    await prefs.setInt('level', _level);
    await prefs.setInt('physical', _physical);
    await prefs.setInt('knowledge', _knowledge);
    await prefs.setInt('energy', _energy);
    await prefs.setInt('streak', _streak);
    await prefs.setString('heroName', _heroName);
  }

  Future<void> _pickImage() async {
    final ImagePicker picker = ImagePicker();
    final XFile? image = await picker.pickImage(source: ImageSource.gallery);
    if (image != null) {
      var bytes = await image.readAsBytes();
      setState(() => _webImage = bytes);
    }
  }

  void _handleQuestTap(int index) {
    setState(() {
      if (_quests[index]['isDone']) {
        _quests[index]['isDone'] = false;
        _xp = (_xp - (_quests[index]['xp'] as int)).clamp(0, 99999);
      } else {
        _quests[index]['isDone'] = true;
        _xp += _quests[index]['xp'] as int;
        
        // Update specific stats based on quest type
        if (_quests[index]['type'] == 'physical') _physical += 5;
        if (_quests[index]['type'] == 'knowledge') _knowledge += 5;
        if (_quests[index]['type'] == 'energy') _energy += 5;

        while (_xp >= _xpPerLevel) {
          _level++;
          _xp -= _xpPerLevel;
        }
      }
    });
    _saveStats();
  }

  void _resetDay() {
    setState(() {
      for (var q in _quests) { q['isDone'] = false; }
      _streak += 1;
    });
    _saveStats();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0F0F0F),
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            expandedHeight: 250,
            pinned: true,
            flexibleSpace: FlexibleSpaceBar(
              background: Container(
                decoration: const BoxDecoration(
                  gradient: LinearGradient(colors: [Colors.deepPurple, Color(0xFF0F0F0F)], begin: Alignment.topCenter, end: Alignment.bottomCenter),
                ),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const SizedBox(height: 40),
                    GestureDetector(
                      onTap: _pickImage,
                      child: CircleAvatar(
                        radius: 45,
                        backgroundColor: Colors.white10,
                        backgroundImage: _webImage != null ? MemoryImage(_webImage!) : null,
                        child: _webImage == null ? const Icon(Icons.add_a_photo, color: Colors.cyanAccent) : null,
                      ),
                    ),
                    const SizedBox(height: 10),
                    Text(_heroName, style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold, letterSpacing: 1)),
                    Text("LEVEL $_level", style: const TextStyle(color: Colors.cyanAccent, fontWeight: FontWeight.bold)),
                    const SizedBox(height: 10),
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 60),
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
                  leading: Icon(
                    _quests[i]['type'] == 'knowledge' ? Icons.school : Icons.directions_run,
                    color: _quests[i]['isDone'] ? Colors.green : Colors.cyanAccent,
                  ),
                  title: Text(_quests[i]['title'], style: const TextStyle(fontWeight: FontWeight.bold)),
                  subtitle: Text(_quests[i]['desc']),
                  trailing: _quests[i]['isDone'] ? const Icon(Icons.check_circle, color: Colors.green) : Text("+${_quests[i]['xp']} XP"),
                  onTap: () => _handleQuestTap(i),
                ),
              ),
              childCount: _quests.length,
            ),
          ),
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(30.0),
              child: OutlinedButton(
                onPressed: _resetDay,
                style: OutlinedButton.styleFrom(foregroundColor: Colors.cyanAccent, side: const BorderSide(color: Colors.cyanAccent)),
                child: const Text("START NEW DAY"),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatCard(String label, int value, IconData icon, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 8),
      width: 100,
      decoration: BoxDecoration(color: Colors.white.withOpacity(0.05), borderRadius: BorderRadius.circular(12), border: Border.all(color: color.withOpacity(0.2))),
      child: Column(children: [Icon(icon, size: 20, color: color), const SizedBox(height: 4), Text(label, style: const TextStyle(fontSize: 9, color: Colors.white38)), Text("$value", style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold))]),
    );
  }
}