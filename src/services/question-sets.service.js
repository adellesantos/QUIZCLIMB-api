// Question-sets service: business rules. No HTTP, no req/res.
const questionSetsRepository = require('../repositories/question-sets.repository');
const AppError = require('../errors/app-error');

async function listQuestionSets() {
  return questionSetsRepository.findAll();
}

async function getQuestionSet(id) {
  const questionSet = await questionSetsRepository.findById(id);
  if (!questionSet) {
    throw new AppError(404, 'QUESTION_SET_NOT_FOUND', 'Question set not found.');
  }
  return questionSet;
}

async function createQuestionSet(data, hostUserId) {
  const questionSet = await questionSetsRepository.create({ ...data, host_user_id: hostUserId });
  return questionSet;
}

async function updateQuestionSet(id, data, user) {
  const questionSet = await questionSetsRepository.findById(id);
  if (!questionSet) {
    throw new AppError(404, 'QUESTION_SET_NOT_FOUND', 'Question set not found.');
  }

  const isOwner = questionSet.host_user_id && questionSet.host_user_id === user.user_id;
  const isAdmin = String(user.role).toUpperCase() === 'ADMIN';

  if (!isOwner && !isAdmin) {
    throw new AppError(403, 'FORBIDDEN', 'You do not own this question set.');
  }

  const updated = await questionSetsRepository.updateById(id, data);
  return updated;
}

async function deleteQuestionSet(id, user) {
  const questionSet = await questionSetsRepository.findById(id);
  if (!questionSet) {
    throw new AppError(404, 'QUESTION_SET_NOT_FOUND', 'Question set not found.');
  }

  const isOwner = questionSet.host_user_id && questionSet.host_user_id === user.user_id;
  const isAdmin = String(user.role).toUpperCase() === 'ADMIN';

  if (!isOwner && !isAdmin) {
    throw new AppError(403, 'FORBIDDEN', 'You do not own this question set.');
  }

  await questionSetsRepository.destroyById(id);
}

module.exports = {
  listQuestionSets,
  getQuestionSet,
  createQuestionSet,
  updateQuestionSet,
  deleteQuestionSet,
};
