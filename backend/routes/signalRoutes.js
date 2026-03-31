const express = require('express');
const router = express.Router();
const { createSignal, getSignals } = require('../controllers/signalController');

router.post('/', createSignal);
router.get('/', getSignals);

module.exports = router;
