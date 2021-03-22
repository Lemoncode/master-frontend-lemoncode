import 'package:flutter/material.dart';
import 'package:lemoncode_demo/core/models/character.dart';

class CharacterDetailsPage extends StatelessWidget {
  const CharacterDetailsPage({Key key, this.character}) : super(key: key);

  final Character character;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      extendBodyBehindAppBar: true,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      body: Column(
        children: [
          Hero(
            tag: "image_hero_${character.name}",
            child: Container(
              width: MediaQuery.of(context).size.width,
              height: MediaQuery.of(context).size.height,
              child: Image.network(
                character.image,
                fit: BoxFit.fill,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
