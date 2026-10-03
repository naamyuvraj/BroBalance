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
    final bottomPadding = MediaQuery.of(context).padding.bottom;
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
            Positioned.fill(
              child: Padding(
                padding: EdgeInsets.only(bottom: 74 + bottomPadding),
                child: IndexedStack(
                  index: _currentIndex,
                  children: tabs,
                ),
              ),
            ),

            // Floating 5-Tab Glass Navigation Bar matching target reference screenshot
            Positioned(
              left: 20,
              right: 20,
              bottom: (bottomPadding > 0 ? bottomPadding : 16.0) + 4,
              child: ClipRRect(
                borderRadius: BorderRadius.circular(40),
                child: BackdropFilter(
                  filter: ImageFilter.blur(sigmaX: 24, sigmaY: 24),
                  child: Container(
                    height: 62,
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                    decoration: BoxDecoration(
                      color: const Color(0xF5121212),
                      borderRadius: BorderRadius.circular(40),
                      border: Border.all(
                        color: const Color(0x26FFFFFF),
                        width: 1.2,
                      ),
                      boxShadow: const [
                        BoxShadow(
                          color: Color(0xB3000000),
                          blurRadius: 24,
                          offset: Offset(0, 8),
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
        duration: const Duration(milliseconds: 180),
        width: 44,
        height: 44,
        decoration: BoxDecoration(
          color: isSelected ? const Color(0xFFF0655B) : Colors.transparent,
          shape: BoxShape.circle,
          boxShadow: isSelected
              ? const [
                  BoxShadow(
                    color: Color(0x73F0655B),
                    blurRadius: 14,
                    spreadRadius: 1,
                  ),
                ]
              : null,
        ),
        child: Center(
          child: Icon(
            isSelected ? filledIcon : outlineIcon,
            color: isSelected ? Colors.white : const Color(0x99FFFFFF),
            size: isSelected ? 22 : 21,
          ),
        ),
      ),
    );
  }
}
