const { Router } = require('express');
const newsletterController = require('./newsletter.controller');

const router = Router();

router.post('/subscribe', newsletterController.subscribe);
router.post('/unsubscribe', newsletterController.unsubscribe);

router.get('/subscribers', newsletterController.getSubscribers);

module.exports = router;
