class Character {
  String name;
  String image;
  bool favorite;
  String status;
  Character({
    this.name,
    this.image,
    this.favorite,
    this.status,
  });

  factory Character.fromMap(Map<String, dynamic> map) {
    if (map == null) return null;

    return Character(
      name: map['name'],
      image: map['image'],
      favorite: map['favorite'] ?? false,
      status: map['status'],
    );
  }
}
