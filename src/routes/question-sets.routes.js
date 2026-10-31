const { Router } = require('express');
const { body, param } = require('express-validator');
const currentUser = require('../middlewares/current-user');
const { requireUser } = require('../middlewares/require-user');
const { validate } = require('../middlewares/validate');
const controller = require('../controllers/question-sets.controller');

const router = Router();

const questionSetIdParam = param('id').isInt({ min: 1 }).withMessage('id must be a positive integer.');

const createQuestionSetBody = [
  body('title').trim().notEmpty().withMessage('title is required.').isLength({ max: 200 }).withMessage('title too long.'),
];

const updateQuestionSetBody = [
  body('title').optional().trim().notEmpty().withMessage('title must not be empty.').isLength({ max: 200 }).withMessage('title too long.'),
  body().custom((value, { req }) => {
    if (!req.body || Object.keys(req.body).length === 0) {
      throw new Error('At least one field must be provided for update.');
    }
    return true;
  }),
];

// List
router.get('/', currentUser, controller.listQuestionSets);

// Read
router.get('/:id', currentUser, questionSetIdParam, validate, controller.getQuestionSet);

// Create
router.post('/', currentUser, requireUser('HOST', 'ADMIN'), createQuestionSetBody, validate, controller.createQuestionSet);

// Update
router.patch('/:id', currentUser, requireUser('HOST', 'ADMIN'), questionSetIdParam, updateQuestionSetBody, validate, controller.updateQuestionSet);

// Delete
router.delete('/:id', currentUser, requireUser('HOST', 'ADMIN'), questionSetIdParam, validate, controller.deleteQuestionSet);

module.exports = router;
