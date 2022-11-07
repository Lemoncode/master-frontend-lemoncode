import 'package:flutter/material.dart';
import 'package:sample_app/api.dart';
import 'package:sample_app/model.dart';

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
        body: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: const [UserInfo()]),
      ),
    );
  }
}

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
    return FutureBuilder<User>(
      future: user,
      builder: (context, snapshot) {
        if (snapshot.hasData) {
          return Column(children: [
            CircleAvatar(
              backgroundImage: NetworkImage(snapshot.data!.avatarUrl),
              radius: 120,
            ),
            Text(snapshot.data!.name),
            Text(snapshot.data!.company),
            Text(snapshot.data!.bio),
          ]);
        } else if (snapshot.hasError) {
          return Text('${snapshot.error}');
        }

        // By default, show a loading spinner.
        return const Center(child: CircularProgressIndicator());
      },
    );
  }
}
