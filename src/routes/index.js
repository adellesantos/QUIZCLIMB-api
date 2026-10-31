// The single place that maps URLs to route files.
const { Router } = require('express');

const router = Router();

// Hub Contract endpoints
router.use('/health', require('./health.routes'));
router.use('/game-info', require('./game-info.routes'));
router.use('/results', require('./results.routes'));

// Week 11 Module 1: question-sets CRUD
router.use('/question-sets', require('./question-sets.routes'));

// Week 11 Module 2: sessions
router.use('/sessions', require('./sessions.routes'));

module.exports = router;
