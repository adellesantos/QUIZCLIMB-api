// Question-sets repository: the only door to question-set data.
const { QuestionSet } = require('../models');

async function findAll() {
  return QuestionSet.findAll({ order: [['question_set_id', 'ASC']] });
}

async function findById(id) {
  return QuestionSet.findByPk(id);
}

async function create(data) {
  return QuestionSet.create(data);
}

async function updateById(id, data) {
  const questionSet = await QuestionSet.findByPk(id);
  if (!questionSet) return null;
  await questionSet.update(data);
  return questionSet;
}

async function destroyById(id) {
  const questionSet = await QuestionSet.findByPk(id);
  if (!questionSet) return null;
  await questionSet.destroy();
  return true;
}

async function findByIdAndHost(id, hostUserId) {
  return QuestionSet.findOne({ where: { question_set_id: id, host_user_id: hostUserId } });
}

module.exports = {
  findAll,
  findById,
  create,
  updateById,
  destroyById,
  findByIdAndHost,
};
