import '../models/notification_model.dart';
import 'api_service.dart';

class NotificationService {
  static Future<List<NotificationModel>> getNotifications() async {
    final res = await ApiService.get('/notification');
    final List list = res['data'] ?? [];
    return list.map((item) => NotificationModel.fromJson(item)).toList();
  }

  static Future<int> getUnreadCount() async {
    final res = await ApiService.get('/notification/unread-count');
    return (res['data']?['count'] as num?)?.toInt() ?? 0;
  }

  static Future<void> markAsRead(String notificationId) async {
    await ApiService.patch('/notification/$notificationId/read');
  }

  static Future<void> markAllAsRead() async {
    await ApiService.patch('/notification/read-all');
  }
}
