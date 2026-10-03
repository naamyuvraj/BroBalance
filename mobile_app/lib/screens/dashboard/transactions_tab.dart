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
                  'Expenses',
                  style: TextStyle(
                    color: AppColors.textPrimary,
                    fontSize: 26,
                    fontWeight: FontWeight.bold,
                    letterSpacing: -0.5,
                  ),
                ),
                GestureDetector(
                  onTap: _openAddTransaction,
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
                        Icon(Icons.add_rounded, color: Colors.black, size: 18),
                        SizedBox(width: 4),
                        Text(
                          'New',
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

          // Glass Search Bar
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            child: TextField(
              controller: _searchController,
              onChanged: (_) => _applyFilters(),
              style: const TextStyle(color: AppColors.textPrimary, fontSize: 14),
              decoration: InputDecoration(
                hintText: 'Search description or friend...',
                hintStyle: TextStyle(color: Colors.white.withOpacity(0.35), fontSize: 13),
                prefixIcon: const Icon(Icons.search_rounded, color: AppColors.neonGreen, size: 20),
                filled: true,
                fillColor: Colors.white.withOpacity(0.04),
                contentPadding: const EdgeInsets.symmetric(vertical: 12),
                enabledBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(20),
                  borderSide: BorderSide(color: Colors.white.withOpacity(0.08)),
                ),
                focusedBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(20),
                  borderSide: BorderSide(color: AppColors.neonGreen.withOpacity(0.4)),
                ),
              ),
            ),
          ),
          const SizedBox(height: 14),

          // Segmented Capsule Filter Pills Bar
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 20),
            child: Container(
              padding: const EdgeInsets.all(4),
              decoration: BoxDecoration(
                color: Colors.white.withOpacity(0.04),
                borderRadius: BorderRadius.circular(24),
                border: Border.all(color: Colors.white.withOpacity(0.08)),
              ),
              child: Row(
                children: [
                  _buildFilterChip('All', 'all'),
                  const SizedBox(width: 4),
                  _buildFilterChip('Lent', 'lent'),
                  const SizedBox(width: 4),
                  _buildFilterChip('Borrowed', 'borrowed'),
                  const SizedBox(width: 4),
                  _buildFilterChip('Settled', 'paid'),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),

          // Transaction List
          Expanded(
            child: _isLoading
                ? const Center(
                    child: CircularProgressIndicator(color: AppColors.neonGreen))
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
                            borderColor: isLender
                                ? AppColors.neonGreen.withOpacity(0.18)
                                : AppColors.actionRed.withOpacity(0.18),
                            child: Column(
                              children: [
                                Row(
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
                                              ? AppColors.neonGreen.withOpacity(0.3)
                                              : AppColors.actionRed.withOpacity(0.3),
                                        ),
                                      ),
                                      child: Icon(
                                        isLender
                                            ? Icons.arrow_downward_rounded
                                            : Icons.arrow_upward_rounded,
                                        color: isLender
                                            ? AppColors.neonGreen
                                            : AppColors.actionRed,
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
                                              fontSize: 15,
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
                                            color: isLender
                                                ? AppColors.neonGreen
                                                : AppColors.actionRed,
                                            fontWeight: FontWeight.bold,
                                            fontSize: 16,
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
                                            borderRadius: BorderRadius.circular(10),
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
                                if (item.status != 'paid') ...[
                                  const SizedBox(height: 12),
                                  Divider(color: Colors.white.withOpacity(0.08), height: 1),
                                  const SizedBox(height: 8),
                                  Align(
                                    alignment: Alignment.centerRight,
                                    child: GestureDetector(
                                      onTap: () => _markPaid(item.id),
                                      child: Container(
                                        padding: const EdgeInsets.symmetric(
                                            horizontal: 12, vertical: 6),
                                        decoration: BoxDecoration(
                                          color: AppColors.neonGreen.withOpacity(0.15),
                                          borderRadius: BorderRadius.circular(14),
                                          border: Border.all(
                                              color: AppColors.neonGreen.withOpacity(0.3)),
                                        ),
                                        child: const Row(
                                          mainAxisSize: MainAxisSize.min,
                                          children: [
                                            Icon(Icons.check_circle_outline_rounded,
                                                color: AppColors.neonGreen, size: 14),
                                            SizedBox(width: 4),
                                            Text(
                                              'Settle Up',
                                              style: TextStyle(
                                                color: AppColors.neonGreen,
                                                fontSize: 12,
                                                fontWeight: FontWeight.bold,
                                              ),
                                            ),
                                          ],
                                        ),
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
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 150),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        decoration: BoxDecoration(
          color: isSelected
              ? AppColors.neonGreen.withOpacity(0.18)
              : Colors.transparent,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: isSelected ? AppColors.neonGreen.withOpacity(0.35) : Colors.transparent,
          ),
        ),
        child: Text(
          label,
          style: TextStyle(
            color: isSelected ? AppColors.neonGreen : AppColors.textMuted,
            fontSize: 12,
            fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
          ),
        ),
      ),
    );
  }
}

