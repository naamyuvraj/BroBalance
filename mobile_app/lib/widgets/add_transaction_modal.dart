import 'package:flutter/material.dart';
import '../models/friend_model.dart';
import '../services/friend_service.dart';
import '../services/transaction_service.dart';
import '../theme/app_theme.dart';
import 'primary_button.dart';

class AddTransactionModal extends StatefulWidget {
  final VoidCallback onTransactionAdded;

  const AddTransactionModal({super.key, required this.onTransactionAdded});

  @override
  State<AddTransactionModal> createState() => _AddTransactionModalState();
}

class _AddTransactionModalState extends State<AddTransactionModal> {
  final _formKey = GlobalKey<FormState>();
  final _amountController = TextEditingController();
  final _descriptionController = TextEditingController();

  List<FriendModel> _friends = [];
  FriendModel? _selectedFriend;
  String _type = 'lent'; // 'lent' (you gave) or 'borrowed' (you took)
  bool _isLoadingFriends = true;
  bool _isSubmitting = false;
  String? _errorMessage;

  @override
  void initState() {
    super.initState();
    _loadFriends();
  }

  Future<void> _loadFriends() async {
    try {
      final list = await FriendService.getFriends();
      setState(() {
        _friends = list;
        if (_friends.isNotEmpty) {
          _selectedFriend = _friends.first;
        }
        _isLoadingFriends = false;
      });
    } catch (_) {
      setState(() {
        _isLoadingFriends = false;
      });
    }
  }

