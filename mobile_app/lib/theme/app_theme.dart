import 'package:flutter/material.dart';

class AppColors {
  static const Color bgPrimary = Color(0xFF050B08);
  static const Color bgCard = Color(0xFF0C140F);
  static const Color bgCardElevated = Color(0xFF111C15);
  static const Color bgHover = Color(0xFF17241C);

  static const Color border = Color(0xFF1B2B20);
  static const Color borderSubtle = Color(0x1AFFFFFF);
  static const Color borderGreen = Color(0x4000FF66);
  static const Color borderRed = Color(0x40F0655B);

  static const Color actionRed = Color(0xFFF0655B);
  static const Color actionRedHover = Color(0xFFF87A72);
  static const Color actionRedGlow = Color(0x26F0655B);

  static const Color neonGreen = Color(0xFF00FF66);
  static const Color successGreen = Color(0xFF4ADE80);
  static const Color success = Color(0xFF4ADE80);
  static const Color greenGlow = Color(0x2600FF66);

  static const Color textPrimary = Color(0xFFF5F5F5);
  static const Color textSecondary = Color(0x99FFFFFF);
  static const Color textMuted = Color(0x61FFFFFF);
  static const Color textAccent = Color(0xFF00FF66);

  static const Color warning = Color(0xFFF59E0B);

  static const LinearGradient primaryGradient = LinearGradient(
    colors: [Color(0xFFF47068), Color(0xFFF0655B), Color(0xFFD44A40)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient greenPrimaryGradient = LinearGradient(
    colors: [Color(0xFF00FF66), Color(0xFF10B981), Color(0xFF059669)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient greenCardGradient = LinearGradient(
    colors: [
      Color(0x3300FF66),
      Color(0x0D00FF66),
      Color(0xF0080E0A),
    ],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient redCardGradient = LinearGradient(
    colors: [
      Color(0x33F0655B),
      Color(0x0DF0655B),
      Color(0xF0080E0A),
    ],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );
}

class AppTheme {
  static ThemeData get darkTheme {
    return ThemeData.dark().copyWith(
      scaffoldBackgroundColor: AppColors.bgPrimary,
      primaryColor: AppColors.actionRed,
      colorScheme: const ColorScheme.dark(
        primary: AppColors.actionRed,
        secondary: AppColors.neonGreen,
        surface: AppColors.bgCard,
        error: AppColors.actionRed,
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: Colors.transparent,
        elevation: 0,
        centerTitle: false,
        titleTextStyle: TextStyle(
          color: AppColors.textPrimary,
          fontSize: 20,
          fontWeight: FontWeight.w600,
        ),
      ),
    );
  }
}

