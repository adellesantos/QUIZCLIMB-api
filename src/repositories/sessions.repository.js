// Sessions & players repository: the only door to session/player data.
const { QueryTypes } = require('sequelize');
const { GameSession, Player, User, sequelize } = require('../models');

async function createSession(hostUserId, questionSetId) {
  let sessionCode;
  let attempts = 0;
  const maxAttempts = 10;

  while (attempts < maxAttempts) {
    sessionCode = String(Math.floor(Math.random() * 900000) + 100000);
    const existing = await GameSession.findOne({ where: { session_code: sessionCode } });
    if (!existing) break;
    attempts += 1;
  }

  if (attempts >= maxAttempts) {
    const err = new Error('Unable to generate a unique session code.');
    err.code = 'SESSION_CODE_GENERATION_FAILED';
    err.status = 500;
    throw err;
  }

  return GameSession.create({
    session_code: sessionCode,
    status: 'LOBBY',
    host_user_id: hostUserId,
    question_set_id: questionSetId,
  });
}

async function findSessionByCode(code) {
  return GameSession.findOne({ where: { session_code: code } });
}

async function updateSessionByCode(code, data) {
  const session = await GameSession.findOne({ where: { session_code: code } });
  if (!session) return null;
  await session.update(data);
  return session;
}

async function findPlayerBySessionAndUser(sessionId, userId) {
  return Player.findOne({ where: { session_id: sessionId, user_id: userId } });
}

async function findPlayerById(playerId) {
  return Player.findByPk(playerId);
}

async function createPlayer(sessionId, userId, nickname) {
  return Player.create({ session_id: sessionId, user_id: userId, nickname, score: 0, completed: false });
}

async function findPlayerBySessionAndNickname(sessionId, nickname) {
  return Player.findOne({ where: { session_id: sessionId, nickname } });
}

async function listPlayersBySession(sessionId) {
  return Player.findAll({
    where: { session_id: sessionId },
    order: [['score', 'DESC'], ['nickname', 'ASC']],
    include: [{ model: User, attributes: ['school_id', 'full_name'] }],
  });
}

async function countPlayersInSession(sessionId) {
  return Player.count({ where: { session_id: sessionId } });
}

async function findRunningGameForUser(userId, excludeSessionId) {
  const rows = await sequelize.query(
    `
    SELECT s.session_code, s.status
    FROM game_sessions s
    JOIN players p ON p.session_id = s.session_id
    WHERE p.user_id = :userId
      AND s.status = 'RUNNING'
      AND s.session_id <> :excludeSessionId
    `,
    {
      type: QueryTypes.SELECT,
      replacements: { userId, excludeSessionId },
    }
  );
  return rows[0];
}

module.exports = {
  createSession,
  findSessionByCode,
  updateSessionByCode,
  findPlayerBySessionAndUser,
  findPlayerById,
  createPlayer,
  listPlayersBySession,
  countPlayersInSession,
  findRunningGameForUser,
  findPlayerBySessionAndNickname,
};
