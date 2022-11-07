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
