// Sessions service: business rules. No HTTP, no req/res.
const sessionsRepository = require('../repositories/sessions.repository');
const questionSetsRepository = require('../repositories/question-sets.repository');
const AppError = require('../errors/app-error');

async function createSession(hostUserId, questionSetId) {
  // Verify the selected question set exists
  const questionSet = await questionSetsRepository.findById(questionSetId);
  if (!questionSet) {
    throw new AppError(404, 'QUESTION_SET_NOT_FOUND', 'Selected question set not found.');
  }

  // Verify the host owns or can use the question set
  const isOwner = questionSet.host_user_id && questionSet.host_user_id === hostUserId;
  const isAdmin = false; // role check is done in the controller via requireUser
  // For non-admin hosts, only their own question sets are usable
  if (!isOwner) {
    throw new AppError(403, 'FORBIDDEN', 'You do not own this question set.');
  }

  return sessionsRepository.createSession(hostUserId, questionSetId);
}

async function getSessionByCode(code) {
  const session = await sessionsRepository.findSessionByCode(code);
  if (!session) {
    throw new AppError(404, 'SESSION_NOT_FOUND', 'Session not found.');
  }
  return session;
}

async function updateSession(code, data, user) {
  const session = await sessionsRepository.findSessionByCode(code);
  if (!session) {
    throw new AppError(404, 'SESSION_NOT_FOUND', 'Session not found.');
  }

  const isHost = session.host_user_id && session.host_user_id === user.user_id;
  const isAdmin = String(user.role).toUpperCase() === 'ADMIN';

  if (!isHost && !isAdmin) {
    throw new AppError(403, 'FORBIDDEN', 'You do not own this session.');
  }

  // If changing question_set_id, verify it exists
  if (data.question_set_id !== undefined) {
    const questionSet = await questionSetsRepository.findById(data.question_set_id);
    if (!questionSet) {
      throw new AppError(404, 'QUESTION_SET_NOT_FOUND', 'Selected question set not found.');
    }
  }

  const updated = await sessionsRepository.updateSessionByCode(code, data);
  return updated;
}

async function joinSession(code, user, nickname) {
  const session = await sessionsRepository.findSessionByCode(code);
  if (!session) {
    throw new AppError(404, 'SESSION_NOT_FOUND', 'Session not found.');
  }

  // Only LOBBY sessions are joinable
  if (session.status !== 'LOBBY') {
    throw new AppError(409, 'SESSION_NOT_JOINABLE', 'This session is not accepting players.');
  }

  // Check for rejoin: same account already has a seat
  const existing = await sessionsRepository.findPlayerBySessionAndUser(session.session_id, user.user_id);
  if (existing) {
    return {
      player: existing,
      isRejoin: true,
    };
  }

  // Check if user is already in another RUNNING game
  const runningGame = await sessionsRepository.findRunningGameForUser(user.user_id, session.session_id);
  if (runningGame) {
    throw new AppError(409, 'ALREADY_IN_GAME', 'You are already in another running game.');
  }

  // Check nickname uniqueness within session
  const nicknameExists = await sessionsRepository.findPlayerBySessionAndNickname(session.session_id, nickname);
  if (nicknameExists) {
    throw new AppError(409, 'NICKNAME_TAKEN', 'A player with this nickname already exists in the session.');
  }

  const player = await sessionsRepository.createPlayer(session.session_id, user.user_id, nickname);
  return {
    player,
    isRejoin: false,
  };
}

async function listPlayers(code) {
  const session = await sessionsRepository.findSessionByCode(code);
  if (!session) {
    throw new AppError(404, 'SESSION_NOT_FOUND', 'Session not found.');
  }

  const players = await sessionsRepository.listPlayersBySession(session.session_id);
  return players;
}

module.exports = {
  createSession,
  getSessionByCode,
  updateSession,
  joinSession,
  listPlayers,
};
