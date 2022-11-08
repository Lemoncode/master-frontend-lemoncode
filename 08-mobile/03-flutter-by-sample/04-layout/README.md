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

_main.dart_

```diff
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
        body: Center(
          child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: const <Widget>[Hello()]),
        ),
+       floatingActionButton: FloatingActionButton(
+         onPressed: () {},
+         tooltip: 'Touch me',
+         child: const Icon(Icons.touch_app),
+       ),
      ),
    );
  }
}
```

# ¿Te apuntas a nuestro máster?

Si te ha gustado este ejemplo y tienes ganas de aprender Front End guiado por un grupo de profesionales ¿Por qué no te apuntas a nuestro [Máster Front End Online Lemoncode](https://lemoncode.net/master-frontend#inicio-banner)? Tenemos tanto edición de convocatoria con clases en vivo, como edición continua con mentorización, para que puedas ir a tu ritmo y aprender mucho.

Si lo que te gusta es el mundo del _backend_ también puedes apuntante a nuestro [Bootcamp backend online Lemoncode](https://lemoncode.net/bootcamp-backend#bootcamp-backend/inicio).

Y si tienes ganas de meterte una zambullida en el mundo _devops_ apuntate nuestro [Bootcamp devops online Lemoncode](https://lemoncode.net/bootcamp-devops#bootcamp-devops/inicio).
