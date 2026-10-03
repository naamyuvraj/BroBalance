import '../models/user_model.dart';
import 'api_service.dart';

class AuthService {
  static Future<UserModel> login(String email, String password) async {
    final res = await ApiService.post('/auth/login', {
      'email': email,
      'password': password,
    });
    final token = res['data']['token'];
    await ApiService.saveToken(token);
    return UserModel.fromJson(res['data']['user']);
  }

  static Future<UserModel> register({
    required String name,
    required String email,
    required String password,
    String? mobile,
  }) async {
    final res = await ApiService.post('/auth/register', {
      'name': name,
      'email': email,
      'password': password,
      if (mobile != null && mobile.isNotEmpty) 'mobile': mobile,
    });
    final token = res['data']['token'];
    await ApiService.saveToken(token);
    return UserModel.fromJson(res['data']['user']);
  }

  static Future<UserModel?> getCurrentUser() async {
    try {
      final res = await ApiService.get('/user/me');
      return UserModel.fromJson(res['data'] ?? res['user']);
    } catch (_) {
      return null;
    }
  }

  static Future<void> logout() async {
    try {
      await ApiService.post('/auth/logout', {});
    } catch (_) {}
    await ApiService.clearToken();
  }
}
