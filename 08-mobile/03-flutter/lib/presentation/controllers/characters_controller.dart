import 'package:flutter/material.dart';
import 'package:lemoncode_demo/core/models/character.dart';
import 'package:lemoncode_demo/core/services/api.dart';
import 'package:meta/meta.dart';

enum PageState {
  UNINITIALIZED,
  LOADING,
  FETCHED,
}

class CharactersController with ChangeNotifier {
  final CharactersApi charactersApi;
  List<Character> characters;
  var pageState = PageState.UNINITIALIZED;

  CharactersController({@required this.charactersApi}) {
    loadCharacters();
  }

  loadCharacters() async {
    _changePageState(PageState.LOADING);
    characters = await charactersApi.getCharacters();
    _changePageState(PageState.FETCHED);
  }

  _changePageState(PageState newPageState) {
    pageState = newPageState;
    notifyListeners();
  }
}
