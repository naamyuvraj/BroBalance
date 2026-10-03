import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../../models/transaction_model.dart';
import '../../models/user_model.dart';
import '../../services/notification_service.dart';
import '../../services/transaction_service.dart';
import '../../theme/app_theme.dart';
import '../../widgets/add_friend_modal.dart';
import '../../widgets/add_transaction_modal.dart';
import '../../widgets/glass_card.dart';
import '../../widgets/notification_drawer.dart';

class DashboardTab extends StatefulWidget {
  final UserModel currentUser;

  const DashboardTab({super.key, required this.currentUser});

  @override
  State<DashboardTab> createState() => _DashboardTabState();
}

class _DashboardTabState extends State<DashboardTab> {
  DashboardStats? _stats;
  List<TransactionModel> _recentTransactions = [];
  int _unreadNotifications = 0;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadDashboardData();
  }

  Future<void> _loadDashboardData() async {
    setState(() => _isLoading = true);
    try {
      final statsFuture = TransactionService.getStats();
      final txnsFuture = TransactionService.getTransactions();
      final unreadFuture = NotificationService.getUnreadCount();

      final results = await Future.wait([statsFuture, txnsFuture, unreadFuture]);
      setState(() {
        _stats = results[0] as DashboardStats;
        _recentTransactions = (results[1] as List<TransactionModel>).take(5).toList();
        _unreadNotifications = results[2] as int;
        _isLoading = false;
      });
    } catch (_) {
      setState(() => _isLoading = false);
    }
  }

  void _openNotifications() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => const NotificationDrawer(),
    ).then((_) => _loadDashboardData());
  }

  void _openAddTransaction() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => AddTransactionModal(
        onTransactionAdded: _loadDashboardData,
      ),
    );
  }

  void _openAddFriend() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => AddFriendModal(
        onFriendAdded: _loadDashboardData,
      ),
    );
  }

  final currencyFormatter = NumberFormat.currency(symbol: '₹', decimalDigits: 2);

  @override
  Widget build(BuildContext context) {
    final displayName = widget.currentUser.name ?? widget.currentUser.email.split('@').first;

    return RefreshIndicator(
      color: AppColors.neonGreen,
      backgroundColor: AppColors.bgCard,
      onRefresh: _loadDashboardData,
      child: SafeArea(
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Top Brand Header Row
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      Container(
                        height: 38,
                        width: 38,
                        decoration: BoxDecoration(
                          color: AppColors.neonGreen.withOpacity(0.12),
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(
                            color: AppColors.neonGreen.withOpacity(0.3),
                            width: 1,
                          ),
                          boxShadow: [
                            BoxShadow(
                              color: AppColors.neonGreen.withOpacity(0.2),
                              blurRadius: 10,
                            ),
                          ],
                        ),
                        child: const Center(
                          child: Icon(
                            Icons.auto_awesome_rounded,
                            color: AppColors.neonGreen,
                            size: 20,
                          ),
                        ),
                      ),
                      const SizedBox(width: 10),
                      RichText(
                        text: const TextSpan(
                          children: [
                            TextSpan(
                              text: 'Bro',
                              style: TextStyle(
                                color: Colors.white,
                                fontSize: 22,
                                fontWeight: FontWeight.w600,
                                letterSpacing: -0.5,
                              ),
                            ),
                            TextSpan(
                              text: 'Balance',
                              style: TextStyle(
                                color: AppColors.neonGreen,
                                fontSize: 22,
                                fontWeight: FontWeight.bold,
                                letterSpacing: -0.5,
                                shadows: [
                                  Shadow(
                                    color: Color(0x6600FF66),
                                    blurRadius: 12,
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  Row(
                    children: [
                      GestureDetector(
                        onTap: _openNotifications,
                        child: Container(
                          height: 40,
                          width: 40,
                          decoration: BoxDecoration(
                            color: Colors.white.withOpacity(0.04),
                            shape: BoxShape.circle,
                            border: Border.all(
                              color: Colors.white.withOpacity(0.1),
                            ),
                          ),
                          child: Stack(
                            alignment: Alignment.center,
                            children: [
                              const Icon(
                                Icons.notifications_outlined,
                                color: AppColors.textPrimary,
                                size: 20,
                              ),
                              if (_unreadNotifications > 0)
                                Positioned(
                                  top: 8,
                                  right: 8,
                                  child: Container(
                                    height: 8,
                                    width: 8,
                                    decoration: const BoxDecoration(
                                      color: AppColors.actionRed,
                                      shape: BoxShape.circle,
                                    ),
                                  ),
                                ),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
              const SizedBox(height: 20),

              // Greeting Subtext
              Text(
                'Welcome back, $displayName 👋',
                style: TextStyle(
                  color: Colors.white.withOpacity(0.6),
                  fontSize: 14,
                  fontWeight: FontWeight.w500,
                ),
              ),
              const SizedBox(height: 16),

              if (_isLoading)
                const SizedBox(
                  height: 160,
                  child: Center(
                    child: CircularProgressIndicator(color: AppColors.neonGreen),
                  ),
                )
              else ...[
                // NET BALANCE HERO CARD
                GlassCard(
                  gradient: (_stats?.netBalance ?? 0) >= 0
                      ? AppColors.greenCardGradient
                      : AppColors.redCardGradient,
                  borderColor: (_stats?.netBalance ?? 0) >= 0
                      ? AppColors.neonGreen.withOpacity(0.35)
                      : AppColors.actionRed.withOpacity(0.35),
                  padding: const EdgeInsets.all(20),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Row(
                            children: [
                              Container(
                                padding: const EdgeInsets.symmetric(
                                    horizontal: 8, vertical: 4),
                                decoration: BoxDecoration(
                                  color: ((_stats?.netBalance ?? 0) >= 0
                                          ? AppColors.neonGreen
                                          : AppColors.actionRed)
                                      .withOpacity(0.15),
                                  borderRadius: BorderRadius.circular(8),
                                ),
                                child: Text(
                                  'NET BALANCE',
                                  style: TextStyle(
                                    color: (_stats?.netBalance ?? 0) >= 0
                                        ? AppColors.neonGreen
                                        : AppColors.actionRed,
                                    fontSize: 11,
                                    fontWeight: FontWeight.bold,
                                    letterSpacing: 1.0,
                                  ),
                                ),
                              ),
                            ],
                          ),
                          Icon(
                            (_stats?.netBalance ?? 0) >= 0
                                ? Icons.trending_up_rounded
                                : Icons.trending_down_rounded,
                            color: (_stats?.netBalance ?? 0) >= 0
                                ? AppColors.neonGreen
                                : AppColors.actionRed,
                            size: 24,
                          ),
                        ],
                      ),
                      const SizedBox(height: 14),
                      Text(
                        '${(_stats?.netBalance ?? 0) >= 0 ? '+' : ''}${currencyFormatter.format(_stats?.netBalance ?? 0)}',
                        style: TextStyle(
                          color: (_stats?.netBalance ?? 0) >= 0
                              ? AppColors.neonGreen
                              : AppColors.actionRed,
                          fontSize: 32,
                          fontWeight: FontWeight.w800,
                          letterSpacing: -0.5,
                        ),
                      ),
                      const SizedBox(height: 6),
                      Text(
                        (_stats?.netBalance ?? 0) >= 0
                            ? "You're in the green! All clear."
                            : "You owe more than you're owed.",
                        style: TextStyle(
                          color: Colors.white.withOpacity(0.5),
                          fontSize: 12,
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 14),

                // SIDE-BY-SIDE CARDS: TO RECEIVE & TO PAY
                Row(
                  children: [
                    // TO RECEIVE CARD (Green)
                    Expanded(
                      child: GlassCard(
                        gradient: AppColors.greenCardGradient,
                        borderColor: AppColors.neonGreen.withOpacity(0.25),
                        padding: const EdgeInsets.all(16),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                const Text(
                                  'TO RECEIVE',
                                  style: TextStyle(
                                    color: AppColors.neonGreen,
                                    fontSize: 10,
                                    fontWeight: FontWeight.bold,
                                    letterSpacing: 1.0,
                                  ),
                                ),
                                Container(
                                  padding: const EdgeInsets.all(5),
                                  decoration: BoxDecoration(
                                    color: AppColors.neonGreen.withOpacity(0.15),
                                    shape: BoxShape.circle,
                                  ),
                                  child: const Icon(
                                    Icons.arrow_downward_rounded,
                                    color: AppColors.neonGreen,
                                    size: 14,
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 12),
                            Text(
                              currencyFormatter.format(_stats?.toReceive ?? 0),
                              style: const TextStyle(
                                color: AppColors.textPrimary,
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Row(
                              children: [
                                Container(
                                  width: 6,
                                  height: 6,
                                  decoration: const BoxDecoration(
                                    color: AppColors.neonGreen,
                                    shape: BoxShape.circle,
                                  ),
                                ),
                                const SizedBox(width: 4),
                                const Text(
                                  'incoming',
                                  style: TextStyle(
                                    color: AppColors.neonGreen,
                                    fontSize: 10,
                                    fontWeight: FontWeight.w500,
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(width: 12),

                    // TO PAY CARD (Red)
                    Expanded(
                      child: GlassCard(
                        gradient: AppColors.redCardGradient,
                        borderColor: AppColors.actionRed.withOpacity(0.25),
                        padding: const EdgeInsets.all(16),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                const Text(
                                  'TO PAY',
                                  style: TextStyle(
                                    color: AppColors.actionRed,
                                    fontSize: 10,
                                    fontWeight: FontWeight.bold,
                                    letterSpacing: 1.0,
                                  ),
                                ),
                                Container(
                                  padding: const EdgeInsets.all(5),
                                  decoration: BoxDecoration(
                                    color: AppColors.actionRed.withOpacity(0.15),
                                    shape: BoxShape.circle,
                                  ),
                                  child: const Icon(
                                    Icons.arrow_upward_rounded,
                                    color: AppColors.actionRed,
                                    size: 14,
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 12),
                            Text(
                              currencyFormatter.format(_stats?.toPay ?? 0),
                              style: const TextStyle(
                                color: AppColors.textPrimary,
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Row(
                              children: [
                                Container(
                                  width: 6,
                                  height: 6,
                                  decoration: const BoxDecoration(
                                    color: AppColors.actionRed,
                                    shape: BoxShape.circle,
                                  ),
                                ),
                                const SizedBox(width: 4),
                                const Text(
                                  'outgoing',
                                  style: TextStyle(
                                    color: AppColors.actionRed,
                                    fontSize: 10,
                                    fontWeight: FontWeight.w500,
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ],

              const SizedBox(height: 24),

              // QUICK ACTION CAPSULE PILLS BAR
              Row(
                children: [
                  Expanded(
                    child: GestureDetector(
                      onTap: _openAddTransaction,
                      child: Container(
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        decoration: BoxDecoration(
                          gradient: AppColors.greenPrimaryGradient,
                          borderRadius: BorderRadius.circular(30),
                          boxShadow: [
                            BoxShadow(
                              color: AppColors.neonGreen.withOpacity(0.3),
                              blurRadius: 16,
                              offset: const Offset(0, 4),
                            ),
                          ],
                        ),
                        child: const Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(Icons.add_rounded, color: Colors.black, size: 20),
                            SizedBox(width: 6),
                            Text(
                              'Record Expense',
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
                  ),
                  const SizedBox(width: 10),
                  GestureDetector(
                    onTap: _openAddFriend,
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 14),
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.06),
                        borderRadius: BorderRadius.circular(30),
                        border: Border.all(color: Colors.white.withOpacity(0.12)),
                      ),
                      child: const Row(
                        children: [
                          Icon(Icons.person_add_alt_1_rounded,
                              color: AppColors.textPrimary, size: 18),
                          SizedBox(width: 6),
                          Text(
                            'Add Friend',
                            style: TextStyle(
                              color: AppColors.textPrimary,
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

              const SizedBox(height: 28),

              // RECENT ACTIVITY SECTION
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'Recent Activity',
                    style: TextStyle(
                      color: AppColors.textPrimary,
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  Text(
                    'Showing 5 recent',
                    style: TextStyle(
                      color: Colors.white.withOpacity(0.4),
                      fontSize: 12,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 14),

              if (_recentTransactions.isEmpty)
                GlassCard(
                  child: const Center(
                    child: Padding(
                      padding: EdgeInsets.symmetric(vertical: 24),
                      child: Text(
                        'No transactions recorded yet.\nTap "Record Expense" to get started!',
                        textAlign: TextAlign.center,
                        style: TextStyle(color: AppColors.textMuted, fontSize: 13),
                      ),
                    ),
                  ),
                )
              else
                ListView.separated(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  itemCount: _recentTransactions.length,
                  separatorBuilder: (_, __) => const SizedBox(height: 10),
                  itemBuilder: (context, index) {
                    final item = _recentTransactions[index];
                    final isLender = item.lender.id == widget.currentUser.id;
                    final otherUser = isLender ? item.borrower : item.lender;

                    return GlassCard(
                      padding: const EdgeInsets.all(14),
                      borderColor: isLender
                          ? AppColors.neonGreen.withOpacity(0.15)
                          : AppColors.actionRed.withOpacity(0.15),
                      child: Row(
                        children: [
                          Container(
                            height: 42,
                            width: 42,
                            decoration: BoxDecoration(
                              color: isLender
                                  ? AppColors.neonGreen.withOpacity(0.12)
                                  : AppColors.actionRed.withOpacity(0.12),
                              borderRadius: BorderRadius.circular(14),
                              border: Border.all(
                                color: isLender
                                    ? AppColors.neonGreen.withOpacity(0.25)
                                    : AppColors.actionRed.withOpacity(0.25),
                              ),
                            ),
                            child: Icon(
                              isLender
                                  ? Icons.arrow_downward_rounded
                                  : Icons.arrow_upward_rounded,
                              color: isLender ? AppColors.neonGreen : AppColors.actionRed,
                              size: 20,
                            ),
                          ),
                          const SizedBox(width: 14),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  item.description,
                                  style: const TextStyle(
                                    color: AppColors.textPrimary,
                                    fontWeight: FontWeight.bold,
                                    fontSize: 14,
                                  ),
                                ),
                                const SizedBox(height: 3),
                                Text(
                                  isLender
                                      ? 'Lent to ${otherUser.name ?? otherUser.email.split('@').first}'
                                      : 'Borrowed from ${otherUser.name ?? otherUser.email.split('@').first}',
                                  style: TextStyle(
                                    color: Colors.white.withOpacity(0.5),
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
                                '${isLender ? '+' : '-'}${currencyFormatter.format(item.amount)}',
                                style: TextStyle(
                                  color: isLender ? AppColors.neonGreen : AppColors.actionRed,
                                  fontWeight: FontWeight.bold,
                                  fontSize: 15,
                                ),
                              ),
                              const SizedBox(height: 4),
                              Container(
                                padding: const EdgeInsets.symmetric(
                                    horizontal: 8, vertical: 3),
                                decoration: BoxDecoration(
                                  color: item.status == 'paid'
                                      ? AppColors.neonGreen.withOpacity(0.18)
                                      : Colors.white.withOpacity(0.06),
                                  borderRadius: BorderRadius.circular(12),
                                  border: Border.all(
                                    color: item.status == 'paid'
                                        ? AppColors.neonGreen.withOpacity(0.3)
                                        : Colors.transparent,
                                  ),
                                ),
                                child: Text(
                                  item.status == 'paid' ? 'SETTLED' : 'ACTIVE',
                                  style: TextStyle(
                                    color: item.status == 'paid'
                                        ? AppColors.neonGreen
                                        : AppColors.textMuted,
                                    fontSize: 9,
                                    fontWeight: FontWeight.bold,
                                    letterSpacing: 0.5,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    );
                  },
                ),
              const SizedBox(height: 20),
            ],
          ),
        ),
      ),
    );
  }

}
