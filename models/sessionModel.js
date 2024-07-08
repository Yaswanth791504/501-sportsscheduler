const sequelize = require("../db");
const { DataTypes, Model } = require("sequelize");
const Player = require("./playerModel");

class Session extends Model {}

Session.init(
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    game: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expires: {
      type: DataTypes.DATE,
    },
    location: {
      type: DataTypes.STRING,
    },
    maxPlayers: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    currentPlayers: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Player,
        key: "id",
      },
    },
    start: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    end: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "Session",
    tableName: "sessions",
  }
);

module.exports = Session;
