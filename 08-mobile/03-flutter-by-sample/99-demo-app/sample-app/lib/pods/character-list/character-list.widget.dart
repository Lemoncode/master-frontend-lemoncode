import 'package:flutter/material.dart';
import 'package:sample_app/pods/character-list/character-list.api.dart';
import 'package:sample_app/pods/character-list/character-list.model.dart';

class CharacterListWidget extends StatefulWidget {
  const CharacterListWidget({Key? key}) : super(key: key);

  @override
  State<CharacterListWidget> createState() => _CharacterListWidgetState();
}

class _CharacterListWidgetState extends State<CharacterListWidget> {
  late Future<List<Character>> list;

  @override
  void initState() {
    super.initState();
    list = fetchCharacterList();
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<List<Character>>(
      future: list,
      builder: (context, snapshot) {
        if (snapshot.hasData) {
          return ListView.builder(
              itemCount: snapshot.data!.length,
              itemBuilder: ((context, index) => ListTile(
                    leading: CircleAvatar(
                      backgroundImage:
                          NetworkImage(snapshot.data![index].image),
                      backgroundColor: Colors.transparent,
                    ),
                    title: Text(snapshot.data![index].name),
                    subtitle: Text(snapshot.data![index].status),
                  )));
        } else if (snapshot.hasError) {
          return Text('${snapshot.error}');
        }

        // By default, show a loading spinner.
        return const CircularProgressIndicator();
      },
    );
  }
}
