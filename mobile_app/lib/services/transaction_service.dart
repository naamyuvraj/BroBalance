import '../models/transaction_model.dart';
import 'api_service.dart';

class TransactionService {
  static Future<DashboardStats> getStats() async {
    final res = await ApiService.get('/dashboard/stats');
    return DashboardStats.fromJson(res['data']);
  }

  static Future<List<TransactionModel>> getTransactions() async {
    final res = await ApiService.get('/transaction');
    final List list = res['data'] ?? [];
    return list.map((item) => TransactionModel.fromJson(item)).toList();
  }

  static Future<TransactionModel> createTransaction({
    required String counterpartyId,
    required double amount,
    required String description,
    required String type, // 'lent' (you gave money) or 'borrowed' (you took money)
  }) async {
    final res = await ApiService.post('/transaction', {
      'counterpartyId': counterpartyId,
      'amount': amount,
      'description': description,
      'type': type,
    });
    return TransactionModel.fromJson(res['data']);
  }

  static Future<void> markAsPaid(String transactionId) async {
    await ApiService.patch('/transaction/$transactionId/pay');
  }
}
