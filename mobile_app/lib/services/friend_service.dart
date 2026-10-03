import '../models/friend_model.dart';
import '../models/user_model.dart';
import 'api_service.dart';

class FriendService {
  static Future<List<FriendModel>> getFriends() async {
    final res = await ApiService.get('/friend');
    final List list = res['data'] ?? [];
    return list.map((item) => FriendModel.fromJson(item)).toList();
  }

  static Future<List<FriendRequestModel>> getPendingRequests() async {
    final res = await ApiService.get('/friend/requests/pending');
    final List list = res['data'] ?? [];
    return list.map((item) => FriendRequestModel.fromJson(item)).toList();
  }

  static Future<void> sendRequest(String emailOrUsername) async {
    await ApiService.post('/friend/request', {
      'friendIdentifier': emailOrUsername,
    });
  }

  static Future<void> acceptRequest(String requestId) async {
    await ApiService.post('/friend/request/$requestId/accept', {});
  }

  static Future<void> declineRequest(String requestId) async {
    await ApiService.post('/friend/request/$requestId/decline', {});
  }

  static Future<List<UserModel>> searchUsers(String query) async {
    final res = await ApiService.get('/user/search?q=$query');
    final List list = res['data'] ?? [];
    return list.map((item) => UserModel.fromJson(item)).toList();
  }
}
