import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../../models/friend_model.dart';
import '../../services/friend_service.dart';
import '../../theme/app_theme.dart';
import '../../widgets/add_friend_modal.dart';
import '../../widgets/glass_card.dart';

class FriendsTab extends StatefulWidget {
  const FriendsTab({super.key});

  @override
  State<FriendsTab> createState() => _FriendsTabState();
}

class _FriendsTabState extends State<FriendsTab>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;
  List<FriendModel> _friends = [];
  List<FriendRequestModel> _pendingRequests = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
    _loadData();
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  Future<void> _loadData() async {
    setState(() => _isLoading = true);
    try {
      final friendsFuture = FriendService.getFriends();
      final requestsFuture = FriendService.getPendingRequests();

      final results = await Future.wait([friendsFuture, requestsFuture]);
      setState(() {
        _friends = results[0] as List<FriendModel>;
        _pendingRequests = results[1] as List<FriendRequestModel>;
        _isLoading = false;
      });
    } catch (_) {
      setState(() => _isLoading = false);
    }
  }

  Future<void> _acceptRequest(String id) async {
    try {
      await FriendService.acceptRequest(id);
      _loadData();
    } catch (_) {}
  }

  Future<void> _declineRequest(String id) async {
    try {
      await FriendService.declineRequest(id);
      _loadData();
    } catch (_) {}
  }

  void _openAddFriend() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => AddFriendModal(onFriendAdded: _loadData),
    );
  }

  final currencyFormatter = NumberFormat.currency(symbol: '₹', decimalDigits: 2);

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Column(
        children: [
          // Header & Add Button
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Friends',
                  style: TextStyle(
                    color: AppColors.textPrimary,
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                IconButton(
                  icon: const Icon(Icons.person_add, color: AppColors.actionRed),
                  onPressed: _openAddFriend,
                ),
              ],
            ),
          ),

          // Custom Tab Bar
          Container(
            margin: const EdgeInsets.symmetric(horizontal: 20),
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.04),
              borderRadius: BorderRadius.circular(16),
            ),
            child: TabBar(
              controller: _tabController,
              indicatorColor: AppColors.actionRed,
              indicator: BoxDecoration(
                color: AppColors.actionRed.withOpacity(0.2),
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: AppColors.actionRed.withOpacity(0.4)),
              ),
              labelColor: AppColors.actionRed,
              unselectedLabelColor: AppColors.textMuted,
              labelStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
              tabs: [
                Tab(text: 'My Friends (${_friends.length})'),
                Tab(text: 'Requests (${_pendingRequests.length})'),
              ],
            ),
          ),

          const SizedBox(height: 16),

          // Tab Views
          Expanded(
            child: _isLoading
                ? const Center(
                    child: CircularProgressIndicator(color: AppColors.actionRed))
                : TabBarView(
                    controller: _tabController,
                    children: [
                      // Friends List
                      _friends.isEmpty
                          ? const Center(
                              child: Text(
                                'No friends yet. Tap + to add friends!',
                                style: TextStyle(color: AppColors.textMuted),
                              ),
                            )
                          : ListView.separated(
                              padding: const EdgeInsets.symmetric(horizontal: 20),
                              itemCount: _friends.length,
                              separatorBuilder: (_, __) => const SizedBox(height: 10),
                              itemBuilder: (context, index) {
                                final f = _friends[index];
                                return GlassCard(
                                  child: Row(
                                    children: [
                                      CircleAvatar(
                                        backgroundColor:
                                            AppColors.actionRed.withOpacity(0.15),
                                        child: Text(
                                          (f.user.name ?? f.user.email)[0].toUpperCase(),
                                          style: const TextStyle(
                                            color: AppColors.actionRed,
                                            fontWeight: FontWeight.bold,
                                          ),
                                        ),
                                      ),
                                      const SizedBox(width: 14),
                                      Expanded(
                                        child: Column(
                                          crossAxisAlignment: CrossAxisAlignment.start,
                                          children: [
                                            Text(
                                              f.user.name ?? f.user.email,
                                              style: const TextStyle(
                                                color: AppColors.textPrimary,
                                                fontWeight: FontWeight.bold,
                                                fontSize: 15,
                                              ),
                                            ),
                                            const SizedBox(height: 2),
                                            Text(
                                              f.user.email,
                                              style: const TextStyle(
                                                color: AppColors.textMuted,
                                                fontSize: 12,
                                              ),
                                            ),
                                          ],
                                        ),
                                      ),
                                      Column(
                                        crossAxisAlignment: CrossAxisAlignment.end,
                                        children: [
                                          Text(
                                            f.balance == 0
                                                ? 'Settled'
                                                : f.balance > 0
                                                    ? 'Owes you'
                                                    : 'You owe',
                                            style: TextStyle(
                                              color: f.balance > 0
                                                  ? AppColors.success
                                                  : f.balance < 0
                                                      ? AppColors.actionRed
                                                      : AppColors.textMuted,
                                              fontSize: 11,
                                              fontWeight: FontWeight.w600,
                                            ),
                                          ),
                                          const SizedBox(height: 2),
                                          Text(
                                            currencyFormatter.format(f.balance.abs()),
                                            style: TextStyle(
                                              color: f.balance > 0
                                                  ? AppColors.success
                                                  : f.balance < 0
                                                      ? AppColors.actionRed
                                                      : AppColors.textPrimary,
                                              fontWeight: FontWeight.bold,
                                              fontSize: 14,
                                            ),
                                          ),
                                        ],
                                      ),
                                    ],
                                  ),
                                );
                              },
                            ),

                      // Pending Requests
                      _pendingRequests.isEmpty
                          ? const Center(
                              child: Text(
                                'No pending friend requests',
                                style: TextStyle(color: AppColors.textMuted),
                              ),
                            )
                          : ListView.separated(
                              padding: const EdgeInsets.symmetric(horizontal: 20),
                              itemCount: _pendingRequests.length,
                              separatorBuilder: (_, __) => const SizedBox(height: 10),
                              itemBuilder: (context, index) {
                                final req = _pendingRequests[index];
                                return GlassCard(
                                  child: Row(
                                    children: [
                                      CircleAvatar(
                                        backgroundColor:
                                            AppColors.actionRed.withOpacity(0.15),
                                        child: Text(
                                          (req.requester.name ??
                                              req.requester.email)[0].toUpperCase(),
                                          style: const TextStyle(
                                            color: AppColors.actionRed,
                                            fontWeight: FontWeight.bold,
                                          ),
                                        ),
                                      ),
                                      const SizedBox(width: 12),
                                      Expanded(
                                        child: Column(
                                          crossAxisAlignment: CrossAxisAlignment.start,
                                          children: [
                                            Text(
                                              req.requester.name ?? req.requester.email,
                                              style: const TextStyle(
                                                color: AppColors.textPrimary,
                                                fontWeight: FontWeight.bold,
                                                fontSize: 14,
                                              ),
                                            ),
                                            const SizedBox(height: 2),
                                            const Text(
                                              'Sent you a request',
                                              style: TextStyle(
                                                color: AppColors.textMuted,
                                                fontSize: 12,
                                              ),
                                            ),
                                          ],
                                        ),
                                      ),
                                      IconButton(
                                        icon: const Icon(Icons.check_circle,
                                            color: AppColors.success),
                                        onPressed: () => _acceptRequest(req.id),
                                      ),
                                      IconButton(
                                        icon: const Icon(Icons.cancel,
                                            color: AppColors.actionRed),
                                        onPressed: () => _declineRequest(req.id),
                                      ),
                                    ],
                                  ),
                                );
                              },
                            ),
                    ],
                  ),
          ),
        ],
      ),
    );
  }
}
