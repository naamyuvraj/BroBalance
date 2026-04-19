const { Router } = require('express');
const newsletterController = require('./newsletter.controller');

const router = Router();

// public — anyone can subscribe/unsubscribe
router.post('/subscribe', newsletterController.subscribe);
router.post('/unsubscribe', newsletterController.unsubscribe);

// admin / internal — list subscribers (could add auth middleware later)
router.get('/subscribers', newsletterController.getSubscribers);

module.exports = router;
