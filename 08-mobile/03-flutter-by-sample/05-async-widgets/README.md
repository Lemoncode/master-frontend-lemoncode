# Async Widgets

Partimos del ejemplo [02-boilerplate](../02-boilerplate/README.md) y vamos a ver como podemos hacer que los widgets se carguen de forma asíncrona, haciendo una petición a una API (por ejemplo la de Github).

Para esto vamos a utilizar _FutureBuilder_, que nos permite construir un widget a partir de un _Future_, y que se actualiza cuando el Future cambia de estado:

[Async Widgets](https://docs.flutter.dev/development/ui/widgets/async)

Primero vamos a crear nuestra llamada a la api. Para esto necesitamos instalar el paquete [http](https://pub.dev/packages/http):

```bash
flutter pub add http
```

Vamos a utilizar la API de Github para traer la información de un usuario: https://api.github.com/users/v-borrego

Primero creamos el modelo de datos:

_model.dart_

```dart
class User {
  final int id;
  final String login;
  final String avatarUrl;
  final String name;
  final String company;
  final String bio;

  const User({
    required this.id,
    required this.login,
    required this.avatarUrl,
    required this.name,
    required this.company,
    required this.bio,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'],
      login: json['login'],
      avatarUrl: json['avatar_url'],
      name: json['name'],
      company: json['company'],
      bio: json['bio'],
    );
  }
}
```

Y luego creamos la llamada a la API:

_api.dart_

```dart
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
```

Ya podemos utilizarlo desde un nuevo StatefulWidget _UserInfo_:

_main.dart_

```dart
class UserInfo extends StatefulWidget {
  const UserInfo({Key? key}) : super(key: key);

  @override
  State<UserInfo> createState() => _UserInfoState();
}

class _UserInfoState extends State<UserInfo> {
  @override
  Widget build(BuildContext context) {
    return Container();
  }
}
```

Añadimos el estado para `user` y la llamada al servicio:

```diff
class UserInfo extends StatefulWidget {
  const UserInfo({Key? key}) : super(key: key);

  @override
  State<UserInfo> createState() => _UserInfoState();
}

class _UserInfoState extends State<UserInfo> {
+  late Future<User> user;

+  @override
+  void initState() {
+    super.initState();
+    user = fetchGithubUser("v-borrego");
+  }

  @override
  Widget build(BuildContext context) {
    return Container();
  }
}
```

Y utilizamos `FutureBuilder` para construir el widget:

```diff
class UserInfo extends StatefulWidget {
  const UserInfo({Key? key}) : super(key: key);

  @override
  State<UserInfo> createState() => _UserInfoState();
}

class _UserInfoState extends State<UserInfo> {
  late Future<User> user;

  @override
  void initState() {
    super.initState();
    user = fetchGithubUser("v-borrego");
  }

  @override
  Widget build(BuildContext context) {
-    return Container();
+    return FutureBuilder<User>(
+      future: user,
+      builder: (context, snapshot) {
+        if (snapshot.hasData) {
+          return Column(children: [
+            CircleAvatar(
+              backgroundImage: NetworkImage(snapshot.data!.avatarUrl),
+              radius: 120,
+            ),
+            Text(snapshot.data!.name),
+            Text(snapshot.data!.company),
+            Text(snapshot.data!.bio),
+          ]);
+        } else if (snapshot.hasError) {
+          return Text('${snapshot.error}');
+        }
+
+        // By default, show a loading spinner.
+        return const Center(child: CircularProgressIndicator());
+      },
+    );
  }
}
```

# ¿Te apuntas a nuestro máster?

Si te ha gustado este ejemplo y tienes ganas de aprender Front End guiado por un grupo de profesionales ¿Por qué no te apuntas a nuestro [Máster Front End Online Lemoncode](https://lemoncode.net/master-frontend#inicio-banner)? Tenemos tanto edición de convocatoria con clases en vivo, como edición continua con mentorización, para que puedas ir a tu ritmo y aprender mucho.

Si lo que te gusta es el mundo del _backend_ también puedes apuntante a nuestro [Bootcamp backend online Lemoncode](https://lemoncode.net/bootcamp-backend#bootcamp-backend/inicio).

Y si tienes ganas de meterte una zambullida en el mundo _devops_ apuntate nuestro [Bootcamp devops online Lemoncode](https://lemoncode.net/bootcamp-devops#bootcamp-devops/inicio).
