const TransactionService = require('./transaction.service');

class TransactionController {
    static async getAll(req: any, res: any, next: any) {
        try {
            const userId = req.user.id;
            const filters = {
                friendId: req.query.friendId,
                type: req.query.type,
                limit: parseInt(req.query.limit) || 0,
                sort: req.query.sort || 'recent',
            };
            const transactions = await TransactionService.getAll(userId, filters);
            res.json({ success: true, data: transactions });
        } catch (error) {
            next(error);
        }
    }
    static async create(req: any, res: any, next: any) {
        try{
            const userId=req.user.id;
            const create ={
                friendId:req.body.friendId,
                amount:req.body.amount,
                type:req.body.type,
                description:req.body.description 
            }
            const transction = await TransactionService.create(userId,create)
            res.status(201).json({success:true,data:transction})
        } catch (error) {
            next(error);
        }
    }
    static async markAsPaid(req: any, res: any, next: any) {
        try{
            const transactionId = req.params.id;
            const userId = req.user.id;
            const paidAmount = req.body.paidAmount;
            await TransactionService.markAsPaid(transactionId, userId, paidAmount);
            res.json({ success: true, message: 'Transaction updated' });
        } catch (error) {
            next(error);
        }
    }
    static async getStats(req: any, res: any, next: any) {
        try{
            const userId = req.user.id;
            const stats = await TransactionService.getStats(userId);
            res.json({ success: true, data: stats });
        } catch (error) {
            next(error);
        }
    }
}
module.exports = TransactionController;