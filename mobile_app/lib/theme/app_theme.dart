import 'package:flutter/material.dart';

class AppColors {
  static const Color bgPrimary = Color(0xFF0A0A0A);
  static const Color bgCard = Color(0xFF111111);
  static const Color bgElevated = Color(0xFF161616);
  static const Color bgHover = Color(0xFF1A1A1A);

  static const Color border = Color(0xFF1E1E1E);
  static const Color borderSubtle = Color(0xFF161616);

  static const Color actionRed = Color(0xFFF0655B);
  static const Color actionRedHover = Color(0xFFF87A72);
  static const Color actionRedGlow = Color(0x26F0655B);

  static const Color textPrimary = Color(0xFFF5F5F5);
  static const Color textSecondary = Color(0x99FFFFFF);
  static const Color textMuted = Color(0x61FFFFFF);
  static const Color textAccent = Color(0xFFD63D33);

  static const Color success = Color(0xFF4ADE80);
  static const Color warning = Color(0xFFF59E0B);

  static const LinearGradient primaryGradient = LinearGradient(
    colors: [Color(0xFFF47068), Color(0xFFF0655B), Color(0xFFD44A40)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient greenCardGradient = LinearGradient(
    colors: [
      Color(0x244ADE80),
      Color(0x0A4ADE80),
      Color(0xD90E0E0E),
    ],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient redCardGradient = LinearGradient(
    colors: [
      Color(0x24F87171),
      Color(0x0AF87171),
      Color(0xD90E0E0E),
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
