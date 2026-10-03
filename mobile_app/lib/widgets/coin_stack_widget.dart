import 'package:flutter/material.dart';

class ThreeDCoinStackWidget extends StatelessWidget {
  final double height;
  const ThreeDCoinStackWidget({super.key, this.height = 150});

  @override
  Widget build(BuildContext context) {
    return Image.asset(
      'assets/images/coins.png',
      height: height,
      fit: BoxFit.contain,
      errorBuilder: (context, error, stackTrace) {
        return Image.network(
          'https://raw.githubusercontent.com/naamyuvraj/BroBalance/main/mobile_app/assets/images/coins.png',
          height: height,
          fit: BoxFit.contain,
          errorBuilder: (context, error, stackTrace) {
            return SizedBox(
              height: height,
              width: height * 0.9,
              child: CustomPaint(
                painter: _CoinStackPainter(),
              ),
            );
          },
        );
      },
    );
  }
}

class _CoinStackPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final w = size.width;
    final h = size.height;

    // Draw stack of 4 3D gold coins
    final coinHeight = h * 0.18;
    final coinWidth = w * 0.85;

    final coinPositions = [
      Offset(w * 0.5, h * 0.75),
      Offset(w * 0.5, h * 0.58),
      Offset(w * 0.5, h * 0.41),
      Offset(w * 0.5, h * 0.24),
    ];

    for (int i = 0; i < coinPositions.length; i++) {
      final pos = coinPositions[i];
      final rect = Rect.fromCenter(
        center: pos,
        width: coinWidth - (i * 4),
        height: coinHeight,
      );

      // Shadow
      final shadowPaint = Paint()
        ..color = Colors.black.withValues(alpha: 0.4)
        ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 8);
      canvas.drawOval(rect.shift(const Offset(0, 6)), shadowPaint);

      // Coin Side (3D depth)
      final sideRect = Rect.fromCenter(
        center: pos + const Offset(0, 5),
        width: coinWidth - (i * 4),
        height: coinHeight,
      );
      final sideGradient = const LinearGradient(
        colors: [
          Color(0xFFB8860B),
          Color(0xFFDAA520),
          Color(0xFFFFD700),
          Color(0xFFB8860B),
        ],
        begin: Alignment.centerLeft,
        end: Alignment.centerRight,
      );
      final sidePaint = Paint()..shader = sideGradient.createShader(sideRect);
      canvas.drawOval(sideRect, sidePaint);

      // Coin Top
      final topGradient = const RadialGradient(
        colors: [
          Color(0xFFFFF8DC),
          Color(0xFFFFD700),
          Color(0xFFDAA520),
          Color(0xFFB8860B),
        ],
        center: Alignment.topLeft,
        radius: 1.2,
      );
      final topPaint = Paint()..shader = topGradient.createShader(rect);
      canvas.drawOval(rect, topPaint);

      // Inner Coin Rim
      final rimRect = rect.deflate(5);
      final rimPaint = Paint()
        ..color = const Color(0xFF8B6508)
        ..style = PaintingStyle.stroke
        ..strokeWidth = 2;
      canvas.drawOval(rimRect, rimPaint);

      // Currency Emblem
      final textPainter = TextPainter(
        text: const TextSpan(
          text: '₹',
          style: TextStyle(
            color: Color(0xFF7A5901),
            fontSize: 18,
            fontWeight: FontWeight.w900,
          ),
        ),
        textDirection: TextDirection.ltr,
      );
      textPainter.layout();
      textPainter.paint(
        canvas,
        pos - Offset(textPainter.width / 2, textPainter.height / 2 + 2),
      );
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
