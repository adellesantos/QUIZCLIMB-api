// ONE Sequelize instance (one connection pool) for the whole API.
// Every other file imports it from here - nobody opens a second one.
const { Sequelize, DataTypes } = require('sequelize');
const env = require('../config/env');
const dbConfig = require('../config/database')[env.nodeEnv];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  dbConfig
);

const User = require('./user')(sequelize, DataTypes);
const GameSession = require('./game_session')(sequelize, DataTypes);
const Player = require('./player')(sequelize, DataTypes);
const Question = require('./question')(sequelize, DataTypes);
const QuestionSet = require('./question_set')(sequelize, DataTypes);

User.hasMany(Player, { foreignKey: 'user_id' });
Player.belongsTo(User, { foreignKey: 'user_id' });

GameSession.hasMany(Player, { foreignKey: 'session_id' });
Player.belongsTo(GameSession, { foreignKey: 'session_id' });

User.hasMany(GameSession, { foreignKey: 'host_user_id', as: 'hostedSessions' });
GameSession.belongsTo(User, { foreignKey: 'host_user_id', as: 'host' });

User.hasMany(QuestionSet, { foreignKey: 'host_user_id', as: 'hostedQuestionSets' });
QuestionSet.belongsTo(User, { foreignKey: 'host_user_id', as: 'host' });

QuestionSet.hasMany(GameSession, { foreignKey: 'question_set_id' });
GameSession.belongsTo(QuestionSet, { foreignKey: 'question_set_id', as: 'questionSet' });

module.exports = { sequelize, Sequelize, DataTypes, User, GameSession, Player, Question, QuestionSet };
