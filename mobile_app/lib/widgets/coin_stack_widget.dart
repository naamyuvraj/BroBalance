import 'package:flutter/material.dart';

class ThreeDCoinStackWidget extends StatelessWidget {
  final double height;
  const ThreeDCoinStackWidget({super.key, this.height = 150});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: height,
      width: height * 1.0,
      child: Stack(
        alignment: Alignment.center,
        children: [
          // 3D Metallic Gold Glow Background
          Positioned(
            bottom: 10,
            child: Container(
              height: 40,
              width: height * 0.8,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                boxShadow: [
                  BoxShadow(
                    color: const Color(0xFFFFC107).withValues(alpha: 0.35),
                    blurRadius: 30,
                    spreadRadius: 10,
                  ),
                ],
              ),
            ),
          ),
          // Custom 3D Metallic Gold Coin Stack
          CustomPaint(
            size: Size(height * 1.0, height),
            painter: _VibrantCoinStackPainter(),
          ),
        ],
      ),
    );
  }
}

class _VibrantCoinStackPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final w = size.width;
    final h = size.height;

    // 5 stacked 3D gold coins with offset 3D depth
    final coinWidth = w * 0.82;
    final coinHeight = h * 0.22;
    final depth = 12.0;

    final coins = [
      Offset(w * 0.50, h * 0.76),
      Offset(w * 0.52, h * 0.62),
      Offset(w * 0.48, h * 0.48),
      Offset(w * 0.51, h * 0.34),
      Offset(w * 0.49, h * 0.20),
    ];

    for (int i = 0; i < coins.length; i++) {
      final center = coins[i];
      final rectTop = Rect.fromCenter(
        center: center,
        width: coinWidth - (i * 2),
        height: coinHeight,
      );

      // Bottom shadow
      final shadowPath = Path()..addOval(rectTop.shift(Offset(0, depth + 4)));
      canvas.drawPath(
        shadowPath,
        Paint()
          ..color = const Color(0x77000000)
          ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 6),
      );

      // 3D Cylindrical Side Extrusion
      final sidePath = Path();
      sidePath.moveTo(rectTop.left, center.dy);
      sidePath.arcTo(rectTop, 3.14159, -3.14159, false);
      sidePath.lineTo(rectTop.right, center.dy + depth);
      final rectBottom = rectTop.shift(Offset(0, depth));
      sidePath.arcTo(rectBottom, 0, 3.14159, false);
      sidePath.lineTo(rectTop.left, center.dy);

      final sideGradient = const LinearGradient(
        colors: [
          Color(0xFF8B6508),
          Color(0xFFDAA520),
          Color(0xFFFFD700),
          Color(0xFFFFF8DC),
          Color(0xFFDAA520),
          Color(0xFF8B6508),
        ],
        stops: [0.0, 0.2, 0.45, 0.6, 0.8, 1.0],
        begin: Alignment.centerLeft,
        end: Alignment.centerRight,
      );
      canvas.drawPath(
        sidePath,
        Paint()..shader = sideGradient.createShader(rectBottom),
      );

      // Coin Top Face (Glossy Metallic Gold)
      final topGradient = const LinearGradient(
        colors: [
          Color(0xFFFFF9E6),
          Color(0xFFFFDF00),
          Color(0xFFD4AF37),
          Color(0xFFA67C00),
        ],
        begin: Alignment.topLeft,
        end: Alignment.bottomRight,
      );
      canvas.drawOval(
        rectTop,
        Paint()..shader = topGradient.createShader(rectTop),
      );

      // Inner Coin Rim Highlight
      final rimRect = rectTop.deflate(4.5);
      canvas.drawOval(
        rimRect,
        Paint()
          ..color = const Color(0xFFB8860B)
          ..style = PaintingStyle.stroke
          ..strokeWidth = 2.0,
      );

      // Coin Center Emblem ($ / ₹)
      final textPainter = TextPainter(
        text: TextSpan(
          text: i % 2 == 0 ? '₹' : '\$',
          style: TextStyle(
            color: const Color(0xFF7A5901),
            fontSize: 16 - (i * 0.5),
            fontWeight: FontWeight.w900,
            shadows: const [
              Shadow(
                color: Color(0x66FFFFFF),
                offset: Offset(0.5, 0.5),
              ),
            ],
          ),
        ),
        textDirection: TextDirection.ltr,
      );
      textPainter.layout();
      textPainter.paint(
        canvas,
        center - Offset(textPainter.width / 2, textPainter.height / 2 + 1),
      );
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
