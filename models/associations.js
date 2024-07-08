const Player = require("./playerModel");
const Session = require("./sessionModel");
const SessionMembers = require("./SessionMembersModel");

const setupAssociations = () => {
  Player.hasMany(Session, {
    foreignKey: "createdBy",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  Session.belongsTo(Player, {
    foreignKey: "createdBy",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  Player.belongsToMany(Session, {
    through: SessionMembers,
    foreignKey: "playerId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    as: "participatedSessions",
  });

  Session.belongsToMany(Player, {
    through: SessionMembers,
    foreignKey: "sessionId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    as: "participants",
  });

  SessionMembers.belongsTo(Player, {
    foreignKey: "playerId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    as: "player",
  });

  SessionMembers.belongsTo(Session, {
    foreignKey: "sessionId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  Player.hasMany(SessionMembers, {
    foreignKey: "playerId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  Session.hasMany(SessionMembers, {
    foreignKey: "sessionId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
};

module.exports = setupAssociations;
