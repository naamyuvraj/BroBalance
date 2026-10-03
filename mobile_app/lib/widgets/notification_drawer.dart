import 'package:flutter/material.dart';
import '../models/notification_model.dart';
import '../services/notification_service.dart';
import '../theme/app_theme.dart';

class NotificationDrawer extends StatefulWidget {
  const NotificationDrawer({super.key});

  @override
  State<NotificationDrawer> createState() => _NotificationDrawerState();
}

class _NotificationDrawerState extends State<NotificationDrawer> {
  List<NotificationModel> _notifications = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _fetch();
  }

  Future<void> _fetch() async {
    try {
      final list = await NotificationService.getNotifications();
      setState(() {
        _notifications = list;
        _isLoading = false;
      });
    } catch (_) {
      setState(() => _isLoading = false);
    }
  }

  Future<void> _markAllRead() async {
    try {
      await NotificationService.markAllAsRead();
      _fetch();
    } catch (_) {}
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      height: MediaQuery.of(context).size.height * 0.75,
      padding: const EdgeInsets.all(24),
      decoration: const BoxDecoration(
        color: Color(0xFF141414),
        borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'Notifications',
                style: TextStyle(
                  color: AppColors.textPrimary,
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                ),
              ),
              Row(
                children: [
                  TextButton(
                    onPressed: _markAllRead,
                    child: const Text(
                      'Mark all read',
                      style: TextStyle(color: AppColors.actionRed, fontSize: 13),
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.close, color: AppColors.textMuted),
                    onPressed: () => Navigator.of(context).pop(),
                  ),
                ],
              ),
            ],
          ),
          const SizedBox(height: 16),

          Expanded(
            child: _isLoading
                ? const Center(
                    child: CircularProgressIndicator(color: AppColors.actionRed))
                : _notifications.isEmpty
                    ? const Center(
                        child: Text(
                          'No notifications yet',
                          style: TextStyle(color: AppColors.textMuted),
                        ),
                      )
                    : ListView.separated(
                        itemCount: _notifications.length,
                        separatorBuilder: (ctx, idx) =>
                            const Divider(color: Color(0xFF262626), height: 1),
                        itemBuilder: (context, index) {
                          final item = _notifications[index];
                          return ListTile(
                            contentPadding: const EdgeInsets.symmetric(
                                vertical: 8, horizontal: 4),
                            leading: CircleAvatar(
                              backgroundColor: item.isRead
                                  ? Colors.white.withOpacity(0.05)
                                  : AppColors.actionRed.withOpacity(0.15),
                              child: Icon(
                                Icons.notifications_none,
                                color: item.isRead
                                    ? AppColors.textMuted
                                    : AppColors.actionRed,
                                size: 20,
                              ),
                            ),
                            title: Text(
                              item.title,
                              style: TextStyle(
                                color: AppColors.textPrimary,
                                fontWeight: item.isRead
                                    ? FontWeight.normal
                                    : FontWeight.bold,
                                fontSize: 14,
                              ),
                            ),
                            subtitle: Text(
                              item.message,
                              style: const TextStyle(
                                  color: AppColors.textSecondary, fontSize: 12),
                            ),
                            onTap: () async {
                              if (!item.isRead) {
                                await NotificationService.markAsRead(item.id);
                                _fetch();
                              }
                            },
                          );
                        },
                      ),
          ),
        ],
      ),
    );
  }
}
