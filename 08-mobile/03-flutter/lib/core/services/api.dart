import 'dart:convert';

import 'package:http/http.dart' as http;
import 'package:lemoncode_demo/core/models/character.dart';

class CharactersApi {
  String mainUrl = "https://rickandmortyapi.com/api/";

  Future<List<Character>> getCharacters() async {
    String apiCharacters = "$mainUrl/character";
    var response = await http.get(apiCharacters);
    var characters = List<Character>();

    if (response.statusCode == 200) {
      var jsonResponse = jsonDecode(response.body);
      var results = jsonResponse['results'] as List;
      characters = results.map((e) => Character.fromMap(e)).toList();
    }
    return characters;
  }
}
