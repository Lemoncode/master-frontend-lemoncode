import 'package:flutter/material.dart';
import 'package:lemoncode_demo/core/models/character.dart';
import 'package:lemoncode_demo/presentation/controllers/characters_controller.dart';
import 'package:lemoncode_demo/presentation/ui/character_detail_page.dart';
import 'package:provider/provider.dart';

class CharactersPage extends StatelessWidget {
  const CharactersPage({Key key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _CharactersBody(),
    );
  }
}

class _CharactersBody extends StatelessWidget {
  const _CharactersBody({Key key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final controller = context.watch<CharactersController>();
    final characters = controller.characters;
    final pageState = controller.pageState;
    if (pageState == PageState.LOADING || pageState == PageState.UNINITIALIZED)
      return Center(child: CircularProgressIndicator());
    if (characters == null || characters.isEmpty)
      return Center(
        child: Text("Oops, no hay personajes"),
      );

    return LayoutBuilder(
      builder: (context, constraints) {
        final width = constraints.maxWidth;
        final breakPointSM = 600;
        final breakPointMD = 960;
        final breakPointLG = 1280;
        if (width <= breakPointSM)
          return ListView.separated(
            itemCount: characters.length,
            itemBuilder: (context, index) => _CharacterListElement(
              character: characters[index],
            ),
            separatorBuilder: (context, index) => Container(
              height: 1,
              color: Colors.grey.shade200,
            ),
          );

        var elementsPerRow;
        var characterRatio;
        if (width < breakPointMD) {
          elementsPerRow = 3;
          characterRatio = 1.2;
        } else {
          elementsPerRow = 4;
          characterRatio = 1.5;
        }
        return GridView.count(
          crossAxisCount: elementsPerRow,
          childAspectRatio: characterRatio,
          children: characters
              .map((e) => _CharacterListElement(
                    character: e,
                  ))
              .toList(),
        );
      },
    );
  }
}

class _CharacterListElement extends StatelessWidget {
  const _CharacterListElement({
    Key key,
    this.character,
  }) : super(key: key);

  final Character character;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: () => Navigator.of(context).push(MaterialPageRoute(
        builder: (context) => CharacterDetailsPage(
          character: character,
        ),
      )),
      child: Padding(
        padding: const EdgeInsets.all(8.0),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Hero(
              tag: "image_hero_${character.name}",
              child: CircleAvatar(
                radius: 45.0,
                backgroundImage: NetworkImage(character.image),
                backgroundColor: Colors.transparent,
              ),
            ),
            SizedBox(
              width: 30,
            ),
            Flexible(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  Flexible(
                    child: Text(
                      character.name,
                      overflow: TextOverflow.ellipsis,
                      style:
                          TextStyle(fontSize: 21, fontWeight: FontWeight.bold),
                    ),
                  ),
                  _CharacterStatus(status: character.status),
                ],
              ),
            ),
          ],
        ),
      ),
    );
    return ListTile(
      leading: CircleAvatar(
        radius: 30.0,
        backgroundImage: NetworkImage(character.image),
        backgroundColor: Colors.transparent,
      ),
      title: Text(
        character.name,
      ),
    );
  }
}

class _CharacterStatus extends StatelessWidget {
  const _CharacterStatus({
    Key key,
    this.status,
  }) : super(key: key);

  final String status;

  @override
  Widget build(BuildContext context) {
    var color;
    switch (status) {
      case "Alive":
        color = Colors.green.shade300;
        break;
      case "Dead":
        color = Colors.red.shade300;
        break;
      default:
        color = Colors.grey;
    }

    return Chip(
      label: Text(
        status,
        style: TextStyle(color: Colors.white),
      ),
      backgroundColor: color,
    );
  }
}
