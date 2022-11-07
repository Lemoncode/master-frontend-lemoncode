import 'package:flutter/material.dart';
import 'package:sample_app/screens/character-list.screen.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
        title: 'Lemoncode - Flutter by sample',
        theme: ThemeData(
          primarySwatch: Colors.blue,
        ),
        home: Scaffold(
          appBar: AppBar(
            title: const Text('Lemoncode - Flutter by sample'),
          ),
          body: const CharacterListScreen(),
        ));
  }
}
