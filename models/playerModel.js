const sequelize = require("../db");
const { DataTypes, Model } = require("sequelize");
const bcrypt = require("bcrypt");

class Player extends Model {}

Player.init(
  {
    playername: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "player",
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
    modelName: "Player",
    tableName: "players",
  }
);

const hashPassword = async (player) => {
  if (player.changed("password")) {
    player.password = await bcrypt.hash(player.password, 12);
  }
};

Player.beforeCreate(hashPassword);
Player.beforeUpdate(hashPassword);

module.exports = Player;
