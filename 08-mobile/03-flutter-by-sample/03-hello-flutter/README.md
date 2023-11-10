# Hello Flutter

## Hello Widgets

Todo en Flutter es un Widget. Incluso la aplicación entera es un Widget.

Un Widget es una clase que hereda de `StatelessWidget` (sin estado, por ejemplo un `Text`) o `StatefulWidget` (con estado, por ejemplo un `Checkbox`).

Flutter tiene una gran cantidad de [Widgets predefinidos](https://docs.flutter.dev/development/ui/widgets), y podemos crear nuestros propios Widgets.

Hacer mención especial a los Widgets de [Material Components](https://docs.flutter.dev/development/ui/widgets/material), que siguen las líneas de Material Design, y los Widgets de [Cupertino](https://docs.flutter.dev/development/ui/widgets/cupertino), que siguen las líneas de iOS.

¿Podemos crear una aplicación con el estilo de Material para Android y el estilo de Cupertino para iOS? [Sí, pero el framework no nos lo ofrece "de fábrica"](https://medium.com/flutter/do-flutter-apps-dream-of-platform-aware-widgets-7d7ed7b4624d), y no es lo que vende Flutter. De hecho lo que vende es crear aplicaciones a medida, con el estilo que queramos, sin compromiso con un estilo en concreto por plataforma: https://flutter.dev/multi-platform/mobile

## Utilizar nuestro primer Widget

Vamos a añadir un botón. Para esto vamos a utiliar el Widget [ElevatedButton de Material Components](https://api.flutter.dev/flutter/material/ElevatedButton-class.html).

_main.dart_

```diff
import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

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
-       body: const Center(
+       body: Center(
          child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
-             children: <Widget>[Text('Hello World')]),
+             children: <Widget>[
+               const Text('Hello World'),
+               ElevatedButton(
+                 onPressed: () {
+                   debugPrint('Clicked!');
+                 },
+                 style: ElevatedButton.styleFrom(
+                   foregroundColor: Colors.white,
+                   backgroundColor: Colors.red,
+                 ),
+                 child: const Text('Click Me'),
+               ),
+             ]),
        ),
      ),
    );
  }
}
```

Ya vemos el comportamiento al hacer click en el nuevo botón.

## Crear nuestro primer Widget

Vamos a crear un nuevo Widget, que llamaremos `Hello`, y que contendrá un estado `name` con el nombre a saludar.

Nos puede ser util la extensión [Flutter Widget Snippets](https://marketplace.visualstudio.com/items?itemName=alexisvt.flutter-snippets) para crear el widget (escribiendo `fstless` para StatelessWidgets, o `fstful` para StatefulWidget):

```dart
class Hello extends StatefulWidget {
  const Hello({Key? key}) : super(key: key);

  @override
  State<Hello> createState() => _HelloState();
}

class _HelloState extends State<Hello> {
  @override
  Widget build(BuildContext context) {
    return Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: <Widget>[
          const Text('Hello World'),
          ElevatedButton(
            onPressed: () {
              debugPrint('Clicked!');
            },
            style: ElevatedButton.styleFrom(
              foregroundColor: Colors.white,
              backgroundColor: Colors.red,
            ),
            child: const Text('Click Me'),
          ),
        ]);
  }
}
```

Ya podemos utilizarlo desde `MyApp`:

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
-             children: <Widget>[
-               const Text('Hello World'),
-               ElevatedButton(
-                 onPressed: () {
-                   debugPrint('Clicked!');
-                 },
-                 style: ElevatedButton.styleFrom(
-                   foregroundColor: Colors.white,
-                   backgroundColor: Colors.red,
-                 ),
-                 child: const Text('Click Me'),
-               ),
-             ]),
+             children: const <Widget>[Hello()]),
        ),
      ),
    );
  }
}
```

## Estado

Ahora añadimos el estado `name`:

```diff
class Hello extends StatefulWidget {
  const Hello({Key? key}) : super(key: key);

  @override
  State<Hello> createState() => _HelloState();
}

class _HelloState extends State<Hello> {
+ String _name = 'World';

