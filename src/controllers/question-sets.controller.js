// Question-sets controller: thin HTTP translation. No req.body directly.
const questionSetsService = require('../services/question-sets.service');

async function listQuestionSets(req, res) {
  const questionSets = await questionSetsService.listQuestionSets();
  res.status(200).json(questionSets);
}

async function getQuestionSet(req, res) {
  const { id } = req.validated;
  const questionSet = await questionSetsService.getQuestionSet(id);
  res.status(200).json(questionSet);
}

async function createQuestionSet(req, res) {
  const questionSet = await questionSetsService.createQuestionSet(req.validated, req.currentUser.user_id);
  res.status(201).json(questionSet);
}

async function updateQuestionSet(req, res) {
  const { id } = req.validated;
  const questionSet = await questionSetsService.updateQuestionSet(id, req.validated, req.currentUser);
  res.status(200).json(questionSet);
}

async function deleteQuestionSet(req, res) {
  const { id } = req.validated;
  await questionSetsService.deleteQuestionSet(id, req.currentUser);
  res.status(204).end();
}

module.exports = {
  listQuestionSets,
  getQuestionSet,
  createQuestionSet,
  updateQuestionSet,
  deleteQuestionSet,
};
