import 'package:flutter/material.dart';

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
        body: const Center(
          child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: <Widget>[Text('Hello World')]),
        ),
      ),
    );
  }
}
