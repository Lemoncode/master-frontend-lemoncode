import 'dart:convert';

import 'package:http/http.dart' as http;
import 'package:sample_app/model.dart';

Future<User> fetchGithubUser(String login) async {
  final response =
      await http.get(Uri.parse('https://api.github.com/users/$login'));

  if (response.statusCode == 200) {
    // If the server did return a 200 OK response,
    // then parse the JSON.
    var jsonResponse = jsonDecode(response.body);
    return User.fromJson(jsonResponse);
  } else {
    // If the server did not return a 200 OK response,
    // then throw an exception.
    throw Exception('Failed to load character list');
  }
}
