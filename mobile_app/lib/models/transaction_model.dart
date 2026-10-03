import 'user_model.dart';

class TransactionModel {
  final String id;
  final UserModel lender;
  final UserModel borrower;
  final double amount;
  final String description;
  final String status; // 'pending' | 'paid' | 'settled'
  final String? createdAt;

  TransactionModel({
    required this.id,
    required this.lender,
    required this.borrower,
    required this.amount,
    required this.description,
    required this.status,
    this.createdAt,
  });

  factory TransactionModel.fromJson(Map<String, dynamic> json) {
    return TransactionModel(
      id: json['_id'] ?? json['id'] ?? '',
      lender: json['lender'] is Map<String, dynamic>
          ? UserModel.fromJson(json['lender'])
          : UserModel(id: json['lender'] ?? '', email: ''),
      borrower: json['borrower'] is Map<String, dynamic>
          ? UserModel.fromJson(json['borrower'])
          : UserModel(id: json['borrower'] ?? '', email: ''),
      amount: (json['amount'] as num?)?.toDouble() ?? 0.0,
      description: json['description'] ?? 'Expense',
      status: json['status'] ?? 'pending',
      createdAt: json['createdAt'],
    );
  }
}

class DashboardStats {
  final double totalFriends;
  final double toReceive;
  final double toPay;
  final double netBalance;

  DashboardStats({
    required this.totalFriends,
    required this.toReceive,
    required this.toPay,
    required this.netBalance,
  });

  factory DashboardStats.fromJson(Map<String, dynamic> json) {
    final receive = (json['toReceive'] as num?)?.toDouble() ?? 0.0;
    final pay = (json['toPay'] as num?)?.toDouble() ?? 0.0;
    final friends = (json['totalFriends'] as num?)?.toDouble() ?? 0.0;
    return DashboardStats(
      totalFriends: friends,
      toReceive: receive,
      toPay: pay,
      netBalance: receive - pay,
    );
  }
}
