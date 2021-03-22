import 'package:flutter/material.dart';
import 'package:lemoncode_demo/core/services/api.dart';
import 'package:lemoncode_demo/presentation/controllers/characters_controller.dart';
import 'package:lemoncode_demo/presentation/ui/characters_page.dart';
import 'package:provider/provider.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        Provider(
          create: (context) => CharactersApi(),
        ),
        ChangeNotifierProvider(
          create: (context) => CharactersController(
              charactersApi: context.read<CharactersApi>()),
        ),
      ],
      builder: (context, child) => MaterialApp(
        title: 'Flutter Demo',
        theme: ThemeData(),
        home: CharactersPage(),
      ),
    );
  }
}
