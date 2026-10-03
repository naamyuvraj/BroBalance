import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';
import '../../models/transaction_model.dart';
import '../../models/user_model.dart';
import '../../services/transaction_service.dart';
import '../../theme/app_theme.dart';
import '../../widgets/add_transaction_modal.dart';

class TransactionsTab extends StatefulWidget {
  final UserModel currentUser;

  const TransactionsTab({super.key, required this.currentUser});

  @override
  State<TransactionsTab> createState() => _TransactionsTabState();
}

class _TransactionsTabState extends State<TransactionsTab> {
  List<TransactionModel> _allTransactions = [];
  List<TransactionModel> _filteredTransactions = [];
  DashboardStats? _stats;
  bool _isLoading = true;
  String _filter = 'all'; // 'all', 'lent', 'borrowed'

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    setState(() => _isLoading = true);
    try {
      final txnsFuture = TransactionService.getTransactions();
      final statsFuture = TransactionService.getStats();

      final results = await Future.wait([txnsFuture, statsFuture]);
      setState(() {
        _allTransactions = results[0] as List<TransactionModel>;
        _stats = results[1] as DashboardStats;
        _applyFilters();
        _isLoading = false;
      });
    } catch (_) {
      setState(() => _isLoading = false);
    }
  }

  void _applyFilters() {
    setState(() {
      _filteredTransactions = _allTransactions.where((item) {
        final isLender = item.lender.id == widget.currentUser.id;
        if (_filter == 'lent' && !isLender) return false;
        if (_filter == 'borrowed' && isLender) return false;
        return true;
      }).toList();
    });
  }

  void _openAddTransaction() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => AddTransactionModal(onTransactionAdded: _loadData),
    );
  }

  final currencyFormatter = NumberFormat.currency(symbol: '₹', decimalDigits: 0);
  final dateFormatter = DateFormat('dd/MM/yyyy');

  @override
  Widget build(BuildContext context) {
    final netBalance = _stats?.netBalance ?? 0;

    return Scaffold(
      backgroundColor: AppColors.bgPrimary,
      body: SafeArea(
        child: Stack(
          children: [
            Column(
              children: [
                // Header matching Screenshot 3 ("Trans actions" / "All your debts and payments")
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          RichText(
                            text: const TextSpan(
                              children: [
                                TextSpan(
                                  text: 'Trans',
                                  style: TextStyle(
                                    color: Colors.white,
                                    fontSize: 30,
                                    fontWeight: FontWeight.w400,
                                    letterSpacing: -0.5,
                                  ),
                                ),
                                TextSpan(
                                  text: 'actions',
                                  style: TextStyle(
                                    color: Colors.white,
                                    fontSize: 30,
                                    fontWeight: FontWeight.bold,
                                    letterSpacing: -0.5,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'All your debts and payments',
                        style: TextStyle(
                          color: Colors.white.withOpacity(0.5),
                          fontSize: 14,
                        ),
                      ),
                    ],
                  ),
                ),

                // Top 3 Stat Cards Row matching Screenshot 3 (Lent, Borrowed, Net)
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 20),
                  child: Row(
                    children: [
                      // Card 1: Lent
                      Expanded(
                        child: Container(
                          padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 10),
                          decoration: BoxDecoration(
                            color: const Color(0xFF0C1912),
                            borderRadius: BorderRadius.circular(20),
                            border: Border.all(color: const Color(0xFF144525), width: 1),
                          ),
                          child: Column(
                            children: [
                              Container(
                                height: 36,
                                width: 36,
                                decoration: BoxDecoration(
                                  color: AppColors.successGreen.withOpacity(0.15),
                                  shape: BoxShape.circle,
                                ),
                                child: const Icon(
                                  Icons.arrow_downward_rounded,
                                  color: AppColors.successGreen,
                                  size: 18,
                                ),
                              ),
                              const SizedBox(height: 8),
                              Text(
                                'Lent',
                                style: TextStyle(
                                  color: Colors.white.withOpacity(0.5),
                                  fontSize: 12,
                                ),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                currencyFormatter.format(_stats?.toReceive ?? 0),
                                style: const TextStyle(
                                  color: AppColors.successGreen,
                                  fontSize: 18,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                      const SizedBox(width: 10),

                      // Card 2: Borrowed
                      Expanded(
                        child: Container(
                          padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 10),
                          decoration: BoxDecoration(
                            color: const Color(0xFF1F0E0C),
                            borderRadius: BorderRadius.circular(20),
                            border: Border.all(color: const Color(0xFF421714), width: 1),
                          ),
                          child: Column(
                            children: [
                              Container(
                                height: 36,
                                width: 36,
                                decoration: BoxDecoration(
                                  color: AppColors.actionRed.withOpacity(0.15),
                                  shape: BoxShape.circle,
                                ),
                                child: const Icon(
                                  Icons.arrow_upward_rounded,
                                  color: AppColors.actionRed,
                                  size: 18,
                                ),
                              ),
                              const SizedBox(height: 8),
                              Text(
                                'Borrowed',
                                style: TextStyle(
                                  color: Colors.white.withOpacity(0.5),
                                  fontSize: 12,
                                ),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                currencyFormatter.format(_stats?.toPay ?? 0),
                                style: const TextStyle(
                                  color: AppColors.actionRed,
                                  fontSize: 18,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                      const SizedBox(width: 10),

                      // Card 3: Net
                      Expanded(
                        child: Container(
                          padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 10),
                          decoration: BoxDecoration(
                            color: const Color(0xFF151212),
                            borderRadius: BorderRadius.circular(20),
                            border: Border.all(
                              color: netBalance < 0
                                  ? const Color(0xFF421714)
                                  : const Color(0xFF144525),
                              width: 1,
                            ),
                          ),
                          child: Column(
                            children: [
                              Container(
                                height: 36,
                                width: 36,
                                decoration: const BoxDecoration(
                                  color: Color(0xFF331B19),
                                  shape: BoxShape.circle,
                                ),
                                child: const Icon(
                                  Icons.attach_money_rounded,
                                  color: AppColors.actionRed,
                                  size: 18,
                                ),
                              ),
                              const SizedBox(height: 8),
                              Text(
                                'Net',
                                style: TextStyle(
                                  color: Colors.white.withOpacity(0.5),
                                  fontSize: 12,
                                ),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                currencyFormatter.format(netBalance.abs()),
                                style: TextStyle(
                                  color: netBalance < 0
                                      ? AppColors.actionRed
                                      : AppColors.successGreen,
                                  fontSize: 18,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 20),

                // Filter Pills Bar matching Screenshot 3 ("All", "Lent", "Borrowed")
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 20),
                  child: Row(
                    children: [
                      _buildFilterPill('All', 'all'),
                      const SizedBox(width: 10),
                      _buildFilterPill('Lent', 'lent'),
                      const SizedBox(width: 10),
                      _buildFilterPill('Borrowed', 'borrowed'),
                    ],
                  ),
                ),
                const SizedBox(height: 16),

                // Transactions List matching Screenshot 3
                Expanded(
                  child: _isLoading
                      ? const Center(
                          child: CircularProgressIndicator(color: AppColors.actionRed))
                      : _filteredTransactions.isEmpty
                          ? const Center(
                              child: Text(
                                'No transactions yet',
                                style: TextStyle(color: AppColors.textMuted),
                              ),
                            )
                          : ListView.separated(
                              padding: const EdgeInsets.symmetric(horizontal: 20),
                              itemCount: _filteredTransactions.length,
                              separatorBuilder: (_, __) => const SizedBox(height: 12),
                              itemBuilder: (context, index) {
                                final item = _filteredTransactions[index];
                                final isLender = item.lender.id == widget.currentUser.id;
                                final otherUser = isLender ? item.borrower : item.lender;
                                final otherName =
                                    otherUser.name ?? otherUser.email.split('@').first;
                                final parsedDate = item.createdAt != null
                                    ? (DateTime.tryParse(item.createdAt!) ?? DateTime.now())
                                    : DateTime.now();
                                final dateStr = dateFormatter.format(parsedDate);

                                return Container(
                                  padding: const EdgeInsets.all(16),
                                  decoration: BoxDecoration(
                                    color: const Color(0xFF121212),
                                    borderRadius: BorderRadius.circular(20),
                                    border: Border.all(
                                      color: Colors.white.withOpacity(0.06),
                                      width: 1,
                                    ),
                                  ),
                                  child: Row(
                                    children: [
                                      // Avatar Circle Initial (matching orange circle in screenshot 3)
                                      Container(
                                        height: 44,
                                        width: 44,
                                        decoration: const BoxDecoration(
                                          color: Color(0xFFD94E28),
                                          shape: BoxShape.circle,
                                        ),
                                        child: Center(
                                          child: Text(
                                            otherName[0].toUpperCase(),
                                            style: const TextStyle(
                                              color: Colors.white,
                                              fontSize: 18,
                                              fontWeight: FontWeight.bold,
                                            ),
                                          ),
                                        ),
                                      ),
                                      const SizedBox(width: 14),

                                      // Description & Name
                                      Expanded(
                                        child: Column(
                                          crossAxisAlignment: CrossAxisAlignment.start,
                                          children: [
                                            Text(
                                              otherName,
                                              style: const TextStyle(
                                                color: Colors.white,
                                                fontWeight: FontWeight.bold,
                                                fontSize: 16,
                                              ),
                                            ),
                                            const SizedBox(height: 3),
                                            Text(
                                              item.description,
                                              style: TextStyle(
                                                color: Colors.white.withOpacity(0.45),
                                                fontSize: 13,
                                              ),
                                            ),
                                          ],
                                        ),
                                      ),

                                      // Amount & Date on Right
                                      Column(
                                        crossAxisAlignment: CrossAxisAlignment.end,
                                        children: [
                                          Text(
                                            '${isLender ? '+' : '-'}${currencyFormatter.format(item.amount)}',
                                            style: TextStyle(
                                              color: isLender
                                                  ? AppColors.successGreen
                                                  : AppColors.actionRed,
                                              fontWeight: FontWeight.bold,
                                              fontSize: 16,
                                            ),
                                          ),
                                          const SizedBox(height: 4),
                                          Text(
                                            dateStr,
                                            style: TextStyle(
                                              color: Colors.white.withOpacity(0.35),
                                              fontSize: 11,
                                            ),
                                          ),
                                        ],
                                      ),
                                    ],
                                  ),
                                );
                              },
                            ),
                ),
              ],
            ),

            // Red Floating Action Button (+) matching Screenshot 3
            Positioned(
              right: 20,
              bottom: 12,
              child: GestureDetector(
                onTap: _openAddTransaction,
                child: Container(
                  height: 56,
                  width: 56,
                  decoration: BoxDecoration(
                    color: AppColors.actionRed,
                    shape: BoxShape.circle,
                    boxShadow: [
                      BoxShadow(
                        color: AppColors.actionRed.withOpacity(0.5),
                        blurRadius: 20,
                        spreadRadius: 2,
                      ),
                    ],
                  ),
                  child: const Icon(
                    Icons.add_rounded,
                    color: Colors.white,
                    size: 30,
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFilterPill(String label, String value) {
    final isSelected = _filter == value;
    return Expanded(
      child: GestureDetector(
        onTap: () {
          setState(() {
            _filter = value;
            _applyFilters();
          });
        },
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 180),
          padding: const EdgeInsets.symmetric(vertical: 12),
          decoration: BoxDecoration(
            color: isSelected ? AppColors.actionRed : Colors.white.withOpacity(0.04),
            borderRadius: BorderRadius.circular(30),
            border: Border.all(
              color: isSelected ? AppColors.actionRed : Colors.white.withOpacity(0.1),
            ),
            boxShadow: isSelected
                ? [
                    BoxShadow(
                      color: AppColors.actionRed.withOpacity(0.4),
                      blurRadius: 12,
                    ),
                  ]
                : null,
          ),
          child: Center(
            child: Text(
              label,
              style: TextStyle(
                color: isSelected ? Colors.white : Colors.white.withOpacity(0.6),
                fontSize: 14,
                fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
              ),
            ),
          ),
        ),
      ),
    );
  }
}
