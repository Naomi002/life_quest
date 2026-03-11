import 'dart:async';
import 'dart:typed_data'; // New: Required for Chrome memory
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
  int _focusProgress = 0;
  int _streak = 0;
  final int _xpPerLevel = 100;

  int _physical = 10;
  int _knowledge = 10;
  int _energy = 10;
  
  Uint8List? _webImage; // New: Stores image data for Chrome

  List<Map<String, dynamic>> _quests = [
    {"title": "Morning Walk", "desc": "Completed 4,000 steps today", "xp": 40, "isDone": false},
    {"title": "Social Connection", "desc": "Had a meaningful conversation", "xp": 30, "isDone": false},
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
      _streak = prefs.getInt('streak') ?? 0;
      
      // Note: On web, persisting images in SharedPreferences is difficult.
      // For now, this will allow you to see the photo while the tab is open.
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
  }

  // --- CHROME COMPATIBLE IMAGE PICKER ---
  Future<void> _pickImage() async {
    final ImagePicker picker = ImagePicker();
    final XFile? image = await picker.pickImage(source: ImageSource.gallery);
    
    if (image != null) {
      var f = await image.readAsBytes();
      setState(() {
        _webImage = f;
      });
      print("✅ Chrome: Image loaded into memory!");
    }
  }

  String _getHeroTitle() {
    if (_level >= 10) return "MASTER OF LIFE";
    if (_level >= 4) return "ACCOMPLISHED";
    return "NOVICE";
  }

  void _resetQuests() {
    setState(() {
      for (var quest in _quests) {
        quest['isDone'] = false;
      }
      _streak += 1;
    });
    _saveStats();
  }

  void _handleQuestTap(int index) {
    setState(() {
      if (_quests[index]['isDone']) {
        _quests[index]['isDone'] = false;
        _xp -= _quests[index]['xp'] as int;
        if (_xp < 0) _xp = 0;
      } else {
        if (_quests[index]['title'] == "Study Session") {
          _startFocusChallenge();
        } else {
          _completeQuest(index);
        }
      }
    });
    _saveStats();
  }

  void _completeQuest(int index) {
    setState(() {
      _quests[index]['isDone'] = true;
      _xp += _quests[index]['xp'] as int;
      if (_quests[index]['title'] == "Study Session") _knowledge += 5;
      if (_quests[index]['title'] == "Morning Walk") _energy += 5;
      if (_quests[index]['title'] == "Social Connection") _physical += 3;

      while (_xp >= _xpPerLevel) {
        _level++;
        _xp -= _xpPerLevel;
      }
    });
    _saveStats();
  }

  void _startFocusChallenge() {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => StatefulBuilder(
        builder: (context, setDialogState) => AlertDialog(
          backgroundColor: const Color(0xFF1A1A1A),
          title: const Text("FOCUS CHALLENGE"),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(Icons.psychology, size: 60, color: Colors.cyanAccent),
              const SizedBox(height: 20),
              LinearProgressIndicator(value: _focusProgress / 100, color: Colors.cyanAccent),
              const SizedBox(height: 10),
              Text("Focus Level: $_focusProgress%"),
            ],
          ),
          actions: [
            ElevatedButton(
              onPressed: () {
                setDialogState(() {
                  _focusProgress += 25;
                  if (_focusProgress >= 100) {
                    Navigator.pop(context);
                    _completeQuest(2);
                    _focusProgress = 0;
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

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF121212),
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            expandedHeight: 280,
            pinned: true,
            flexibleSpace: FlexibleSpaceBar(
              background: Container(
                decoration: const BoxDecoration(
                  gradient: LinearGradient(colors: [Colors.deepPurple, Color(0xFF121212)], begin: Alignment.topCenter, end: Alignment.bottomCenter),
                ),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const SizedBox(height: 60),
                    GestureDetector(
                      onTap: _pickImage,
                      child: Stack(
                        alignment: Alignment.bottomRight,
                        children: [
                          CircleAvatar(
                            radius: 50,
                            backgroundColor: Colors.white10,
                            // Use Image.memory for Chrome compatibility
                            backgroundImage: _webImage != null ? MemoryImage(_webImage!) : null,
                            child: _webImage == null 
                                ? const Icon(Icons.add_a_photo, color: Colors.cyanAccent, size: 30) 
                                : null,
                          ),
                          const CircleAvatar(radius: 15, backgroundColor: Colors.black, child: Icon(Icons.edit, color: Colors.cyanAccent, size: 16)),
                        ],
                      ),
                    ),
                    const SizedBox(height: 15),
                    Text("LEVEL $_level", style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
                    Text(_getHeroTitle(), style: const TextStyle(fontSize: 12, color: Colors.cyanAccent, letterSpacing: 2)),
                    const SizedBox(height: 10),
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 60),
                      child: LinearProgressIndicator(value: _xp / _xpPerLevel, color: Colors.cyanAccent),
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
                  leading: Icon(Icons.directions_run, color: _quests[i]['isDone'] ? Colors.green : Colors.cyanAccent),
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
              child: OutlinedButton.icon(
                onPressed: _resetQuests,
                icon: const Icon(Icons.refresh),
                label: const Text("START NEW DAY"),
                style: OutlinedButton.styleFrom(foregroundColor: Colors.cyanAccent, side: const BorderSide(color: Colors.cyanAccent)),
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