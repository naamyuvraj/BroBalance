class AppConfig {
  // Production Render API URL as primary, with easy toggle for local dev
  static const String defaultApiUrl = 'https://brobalance.onrender.com/api';
  static const String localApiUrl = 'http://10.0.2.2:8000/api'; // Android Emulator default
  
  static String baseUrl = defaultApiUrl;
}
