class UserModel {
  final String id;
  final String email;
  final String? name;
  final String? mobile;
  final String? avatarUrl;
  final String? createdAt;

  UserModel({
    required this.id,
    required this.email,
    this.name,
    this.mobile,
    this.avatarUrl,
    this.createdAt,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['_id'] ?? json['id'] ?? '',
      email: json['email'] ?? '',
      name: json['name'] ?? json['username'],
      mobile: json['mobile'],
      avatarUrl: json['avatarUrl'],
      createdAt: json['createdAt'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'email': email,
      'name': name,
      'mobile': mobile,
      'avatarUrl': avatarUrl,
      'createdAt': createdAt,
    };
  }
}
