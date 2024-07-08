const Player = require("../models/playerModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const authController = {};

authController.signup = async (req, res) => {
  try {
    const { playername, email, password, role } = req.body;
    const existingPlayer = await Player.findOne({
      where: { email },
    });
    if (existingPlayer) {
      res.status(400).json({
        message: "Player already exists, Please login.",
      });
      return;
    }
    const player = await Player.create({
      playername,
      email,
      password,
      role: role || "player",
    });
    res.status(201).json({
      status: "success",
      data: player,
    });
  } catch (error) {
    res.status(500).json({
      status: "failed",
      error: error.message,
    });
  }
};

authController.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const player = await Player.findOne({ where: { email } });
    if (!player) {
      return res
        .status(404)
        .json({ error: "player not found, Please sign up." });
    }
    const validPassword = await bcrypt.compare(password, player.password);
    if (!validPassword) {
      return res.status(401).json({ error: "Invalid password" });
    }
    const token = jwt.sign({ id: player.id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.cookie("token", token, { httpOnly: true });
    res.status(200).json({ status: "success", message: "Logged in" });
  } catch (error) {
    res.status(500).json({ status: "failed", error: error.message });
  }
};

authController.logout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out" });
};

authController.protect = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.player = await Player.findByPk(decoded.id);
    next();
  } catch (error) {
    res.status(401).json({ status: "failed", error: "Unauthorized" });
  }
};

authController.restrictTo = (...role) => {
  return (req, res, next) => {
    if (!role.includes(req.player.role)) {
      return res
        .status(403)
        .json({ error: "You are not authorized to do this action." });
    }
    next();
  };
};

module.exports = authController;
