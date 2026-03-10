import 'dart:async';
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:image_picker/image_picker.dart';
import 'package:path_provider/path_provider.dart';
import 'package:path/path.dart' as path;

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
  
  String? _imagePath; 

  List<Map<String, dynamic>> _quests = [
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
      _streak = prefs.getInt('streak') ?? 0;
      _imagePath = prefs.getString('profileImage'); 
    });
    if (_imagePath != null) {
       print("DEBUG: Loading image from: $_imagePath");
    }
  }

  Future<void> _saveStats() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setInt('xp', _xp);
    await prefs.setInt('level', _level);
    await prefs.setInt('physical', _physical);
    await prefs.setInt('knowledge', _knowledge);
    await prefs.setInt('energy', _energy);
    await prefs.setInt('streak', _streak);
    if (_imagePath != null) {
      await prefs.setString('profileImage', _imagePath!);
    }
  }

  Future<void> _pickImage() async {
    try {
      final ImagePicker picker = ImagePicker();
      final XFile? image = await picker.pickImage(source: ImageSource.gallery);
      
      if (image != null) {
        final directory = await getApplicationDocumentsDirectory();
        final String fileName = "profile_${DateTime.now().millisecondsSinceEpoch}.png";
        final String permanentPath = path.join(directory.path, fileName);

        final File localImage = await File(image.path).copy(permanentPath);

        setState(() {
          _imagePath = localImage.path;
        });
        await _saveStats();
        print("DEBUG: Image saved successfully at $permanentPath");
      }
    } catch (e) {
      print("DEBUG: Error picking image: $e");
    }
  }

  String _getHeroTitle() {
    if (_level >= 50) return "IMMORTAL LEGEND";
    if (_level >= 30) return "GRANDMASTER";
    if (_level >= 20) return "CONQUEROR";
    if (_level >= 10) return "MASTER OF LIFE";
    if (_level >= 7) return "ELITE ACHIEVER";
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
        if (_quests[index]['type'] == 'boss') {
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
    bool hasImage = _imagePath != null && File(_imagePath!).existsSync();

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
                            backgroundImage: hasImage ? FileImage(File(_imagePath!)) : null,
                            child: !hasImage 
                                ? const Icon(Icons.person, color: Colors.cyanAccent, size: 50) 
                                : null,
                          ),
                          const CircleAvatar(
                            radius: 15, 
                            backgroundColor: Colors.cyanAccent, 
                            child: Icon(Icons.camera_alt, color: Colors.black, size: 16)
                          ),
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
                  leading: Icon(_quests[i]['type'] == 'boss' ? Icons.emoji_events : Icons.directions_run, color: _quests[i]['isDone'] ? Colors.green : Colors.cyanAccent),
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