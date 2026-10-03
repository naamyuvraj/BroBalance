import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../../models/transaction_model.dart';
import '../../models/user_model.dart';
import '../../services/transaction_service.dart';
import '../../theme/app_theme.dart';
import '../../widgets/add_transaction_modal.dart';
import '../../widgets/glass_card.dart';

class TransactionsTab extends StatefulWidget {
  final UserModel currentUser;

  const TransactionsTab({super.key, required this.currentUser});

  @override
  State<TransactionsTab> createState() => _TransactionsTabState();
}

class _TransactionsTabState extends State<TransactionsTab> {
  List<TransactionModel> _allTransactions = [];
  List<TransactionModel> _filteredTransactions = [];
  bool _isLoading = true;
  String _filter = 'all'; // 'all', 'lent', 'borrowed', 'paid'
  final _searchController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _loadTransactions();
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  Future<void> _loadTransactions() async {
    setState(() => _isLoading = true);
    try {
      final list = await TransactionService.getTransactions();
      setState(() {
        _allTransactions = list;
        _applyFilters();
        _isLoading = false;
      });
    } catch (_) {
      setState(() => _isLoading = false);
    }
  }

  void _applyFilters() {
    final query = _searchController.text.toLowerCase().trim();
    setState(() {
      _filteredTransactions = _allTransactions.where((item) {
        final isLender = item.lender.id == widget.currentUser.id;

        // Filter check
        if (_filter == 'lent' && !isLender) return false;
        if (_filter == 'borrowed' && isLender) return false;
        if (_filter == 'paid' && item.status != 'paid') return false;

        // Search check
        if (query.isNotEmpty) {
          final descMatch = item.description.toLowerCase().contains(query);
          final otherName = isLender
              ? (item.borrower.name ?? item.borrower.email).toLowerCase()
              : (item.lender.name ?? item.lender.email).toLowerCase();
          return descMatch || otherName.contains(query);
        }
        return true;
      }).toList();
    });
  }

  Future<void> _markPaid(String id) async {
    try {
      await TransactionService.markAsPaid(id);
      _loadTransactions();
    } catch (_) {}
  }

