const { Router } = require('express');
const { body, param } = require('express-validator');
const currentUser = require('../middlewares/current-user');
const { requireUser } = require('../middlewares/require-user');
const { validate } = require('../middlewares/validate');
const controller = require('../controllers/sessions.controller');

const router = Router();

const sessionCodeParam = param('code')
  .matches(/^[1-9][0-9]{5}$/)
  .withMessage('session code must be six digits starting with 1-9.');

const createSessionBody = [
  body('question_set_id').isInt({ min: 1 }).withMessage('question_set_id is required and must be a positive integer.'),
];

const joinBody = [
  body('nickname').trim().notEmpty().withMessage('nickname is required.').isLength({ min: 2, max: 20 }).withMessage('nickname must be 2 to 20 characters.'),
];

const patchSessionBody = [
  body('status').isIn(['LOBBY', 'RUNNING', 'CLOSED']).withMessage("status must be 'LOBBY', 'RUNNING', or 'CLOSED'."),
  body('question_set_id').optional().isInt({ min: 1 }).withMessage('question_set_id must be a positive integer.'),
  body().custom((value, { req }) => {
    if (!req.body || Object.keys(req.body).length === 0) {
      throw new Error('At least one field must be provided for update.');
    }
    return true;
  }),
];

// POST /api/v1/sessions - create session (host only)
router.post('/', currentUser, requireUser('HOST', 'ADMIN'), createSessionBody, validate, controller.createSession);

// GET /api/v1/sessions/:code - get session
router.get('/:code', currentUser, sessionCodeParam, validate, controller.getSessionByCode);

// PATCH /api/v1/sessions/:code - update session (host only)
router.patch('/:code', currentUser, requireUser('HOST', 'ADMIN'), sessionCodeParam, patchSessionBody, validate, controller.updateSession);

// POST /api/v1/sessions/:code/players - join or rejoin
router.post('/:code/players', currentUser, sessionCodeParam, joinBody, validate, controller.joinSession);

// GET /api/v1/sessions/:code/players - list players
router.get('/:code/players', currentUser, sessionCodeParam, validate, controller.listPlayers);

module.exports = router;
