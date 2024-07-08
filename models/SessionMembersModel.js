const sequelize = require("../db");
const { DataTypes, Model } = require("sequelize");
const Session = require("./sessionModel");
const Player = require("./playerModel");

class SessionMembers extends Model {}

SessionMembers.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    sessionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Session,
        key: "id",
      },
    },
    playerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Player,
        key: "id",
      },
    },
    status: {
      type: DataTypes.ENUM("out", "in"),
      allowNull: false,
      defaultValue: "in",
    },
    joinedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    leftAt: {
      type: DataTypes.DATE,
    },
  },
  {
    sequelize,
    modelName: "SessionMembers",
    tableName: "session_members",
  }
);

module.exports = SessionMembers;
