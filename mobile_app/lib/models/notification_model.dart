class NotificationModel {
  final String id;
  final String title;
  final String message;
  final bool isRead;
  final String? type;
  final String? createdAt;

  NotificationModel({
    required this.id,
    required this.title,
    required this.message,
    required this.isRead,
    this.type,
    this.createdAt,
  });

  factory NotificationModel.fromJson(Map<String, dynamic> json) {
    return NotificationModel(
      id: json['_id'] ?? json['id'] ?? '',
      title: json['title'] ?? 'Notification',
      message: json['message'] ?? '',
      isRead: json['isRead'] ?? json['read'] ?? false,
      type: json['type'],
      createdAt: json['createdAt'],
    );
  }
}
