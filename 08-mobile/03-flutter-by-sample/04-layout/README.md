# Layout

Flutter nos proporciona ciertos Widgets para ayudarnos a organizar los Widgets de nuestra aplicación:

https://docs.flutter.dev/development/ui/widgets/layout

Estos Widgets no renderizan nada por si mismos, sino que organizan en la pantalla a otros Widgets (children). Se dividen en 3 categorías:

- Single-child layout widgets: Organizan a un solo Widget.
- Multi-child layout widgets: Organizan a varios Widgets.
- Slivers: Organizan a varios Widgets en un ScrollView.

Partiendo del ejemplo anterior [03-hello-flutter](../03-hello-flutter/README.md), vemos en el body de nuestra MaterialApp cómo utilizamos dos de estos Widgets (\_Center y Column):

```dart
  body: Center(
    child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: const <Widget>[Hello()]),
  ),
```

Además, Flutter nos ofrece Widgets para organizar la estructura y navegación de nuestra aplicación:

https://docs.flutter.dev/development/ui/widgets/material#App%20structure%20and%20navigation

Igualmente en el ejemplo anterior, vemos cómo estamos utilizando el Widget _Scaffold_ para dar el aspecto visual a la pantalla que estamos renderizando, con un _AppBar_ y contenido:

```dart
  home: Scaffold(
    appBar: AppBar(
      title: const Text('Hello Flutter'),
    ),
    body: Center(
      child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: const <Widget>[Hello()]),
    ),
  ),
```

Vamos a añadir al _Scaffold_ de esta pantalla un botón flotante:


