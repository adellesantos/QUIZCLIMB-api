// Sessions controller: thin HTTP translation. No req.body directly.
const sessionsService = require('../services/sessions.service');

async function createSession(req, res) {
  const session = await sessionsService.createSession(req.currentUser.user_id, req.validated.question_set_id);
  res.status(201).json(session);
}

async function getSessionByCode(req, res) {
  const { code } = req.validated;
  const session = await sessionsService.getSessionByCode(code);
  res.status(200).json(session);
}

async function updateSession(req, res) {
  const { code } = req.validated;
  const session = await sessionsService.updateSession(code, req.validated, req.currentUser);
  res.status(200).json(session);
}

async function joinSession(req, res) {
  const { code } = req.validated;
  const result = await sessionsService.joinSession(code, req.currentUser, req.validated.nickname);

  if (result.isRejoin) {
    res.status(200).json({
      player: result.player,
      message: 'Rejoined existing seat.',
    });
    return;
  }

  res.status(201).json({
    player: result.player,
    message: 'Joined session.',
  });
}

async function listPlayers(req, res) {
  const { code } = req.validated;
  const players = await sessionsService.listPlayers(code);
  res.status(200).json(players);
}

module.exports = {
  createSession,
  getSessionByCode,
  updateSession,
  joinSession,
  listPlayers,
};