  Future<void> _handleSubmit() async {
    if (!_formKey.currentState!.validate()) return;
    if (_selectedFriend == null) {
      setState(() {
        _errorMessage = 'Please select a friend first';
      });
      return;
    }

    setState(() {
      _isSubmitting = true;
      _errorMessage = null;
    });

    try {
      final amount = double.parse(_amountController.text.trim());
      await TransactionService.createTransaction(
        counterpartyId: _selectedFriend!.user.id,
        amount: amount,
        description: _descriptionController.text.trim(),
        type: _type,
      );

      if (!mounted) return;
      Navigator.of(context).pop();
      widget.onTransactionAdded();
    } catch (e) {
      setState(() {
        _errorMessage = e.toString();
        _isSubmitting = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.only(
        bottom: MediaQuery.of(context).viewInsets.bottom + 24,
        top: 24,
        left: 24,
        right: 24,
      ),
      decoration: BoxDecoration(
        color: const Color(0xFF141414),
        borderRadius: const BorderRadius.vertical(top: Radius.circular(28)),
        border: Border.all(
          color: Colors.white.withOpacity(0.08),
          width: 1,
        ),
      ),
      child: SingleChildScrollView(
        child: Form(
          key: _formKey,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header Row
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'Record Expense',
                    style: TextStyle(
                      color: AppColors.textPrimary,
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.close_rounded, color: AppColors.textMuted),
                    onPressed: () => Navigator.of(context).pop(),
                  ),
                ],
              ),
              const SizedBox(height: 16),

              if (_errorMessage != null) ...[
                Text(
                  _errorMessage!,
                  style: const TextStyle(color: AppColors.actionRed, fontSize: 13),
                ),
                const SizedBox(height: 12),
              ],

              // Capsule Pill Type Selector (Lent vs Borrowed)
              Container(
                padding: const EdgeInsets.all(4),
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.04),
                  borderRadius: BorderRadius.circular(24),
                  border: Border.all(color: Colors.white.withOpacity(0.08)),
                ),
                child: Row(
                  children: [
                    Expanded(
                      child: GestureDetector(
                        onTap: () => setState(() => _type = 'lent'),
                        child: AnimatedContainer(
                          duration: const Duration(milliseconds: 180),
                          padding: const EdgeInsets.symmetric(vertical: 12),
                          decoration: BoxDecoration(
                            color: _type == 'lent'
                                ? AppColors.successGreen.withOpacity(0.18)
                                : Colors.transparent,
                            borderRadius: BorderRadius.circular(20),
                            border: _type == 'lent'
                                ? Border.all(color: AppColors.successGreen.withOpacity(0.4))
                                : Border.all(color: Colors.transparent),
                          ),
                          child: Center(
                            child: Text(
                              'I Lent Money',
                              style: TextStyle(
                                color: _type == 'lent'
                                    ? AppColors.successGreen
                                    : AppColors.textMuted,
                                fontWeight: FontWeight.bold,
                                fontSize: 13,
                              ),
                            ),
                          ),
                        ),
                      ),
                    ),
                    Expanded(
                      child: GestureDetector(
                        onTap: () => setState(() => _type = 'borrowed'),
                        child: AnimatedContainer(
                          duration: const Duration(milliseconds: 180),
                          padding: const EdgeInsets.symmetric(vertical: 12),
                          decoration: BoxDecoration(
                            color: _type == 'borrowed'
                                ? AppColors.actionRed.withOpacity(0.18)
                                : Colors.transparent,
                            borderRadius: BorderRadius.circular(20),
                            border: _type == 'borrowed'
                                ? Border.all(color: AppColors.actionRed.withOpacity(0.4))
                                : Border.all(color: Colors.transparent),
                          ),
                          child: Center(
                            child: Text(
                              'I Borrowed',
                              style: TextStyle(
                                color: _type == 'borrowed'
                                    ? AppColors.actionRed
                                    : AppColors.textMuted,
                                fontWeight: FontWeight.bold,
                                fontSize: 13,
                              ),
                            ),
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20),

              // Select Friend Dropdown
              const Text(
                'FRIEND',
                style: TextStyle(
                  color: AppColors.textMuted,
                  fontSize: 11,
                  fontWeight: FontWeight.w600,
                  letterSpacing: 1,
                ),
              ),
              const SizedBox(height: 8),
              _isLoadingFriends
                  ? const Center(
                      child: CircularProgressIndicator(color: AppColors.actionRed))
                  : _friends.isEmpty
                      ? const Text(
                          'No friends added yet. Add a friend first!',
                          style: TextStyle(color: AppColors.textMuted, fontSize: 13),
                        )
                      : Container(
                          padding: const EdgeInsets.symmetric(horizontal: 16),
                          decoration: BoxDecoration(
                            color: Colors.white.withOpacity(0.04),
                            borderRadius: BorderRadius.circular(14),
                            border: Border.all(color: Colors.white.withOpacity(0.08)),
                          ),
                          child: DropdownButtonHideUnderline(
                            child: DropdownButton<FriendModel>(
                              value: _selectedFriend,
                              isExpanded: true,
                              dropdownColor: const Color(0xFF1E1E1E),
                              style: const TextStyle(color: AppColors.textPrimary),
                              items: _friends.map((f) {
                                return DropdownMenuItem(
                                  value: f,
                                  child: Text(f.user.name ?? f.user.email),
                                );
                              }).toList(),
                              onChanged: (val) {
                                setState(() => _selectedFriend = val);
                              },
                            ),
                          ),
                        ),
              const SizedBox(height: 16),

              // Amount Field
              const Text(
                'AMOUNT (₹)',
                style: TextStyle(
                  color: AppColors.textMuted,
                  fontSize: 11,
                  fontWeight: FontWeight.w600,
                  letterSpacing: 1,
                ),
              ),
              const SizedBox(height: 8),
              TextFormField(
                controller: _amountController,
                keyboardType: const TextInputType.numberWithOptions(decimal: true),
                style: const TextStyle(color: AppColors.textPrimary, fontSize: 18),
                decoration: InputDecoration(
                  hintText: '0.00',
                  hintStyle: TextStyle(color: Colors.white.withOpacity(0.2)),
                  prefixText: '₹ ',
                  prefixStyle: const TextStyle(
                      color: AppColors.actionRed, fontWeight: FontWeight.bold),
                  filled: true,
                  fillColor: Colors.white.withOpacity(0.04),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(14),
                    borderSide: BorderSide(color: Colors.white.withOpacity(0.08)),
                  ),
                ),
                validator: (val) {
                  if (val == null || val.trim().isEmpty) return 'Enter amount';
                  if (double.tryParse(val.trim()) == null) return 'Enter a valid number';
                  return null;
                },
              ),
              const SizedBox(height: 16),

              // Description Field
              const Text(
                'DESCRIPTION / NOTE',
                style: TextStyle(
                  color: AppColors.textMuted,
                  fontSize: 11,
                  fontWeight: FontWeight.w600,
                  letterSpacing: 1,
                ),
              ),
              const SizedBox(height: 8),
              TextFormField(
                controller: _descriptionController,
                style: const TextStyle(color: AppColors.textPrimary),
                decoration: InputDecoration(
                  hintText: 'e.g. Dinner, Movie tickets, Canteen',
                  hintStyle: TextStyle(color: Colors.white.withOpacity(0.2)),
                  filled: true,
                  fillColor: Colors.white.withOpacity(0.04),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(14),
                    borderSide: BorderSide(color: Colors.white.withOpacity(0.08)),
                  ),
                ),
                validator: (val) =>
                    val == null || val.trim().isEmpty ? 'Enter description' : null,
              ),
              const SizedBox(height: 24),

              PrimaryButton(
                text: 'Save Transaction',
                isLoading: _isSubmitting,
                onPressed: _handleSubmit,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