  void _openAddTransaction() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => AddTransactionModal(onTransactionAdded: _loadTransactions),
    );
  }

  final currencyFormatter = NumberFormat.currency(symbol: '₹', decimalDigits: 2);

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Column(
        children: [
          // Header
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Transactions',
                  style: TextStyle(
                    color: AppColors.textPrimary,
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                IconButton(
                  icon: const Icon(Icons.add_circle, color: AppColors.actionRed, size: 28),
                  onPressed: _openAddTransaction,
                ),
              ],
            ),
          ),

          // Search Bar
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            child: TextField(
              controller: _searchController,
              onChanged: (_) => _applyFilters(),
              style: const TextStyle(color: AppColors.textPrimary),
              decoration: InputDecoration(
                hintText: 'Search transactions...',
                hintStyle: TextStyle(color: Colors.white.withOpacity(0.3)),
                prefixIcon: const Icon(Icons.search, color: AppColors.textMuted),
                filled: true,
                fillColor: Colors.white.withOpacity(0.04),
                contentPadding: const EdgeInsets.symmetric(vertical: 12),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(16),
                  borderSide: BorderSide(color: Colors.white.withOpacity(0.08)),
                ),
              ),
            ),
          ),
          const SizedBox(height: 12),

          // Filter Chips
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 20),
            child: Row(
              children: [
                _buildFilterChip('All', 'all'),
                const SizedBox(width: 8),
                _buildFilterChip('I Lent', 'lent'),
                const SizedBox(width: 8),
                _buildFilterChip('I Borrowed', 'borrowed'),
                const SizedBox(width: 8),
                _buildFilterChip('Settled', 'paid'),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // Transaction List
          Expanded(
            child: _isLoading
                ? const Center(
                    child: CircularProgressIndicator(color: AppColors.actionRed))
                : _filteredTransactions.isEmpty
                    ? const Center(
                        child: Text(
                          'No transactions found',
                          style: TextStyle(color: AppColors.textMuted),
                        ),
                      )
                    : ListView.separated(
                        padding: const EdgeInsets.symmetric(horizontal: 20),
                        itemCount: _filteredTransactions.length,
                        separatorBuilder: (_, __) => const SizedBox(height: 10),
                        itemBuilder: (context, index) {
                          final item = _filteredTransactions[index];
                          final isLender = item.lender.id == widget.currentUser.id;
                          final otherUser = isLender ? item.borrower : item.lender;

                          return GlassCard(
                            padding: const EdgeInsets.all(16),
                            child: Column(
                              children: [
                                Row(
                                  children: [
                                    CircleAvatar(
                                      backgroundColor: isLender
                                          ? AppColors.success.withOpacity(0.15)
                                          : AppColors.actionRed.withOpacity(0.15),
                                      child: Icon(
                                        isLender
                                            ? Icons.arrow_downward_rounded
                                            : Icons.arrow_upward_rounded,
                                        color: isLender
                                            ? AppColors.success
                                            : AppColors.actionRed,
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
                                              fontSize: 15,
                                            ),
                                          ),
                                          const SizedBox(height: 2),
                                          Text(
                                            isLender
                                                ? 'With ${otherUser.name ?? otherUser.email}'
                                                : 'From ${otherUser.name ?? otherUser.email}',
                                            style: const TextStyle(
                                              color: AppColors.textSecondary,
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
                                            color: isLender
                                                ? AppColors.success
                                                : AppColors.actionRed,
                                            fontWeight: FontWeight.bold,
                                            fontSize: 16,
                                          ),
                                        ),
                                        const SizedBox(height: 4),
                                        Container(
                                          padding: const EdgeInsets.symmetric(
                                              horizontal: 8, vertical: 2),
                                          decoration: BoxDecoration(
                                            color: item.status == 'paid'
                                                ? AppColors.success.withOpacity(0.2)
                                                : AppColors.warning.withOpacity(0.2),
                                            borderRadius: BorderRadius.circular(6),
                                          ),
                                          child: Text(
                                            item.status.toUpperCase(),
                                            style: TextStyle(
                                              color: item.status == 'paid'
                                                  ? AppColors.success
                                                  : AppColors.warning,
                                              fontSize: 9,
                                              fontWeight: FontWeight.bold,
                                            ),
                                          ),
                                        ),
                                      ],
                                    ),
                                  ],
                                ),
                                if (item.status != 'paid') ...[
                                  const SizedBox(height: 12),
                                  const Divider(color: Color(0xFF262626), height: 1),
                                  const SizedBox(height: 8),
                                  Align(
                                    alignment: Alignment.centerRight,
                                    child: TextButton(
                                      onPressed: () => _markPaid(item.id),
                                      child: const Text(
                                        'Mark as Paid',
                                        style: TextStyle(
                                            color: AppColors.success, fontSize: 12),
                                      ),
                                    ),
                                  ),
                                ],
                              ],
                            ),
                          );
                        },
                      ),
          ),
        ],
      ),
    );
  }

  Widget _buildFilterChip(String label, String value) {
    final isSelected = _filter == value;
    return GestureDetector(
      onTap: () {
        setState(() {
          _filter = value;
          _applyFilters();
        });
      },
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
        decoration: BoxDecoration(
          color: isSelected
              ? AppColors.actionRed.withOpacity(0.2)
              : Colors.white.withOpacity(0.04),
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: isSelected ? AppColors.actionRed : Colors.white.withOpacity(0.08),
          ),
        ),
        child: Text(
          label,
          style: TextStyle(
            color: isSelected ? AppColors.actionRed : AppColors.textMuted,
            fontSize: 12,
            fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
          ),
        ),
      ),
    );
  }
}
