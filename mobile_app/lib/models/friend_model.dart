import 'user_model.dart';

class FriendModel {
  final String id;
  final UserModel user;
  final double balance; // positive = they owe you, negative = you owe them

  FriendModel({
    required this.id,
    required this.user,
    required this.balance,
  });

  factory FriendModel.fromJson(Map<String, dynamic> json) {
    return FriendModel(
      id: json['_id'] ?? json['id'] ?? '',
      user: json['user'] is Map<String, dynamic>
          ? UserModel.fromJson(json['user'])
          : UserModel(
              id: json['_id'] ?? '',
              email: json['email'] ?? '',
              name: json['name'] ?? json['username'],
            ),
      balance: (json['balance'] as num?)?.toDouble() ?? 0.0,
    );
  }
}

class FriendRequestModel {
  final String id;
  final UserModel requester;
  final String status;
  final String? createdAt;

  FriendRequestModel({
    required this.id,
    required this.requester,
    required this.status,
    this.createdAt,
  });

  factory FriendRequestModel.fromJson(Map<String, dynamic> json) {
    return FriendRequestModel(
      id: json['_id'] ?? json['id'] ?? '',
      requester: json['requester'] is Map<String, dynamic>
          ? UserModel.fromJson(json['requester'])
          : UserModel(
              id: json['requester'] ?? '',
              email: '',
              name: json['requesterName'],
            ),
      status: json['status'] ?? 'pending',
      createdAt: json['createdAt'],
    );
  }
}
