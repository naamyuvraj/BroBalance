import 'package:flutter/material.dart';
import '../services/friend_service.dart';
import '../theme/app_theme.dart';
import 'primary_button.dart';

class AddFriendModal extends StatefulWidget {
  final VoidCallback onFriendAdded;

  const AddFriendModal({super.key, required this.onFriendAdded});

  @override
  State<AddFriendModal> createState() => _AddFriendModalState();
}

class _AddFriendModalState extends State<AddFriendModal> {
  final _emailController = TextEditingController();
  bool _isLoading = false;
  String? _errorMessage;
  String? _successMessage;

  Future<void> _handleSendRequest() async {
    final query = _emailController.text.trim();
    if (query.isEmpty) return;

    setState(() {
      _isLoading = true;
      _errorMessage = null;
      _successMessage = null;
    });

    try {
      await FriendService.sendRequest(query);
      setState(() {
        _successMessage = 'Friend request sent successfully!';
        _isLoading = false;
      });
      widget.onFriendAdded();
      Future.delayed(const Duration(seconds: 1), () {
        if (mounted) Navigator.of(context).pop();
      });
    } catch (e) {
      setState(() {
        _errorMessage = e.toString();
        _isLoading = false;
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
      decoration: const BoxDecoration(
        color: Color(0xFF141414),
        borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'Add a Friend',
                style: TextStyle(
                  color: AppColors.textPrimary,
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                ),
              ),
              IconButton(
                icon: const Icon(Icons.close, color: AppColors.textMuted),
                onPressed: () => Navigator.of(context).pop(),
              ),
            ],
          ),
          const SizedBox(height: 8),
          const Text(
            'Enter your friend\'s email address to send a friend request.',
            style: TextStyle(color: AppColors.textSecondary, fontSize: 13),
          ),
          const SizedBox(height: 20),

          if (_errorMessage != null) ...[
            Text(
              _errorMessage!,
              style: const TextStyle(color: AppColors.actionRed, fontSize: 13),
            ),
            const SizedBox(height: 12),
          ],

          if (_successMessage != null) ...[
            Text(
              _successMessage!,
              style: const TextStyle(color: AppColors.success, fontSize: 13),
            ),
            const SizedBox(height: 12),
          ],

          TextField(
            controller: _emailController,
            keyboardType: TextInputType.emailAddress,
            style: const TextStyle(color: AppColors.textPrimary),
            decoration: InputDecoration(
              hintText: 'friend@example.com',
              hintStyle: TextStyle(color: Colors.white.withOpacity(0.2)),
              filled: true,
              fillColor: Colors.white.withOpacity(0.04),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(14),
                borderSide: BorderSide(color: Colors.white.withOpacity(0.08)),
              ),
            ),
          ),
          const SizedBox(height: 20),

          PrimaryButton(
            text: 'Send Friend Request',
            isLoading: _isLoading,
            onPressed: _handleSendRequest,
          ),
        ],
      ),
    );
  }
}