  @override
  Widget build(BuildContext context) {
    return Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: <Widget>[
-         const Text('Hello World'),
+         Text('Hello $_name'),
          ElevatedButton(
            onPressed: () {
-             debugPrint('Clicked!');
+             setState(() {
+               _name = 'Lemoncoders!!';
+             });
            },
            style: ElevatedButton.styleFrom(
              foregroundColor: Colors.white,
              backgroundColor: Colors.red,
            ),
            child: const Text('Click Me'),
          ),
        ]);
  }
}
```

Ahora podemos comprobar cómo el click del botón actualiza el estado y saludamos a los Lemoncoders!

## Props

Vamos a sustituir `Text('Hello $_name')` por un nuevo Widget `DisplayName` que recibirá el nombre a saludar como Prop.

> Nos ayudamos de fstless para crear un StatelessWidget:

```dart
class DisplayName extends StatelessWidget {
  const DisplayName({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container();
  }
}
```

Ahora añadimos la Prop `name`, y la mostramos:

```diff
class DisplayName extends StatelessWidget {
- const DisplayName({Key? key}) : super(key: key);
+ const DisplayName({Key? key, required this.name}) : super(key: key);

+ final String name;

  @override
  Widget build(BuildContext context) {
-   return Container();
+   return Text('Hello $name');
  }
}
```

Y ahora podemos utilizarlo desde `Hello`:

```diff
class _HelloState extends State<Hello> {
  String _name;

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: <Widget>[
-       Text('Hello $_name'),
+       DisplayName(name: _name),
        ElevatedButton(
          onPressed: () {
            setState(() {
              _name = 'Lemoncoders!!';
            });
          },
          style: ElevatedButton.styleFrom(
            foregroundColor: Colors.white,
            backgroundColor: Colors.red,
          ),
          child: const Text('Click Me'),
        ),
      ]);
  }
}
```

## Callback Props

Vamos a ver cómo podemos añadir `callback Props` para avisar al padre desde el widget hijo. Para esto vamos a crear un nuevo StatelessWidget `AlertButton`:

```dart
class AlertButton extends StatelessWidget {
  const AlertButton({Key? key, required this.text}) : super(key: key);

  final String text;

  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
      onPressed: () {},
      style: ElevatedButton.styleFrom(
        foregroundColor: Colors.white,
        backgroundColor: Colors.red,
      ),
      child: Text(text),
    );
  }
}
```

Ahora vamos a añadir un `callback Prop` para avisar al padre cuando se pulse el botón:

```diff
class AlertButton extends StatelessWidget {
- const AlertButton({Key? key, required this.text}) : super(key: key);
+ const AlertButton({Key? key, required this.text, required this.onPressed})
+     : super(key: key);

  final String text;
+ final VoidCallback onPressed;

  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
-     onPressed: () {},
+     onPressed: onPressed,
      style: ElevatedButton.styleFrom(
        foregroundColor: Colors.white,
        backgroundColor: Colors.red,
      ),
      child: Text(text),
    );
  }
}
```

Y lo utilizamos desde el Widget `Hello`:

```diff
class _HelloState extends State<Hello> {
  String _name = "World";

  @override
  Widget build(BuildContext context) {
    return Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: <Widget>[
          DisplayName(name: _name),
-         ElevatedButton(
-           onPressed: () {
-             setState(() {
-               _name = 'Lemoncoders!!';
-             });
-           },
-           style: ElevatedButton.styleFrom(
-             foregroundColor: Colors.white,
-             backgroundColor: Colors.red,
-           ),
-           child: const Text('Click Me'),
-         ),
+         AlertButton(
+          text: 'Change name',
+          onPressed: () {
+            setState(() {
+              _name = "Lemoncoders!!";
+            });
+         }),
        ]);
  }
}
```

# ¿Te apuntas a nuestro máster?

Si te ha gustado este ejemplo y tienes ganas de aprender Front End guiado por un grupo de profesionales ¿Por qué no te apuntas a nuestro [Máster Front End Online Lemoncode](https://lemoncode.net/master-frontend#inicio-banner)? Tenemos tanto edición de convocatoria con clases en vivo, como edición continua con mentorización, para que puedas ir a tu ritmo y aprender mucho.

Si lo que te gusta es el mundo del _backend_ también puedes apuntante a nuestro [Bootcamp backend online Lemoncode](https://lemoncode.net/bootcamp-backend#bootcamp-backend/inicio).

Y si tienes ganas de meterte una zambullida en el mundo _devops_ apuntate nuestro [Bootcamp devops online Lemoncode](https://lemoncode.net/bootcamp-devops#bootcamp-devops/inicio).
