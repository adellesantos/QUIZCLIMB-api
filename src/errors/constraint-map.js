'use strict';

// Maps database constraint names to client-facing 409 errors.
// Never exposes raw SQL or constraint internals to the client.
const CONSTRAINT_MAP = {
  players_session_id_nickname_unique: {
    code: 'NICKNAME_TAKEN',
    message: 'A player with this nickname already exists in the session.',
  },
  players_session_id_user_id_unique: {
    code: 'DUPLICATE_SEAT',
    message: 'You already have a seat in this session.',
  },
  game_sessions_session_code_unique: {
    code: 'DUPLICATE_SESSION_CODE',
    message: 'A session with this code already exists.',
  },
  users_email_unique: {
    code: 'DUPLICATE_EMAIL',
    message: 'A user with this email already exists.',
  },
};

function mapConstraintError(constraintName) {
  const entry = CONSTRAINT_MAP[constraintName];
  if (entry) {
    return { code: entry.code, message: entry.message, status: 409 };
  }
  return { code: 'DB_CONSTRAINT_VIOLATION', message: 'A database constraint was violated.', status: 409 };
}

module.exports = { mapConstraintError };
