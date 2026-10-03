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
            // Glowing Avatar Circle
            Container(
              height: 96,
              width: 96,
              decoration: BoxDecoration(
                color: AppColors.neonGreen.withOpacity(0.12),
                shape: BoxShape.circle,
                border: Border.all(color: AppColors.neonGreen.withOpacity(0.4), width: 2),
                boxShadow: [
                  BoxShadow(
                    color: AppColors.neonGreen.withOpacity(0.3),
                    blurRadius: 24,
                    spreadRadius: 2,
                  ),
                ],
              ),
              child: Center(
                child: Text(
                  name[0].toUpperCase(),
                  style: const TextStyle(
                    color: AppColors.neonGreen,
                    fontSize: 42,
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
                fontSize: 24,
                fontWeight: FontWeight.bold,
                letterSpacing: -0.5,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              currentUser.email,
              style: TextStyle(
                color: Colors.white.withOpacity(0.5),
                fontSize: 14,
              ),
            ),

            const SizedBox(height: 28),

            // Profile Info Cards
            GlassCard(
              padding: const EdgeInsets.all(20),
              borderColor: AppColors.neonGreen.withOpacity(0.2),
              child: Column(
                children: [
                  _buildProfileRow(
                    icon: Icons.person_outline_rounded,
                    label: 'FULL NAME',
                    value: name,
                  ),
                  Divider(color: Colors.white.withOpacity(0.08), height: 24),
                  _buildProfileRow(
                    icon: Icons.email_outlined,
                    label: 'EMAIL ADDRESS',
                    value: currentUser.email,
                  ),
                  if (currentUser.mobile != null && currentUser.mobile!.isNotEmpty) ...[
                    Divider(color: Colors.white.withOpacity(0.08), height: 24),
                    _buildProfileRow(
                      icon: Icons.phone_android_rounded,
                      label: 'MOBILE NUMBER',
                      value: currentUser.mobile!,
                    ),
                  ],
                ],
              ),
            ),

            const SizedBox(height: 20),

            // App Version Info Card (Shorebird OTA enabled)
            GlassCard(
              padding: const EdgeInsets.all(20),
              borderColor: Colors.white.withOpacity(0.1),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: AppColors.neonGreen.withOpacity(0.12),
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: const Icon(
                          Icons.system_update_rounded,
                          color: AppColors.neonGreen,
                          size: 20,
                        ),
                      ),
                      const SizedBox(width: 12),
                      const Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'BroBalance Mobile',
                            style: TextStyle(
                              color: AppColors.textPrimary,
                              fontWeight: FontWeight.bold,
                              fontSize: 14,
                            ),
                          ),
                          SizedBox(height: 2),
                          Text(
                            'Live OTA Code Push Enabled',
                            style: TextStyle(
                              color: AppColors.neonGreen,
                              fontSize: 11,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.06),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: Colors.white.withOpacity(0.1)),
                    ),
                    child: const Text(
                      'v1.0.0+1',
                      style: TextStyle(color: AppColors.textPrimary, fontSize: 12, fontWeight: FontWeight.bold),
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 28),

            // Sign Out Button
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
                  borderRadius: BorderRadius.circular(28),
                  border: Border.all(color: AppColors.actionRed.withOpacity(0.35)),
                  boxShadow: [
                    BoxShadow(
                      color: AppColors.actionRed.withOpacity(0.15),
                      blurRadius: 16,
                    ),
                  ],
                ),
                child: const Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(Icons.logout_rounded, color: AppColors.actionRed, size: 20),
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
        Icon(icon, color: AppColors.neonGreen, size: 20),
        const SizedBox(width: 14),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              label,
              style: TextStyle(
                color: Colors.white.withOpacity(0.4),
                fontSize: 10,
                fontWeight: FontWeight.bold,
                letterSpacing: 1.0,
              ),
            ),
            const SizedBox(height: 3),
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

