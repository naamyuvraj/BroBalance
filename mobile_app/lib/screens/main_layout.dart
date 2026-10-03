import 'dart:ui';
import 'package:flutter/material.dart';
import '../models/user_model.dart';
import '../theme/app_theme.dart';
import '../widgets/app_background.dart';
import 'auth/login_screen.dart';
import 'dashboard/dashboard_tab.dart';
import 'dashboard/friends_tab.dart';
import 'dashboard/profile_tab.dart';
import 'dashboard/transactions_tab.dart';

class MainLayout extends StatefulWidget {
  final UserModel currentUser;

  const MainLayout({super.key, required this.currentUser});

  @override
  State<MainLayout> createState() => _MainLayoutState();
}

class _MainLayoutState extends State<MainLayout> {
  int _currentIndex = 0;

  @override
  Widget build(BuildContext context) {
    final List<Widget> tabs = [
      DashboardTab(currentUser: widget.currentUser),
      const FriendsTab(),
      TransactionsTab(currentUser: widget.currentUser),
      ProfileTab(
        currentUser: widget.currentUser,
        onLogout: () {
          Navigator.of(context).pushAndRemoveUntil(
            MaterialPageRoute(builder: (_) => const LoginScreen()),
            (route) => false,
          );
        },
      ),
    ];

    return Scaffold(
      backgroundColor: AppColors.bgPrimary,
      body: AppBackground(
        child: Stack(
          children: [
            // Active Tab View with padding at bottom for floating pill
            Padding(
              padding: const EdgeInsets.only(bottom: 74),
              child: IndexedStack(
                index: _currentIndex,
                children: tabs,
              ),
            ),

            // Floating Capsule Glass Navigation Bar
            Positioned(
              left: 20,
              right: 20,
              bottom: 16,
              child: ClipRRect(
                borderRadius: BorderRadius.circular(36),
                child: BackdropFilter(
                  filter: ImageFilter.blur(sigmaX: 20, sigmaY: 20),
                  child: Container(
                    height: 64,
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
                    decoration: BoxDecoration(
                      color: const Color(0xE60A120D),
                      borderRadius: BorderRadius.circular(36),
                      border: Border.all(
                        color: AppColors.neonGreen.withOpacity(0.2),
                        width: 1,
                      ),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.5),
                          blurRadius: 24,
                          offset: const Offset(0, 8),
                        ),
                        BoxShadow(
                          color: AppColors.neonGreen.withOpacity(0.08),
                          blurRadius: 16,
                          spreadRadius: 1,
                        ),
                      ],
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceAround,
                      children: [
                        _buildNavItem(0, Icons.grid_view_rounded, 'Overview'),
                        _buildNavItem(1, Icons.people_alt_rounded, 'Friends'),
                        _buildNavItem(2, Icons.swap_horiz_rounded, 'Expenses'),
                        _buildNavItem(3, Icons.person_rounded, 'Profile'),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildNavItem(int index, IconData icon, String label) {
    final isSelected = _currentIndex == index;
    return GestureDetector(
      onTap: () => setState(() => _currentIndex = index),
      behavior: HitTestBehavior.opaque,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        curve: Curves.easeInOut,
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
        decoration: BoxDecoration(
          color: isSelected ? AppColors.neonGreen.withOpacity(0.16) : Colors.transparent,
          borderRadius: BorderRadius.circular(24),
          border: Border.all(
            color: isSelected ? AppColors.neonGreen.withOpacity(0.35) : Colors.transparent,
            width: 1,
          ),
          boxShadow: isSelected
              ? [
                  BoxShadow(
                    color: AppColors.neonGreen.withOpacity(0.2),
                    blurRadius: 12,
                  ),
                ]
              : null,
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              icon,
              color: isSelected ? AppColors.neonGreen : AppColors.textMuted,
              size: 20,
            ),
            if (isSelected) ...[
              const SizedBox(width: 6),
              Text(
                label,
                style: const TextStyle(
                  color: AppColors.neonGreen,
                  fontSize: 12,
                  fontWeight: FontWeight.bold,
                  letterSpacing: -0.2,
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}

