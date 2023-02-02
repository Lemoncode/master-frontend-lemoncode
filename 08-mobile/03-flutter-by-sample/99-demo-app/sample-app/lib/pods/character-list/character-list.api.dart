import 'dart:convert';

import 'package:http/http.dart' as http;
import 'package:sample_app/pods/character-list/character-list.model.dart';

Future<List<Character>> fetchCharacterList() async {
  final response =
      await http.get(Uri.parse('https://rickandmortyapi.com/api/character'));

  if (response.statusCode == 200) {
    // If the server did return a 200 OK response,
    // then parse the JSON.
    var jsonResponse = jsonDecode(response.body);
    var results = jsonResponse['results'] as List;
    return results.map((item) => Character.fromJson(item)).toList();
  } else {
    // If the server did not return a 200 OK response,
    // then throw an exception.
    throw Exception('Failed to load character list');
  }
}
