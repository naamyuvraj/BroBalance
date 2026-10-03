const { Router } = require('express');
const TripController = require('./trip.controller');
const authMiddleware = require('../../middlewares/auth.middleware');

const router = Router();

router.use(authMiddleware);

router.post('/', TripController.createTrip);
router.get('/', TripController.getUserTrips);
router.get('/:id', TripController.getTripDetails);
router.post('/:id/expenses', TripController.addExpense);
router.delete('/:id/expenses/:expenseId', TripController.deleteExpense);
router.post('/:id/members', TripController.addMember);

module.exports = router;
