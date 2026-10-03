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
                    fontSize: 26,
                    fontWeight: FontWeight.bold,
                    letterSpacing: -0.5,
                  ),
                ),
                GestureDetector(
                  onTap: _openAddFriend,
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                    decoration: BoxDecoration(
                      gradient: AppColors.greenPrimaryGradient,
                      borderRadius: BorderRadius.circular(20),
                      boxShadow: [
                        BoxShadow(
                          color: AppColors.neonGreen.withOpacity(0.3),
                          blurRadius: 10,
                        ),
                      ],
                    ),
                    child: const Row(
                      children: [
                        Icon(Icons.person_add_alt_1_rounded,
                            color: Colors.black, size: 18),
                        SizedBox(width: 6),
                        Text(
                          'Add',
                          style: TextStyle(
                            color: Colors.black,
                            fontWeight: FontWeight.bold,
                            fontSize: 13,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),

          // Custom Capsule Tab Bar
          Container(
            margin: const EdgeInsets.symmetric(horizontal: 20),
            padding: const EdgeInsets.all(4),
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.04),
              borderRadius: BorderRadius.circular(24),
              border: Border.all(color: Colors.white.withOpacity(0.08)),
            ),
            child: TabBar(
              controller: _tabController,
              indicatorColor: Colors.transparent,
              dividerColor: Colors.transparent,
              indicator: BoxDecoration(
                color: AppColors.neonGreen.withOpacity(0.18),
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: AppColors.neonGreen.withOpacity(0.35)),
              ),
              labelColor: AppColors.neonGreen,
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
                    child: CircularProgressIndicator(color: AppColors.neonGreen))
                : TabBarView(
                    controller: _tabController,
                    children: [
                      // Friends List
                      _friends.isEmpty
                          ? const Center(
                              child: Text(
                                'No friends yet. Tap + Add to connect!',
                                style: TextStyle(color: AppColors.textMuted),
                              ),
                            )
                          : ListView.separated(
                              padding: const EdgeInsets.symmetric(horizontal: 20),
                              itemCount: _friends.length,
                              separatorBuilder: (_, __) => const SizedBox(height: 10),
                              itemBuilder: (context, index) {
                                final f = _friends[index];
                                final initial = (f.user.name ?? f.user.email)[0].toUpperCase();
                                final isGreen = f.balance >= 0;

                                return GlassCard(
                                  borderColor: f.balance > 0
                                      ? AppColors.neonGreen.withOpacity(0.2)
                                      : f.balance < 0
                                          ? AppColors.actionRed.withOpacity(0.2)
                                          : Colors.white.withOpacity(0.08),
                                  child: Row(
                                    children: [
                                      Container(
                                        height: 44,
                                        width: 44,
                                        decoration: BoxDecoration(
                                          color: isGreen
                                              ? AppColors.neonGreen.withOpacity(0.15)
                                              : AppColors.actionRed.withOpacity(0.15),
                                          shape: BoxShape.circle,
                                          border: Border.all(
                                            color: isGreen
                                                ? AppColors.neonGreen.withOpacity(0.3)
                                                : AppColors.actionRed.withOpacity(0.3),
                                          ),
                                        ),
                                        child: Center(
                                          child: Text(
                                            initial,
                                            style: TextStyle(
                                              color: isGreen
                                                  ? AppColors.neonGreen
                                                  : AppColors.actionRed,
                                              fontWeight: FontWeight.bold,
                                              fontSize: 18,
                                            ),
                                          ),
                                        ),
                                      ),
                                      const SizedBox(width: 14),
                                      Expanded(
                                        child: Column(
                                          crossAxisAlignment: CrossAxisAlignment.start,
                                          children: [
                                            Text(
                                              f.user.name ?? f.user.email.split('@').first,
                                              style: const TextStyle(
                                                color: AppColors.textPrimary,
                                                fontWeight: FontWeight.bold,
                                                fontSize: 15,
                                              ),
                                            ),
                                            const SizedBox(height: 2),
                                            Text(
                                              f.user.email,
                                              style: TextStyle(
                                                color: Colors.white.withOpacity(0.4),
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
                                                  ? AppColors.neonGreen
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
                                                  ? AppColors.neonGreen
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
