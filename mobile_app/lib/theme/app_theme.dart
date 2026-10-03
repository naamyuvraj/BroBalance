import 'package:flutter/material.dart';

class AppColors {
  static const Color bgPrimary = Color(0xFF070707);
  static const Color bgCard = Color(0xFF121212);
  static const Color bgCardElevated = Color(0xFF171717);

  static const Color border = Color(0xFF1F1F1F);
  static const Color borderRed = Color(0xFF381512);
  static const Color borderGreen = Color(0xFF0F301B);

  static const Color actionRed = Color(0xFFF0655B);
  static const Color actionRedHover = Color(0xFFF87A72);
  static const Color actionRedGlow = Color(0x40F0655B);

  static const Color successGreen = Color(0xFF4ADE80);
  static const Color success = Color(0xFF4ADE80);
  static const Color neonGreen = Color(0xFF4ADE80);
  static const Color greenGlow = Color(0x334ADE80);

  static const Color textPrimary = Color(0xFFFFFFFF);
  static const Color textSecondary = Color(0x99FFFFFF);
  static const Color textMuted = Color(0x61FFFFFF);

  static const LinearGradient primaryGradient = LinearGradient(
    colors: [Color(0xFFF47068), Color(0xFFF0655B), Color(0xFFD44A40)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient greenPrimaryGradient = LinearGradient(
    colors: [Color(0xFF4ADE80), Color(0xFF10B981)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient redCardGradient = LinearGradient(
    colors: [Color(0x2B2B0F0D), Color(0x1F121212)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient greenCardGradient = LinearGradient(
    colors: [Color(0x2B0D2818), Color(0x1F121212)],
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
        secondary: AppColors.actionRed,
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
