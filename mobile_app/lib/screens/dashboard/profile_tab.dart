import 'package:flutter/material.dart';
import '../../models/user_model.dart';
import '../../services/auth_service.dart';
import '../../theme/app_theme.dart';
import '../../widgets/glass_card.dart';

class ProfileTab extends StatelessWidget {
  final UserModel currentUser;
  final VoidCallback onLogout;

  const ProfileTab({
    super.key,
    required this.currentUser,
    required this.onLogout,
  });

  @override
  Widget build(BuildContext context) {
    final name = currentUser.name ?? currentUser.email.split('@').first;

    return SafeArea(
      child: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 20),
        child: Column(
          children: [
            const SizedBox(height: 10),
            // Avatar Circle
            Container(
              height: 90,
              width: 90,
              decoration: BoxDecoration(
                color: AppColors.actionRed.withOpacity(0.15),
                shape: BoxShape.circle,
                border: Border.all(color: AppColors.actionRed.withOpacity(0.4), width: 2),
                boxShadow: [
                  BoxShadow(
                    color: AppColors.actionRed.withOpacity(0.3),
                    blurRadius: 20,
                  ),
                ],
              ),
              child: Center(
                child: Text(
                  name[0].toUpperCase(),
                  style: const TextStyle(
                    color: AppColors.actionRed,
                    fontSize: 38,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ),
            const SizedBox(height: 16),

            Text(
              name,
              style: const TextStyle(
                color: AppColors.textPrimary,
                fontSize: 22,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              currentUser.email,
              style: const TextStyle(
                color: AppColors.textSecondary,
                fontSize: 14,
              ),
            ),

            const SizedBox(height: 32),

            // Profile Info Cards
            GlassCard(
              padding: const EdgeInsets.all(20),
              child: Column(
                children: [
                  _buildProfileRow(
                    icon: Icons.person_outline,
                    label: 'Full Name',
                    value: name,
                  ),
                  const Divider(color: Color(0xFF262626), height: 24),
                  _buildProfileRow(
                    icon: Icons.email_outlined,
                    label: 'Email',
                    value: currentUser.email,
                  ),
                  if (currentUser.mobile != null && currentUser.mobile!.isNotEmpty) ...[
                    const Divider(color: Color(0xFF262626), height: 24),
                    _buildProfileRow(
                      icon: Icons.phone_android_outlined,
                      label: 'Mobile',
                      value: currentUser.mobile!,
                    ),
                  ],
                ],
              ),
            ),

            const SizedBox(height: 24),

            // App Version Info Card
            GlassCard(
              padding: const EdgeInsets.all(20),
              child: const Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      Icon(Icons.info_outline, color: AppColors.textMuted, size: 20),
                      SizedBox(width: 12),
                      Text(
                        'BroBalance Mobile',
                        style: TextStyle(
                            color: AppColors.textPrimary,
                            fontWeight: FontWeight.w600),
                      ),
                    ],
                  ),
                  Text(
                    'v1.0.0 (Flutter)',
                    style: TextStyle(color: AppColors.textMuted, fontSize: 13),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 32),

            // Logout Button
            GestureDetector(
              onTap: () async {
                await AuthService.logout();
                onLogout();
              },
              child: Container(
                width: double.infinity,
                padding: const EdgeInsets.symmetric(vertical: 16),
                decoration: BoxDecoration(
                  color: AppColors.actionRed.withOpacity(0.12),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: AppColors.actionRed.withOpacity(0.3)),
                ),
                child: const Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(Icons.logout, color: AppColors.actionRed, size: 20),
                    SizedBox(width: 8),
                    Text(
                      'Sign Out',
                      style: TextStyle(
                        color: AppColors.actionRed,
                        fontWeight: FontWeight.bold,
                        fontSize: 15,
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 20),
          ],
        ),
      ),
    );
  }

  Widget _buildProfileRow({
    required IconData icon,
    required String label,
    required String value,
  }) {
    return Row(
      children: [
        Icon(icon, color: AppColors.textMuted, size: 20),
        const SizedBox(width: 14),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              label,
              style: const TextStyle(color: AppColors.textMuted, fontSize: 11),
            ),
            const SizedBox(height: 2),
            Text(
              value,
              style: const TextStyle(
                color: AppColors.textPrimary,
                fontSize: 14,
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
      ],
    );
  }
}
