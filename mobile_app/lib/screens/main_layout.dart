import 'dart:ui';
import 'package:flutter/material.dart';
import '../models/user_model.dart';
import '../theme/app_theme.dart';
import '../widgets/add_friend_modal.dart';
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

  void _openFindPeopleModal() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => const AddFriendModal(),
    );
  }

  void _switchTab(int index) {
    if (index == 4) {
      // 5th tab is Search / Find People modal
      _openFindPeopleModal();
    } else {
      setState(() => _currentIndex = index);
    }
  }

  @override
  Widget build(BuildContext context) {
    final List<Widget> tabs = [
      DashboardTab(
        currentUser: widget.currentUser,
        onNavigateToFriends: () => setState(() => _currentIndex = 3),
        onNavigateToTransactions: () => setState(() => _currentIndex = 2),
      ),
      ProfileTab(
        currentUser: widget.currentUser,
        onLogout: () {
          Navigator.of(context).pushAndRemoveUntil(
            MaterialPageRoute(builder: (_) => const LoginScreen()),
            (route) => false,
          );
        },
      ),
      TransactionsTab(currentUser: widget.currentUser),
      const FriendsTab(),
    ];

    return Scaffold(
      backgroundColor: AppColors.bgPrimary,
      body: AppBackground(
        child: Stack(
          children: [
            // Active Tab Content
            Padding(
              padding: const EdgeInsets.only(bottom: 70),
              child: IndexedStack(
                index: _currentIndex,
                children: tabs,
              ),
            ),

            // Floating 5-Tab Glass Navigation Bar
            Positioned(
              left: 24,
              right: 24,
              bottom: 18,
              child: ClipRRect(
                borderRadius: BorderRadius.circular(40),
                child: BackdropFilter(
                  filter: ImageFilter.blur(sigmaX: 20, sigmaY: 20),
                  child: Container(
                    height: 62,
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                    decoration: BoxDecoration(
                      color: const Color(0xE6101010),
                      borderRadius: BorderRadius.circular(40),
                      border: Border.all(
                        color: Colors.white.withOpacity(0.08),
                        width: 1,
                      ),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.6),
                          blurRadius: 24,
                          offset: const Offset(0, 8),
                        ),
                      ],
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceAround,
                      children: [
                        _buildNavItem(0, Icons.home_outlined, Icons.home_rounded),
                        _buildNavItem(1, Icons.person_outline_rounded, Icons.person_rounded),
                        _buildNavItem(2, Icons.swap_horiz_rounded, Icons.swap_horiz_rounded),
                        _buildNavItem(3, Icons.people_outline_rounded, Icons.people_rounded),
                        _buildNavItem(4, Icons.search_rounded, Icons.search_rounded),
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

  Widget _buildNavItem(int index, IconData outlineIcon, IconData filledIcon) {
    final isSelected = _currentIndex == index;
    return GestureDetector(
      onTap: () => _switchTab(index),
      behavior: HitTestBehavior.opaque,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        width: 44,
        height: 44,
        decoration: BoxDecoration(
          color: isSelected ? AppColors.actionRed : Colors.transparent,
          shape: BoxShape.circle,
          boxShadow: isSelected
              ? [
                  BoxShadow(
                    color: AppColors.actionRed.withOpacity(0.4),
                    blurRadius: 14,
                    spreadRadius: 1,
                  ),
                ]
              : null,
        ),
        child: Center(
          child: Icon(
            isSelected ? filledIcon : outlineIcon,
            color: isSelected ? Colors.white : Colors.white.withOpacity(0.4),
            size: isSelected ? 22 : 20,
          ),
        ),
      ),
    );
  }
}
