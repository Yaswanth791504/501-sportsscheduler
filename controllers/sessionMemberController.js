const SessionMembers = require("../models/SessionMembersModel");
const Player = require("../models/playerModel");
const Session = require("../models/sessionModel");

const sessionMemberController = {};

sessionMemberController.joinSession = async (req, res) => {
  try {
    const { id: playerId } = req.player;
    const { id: sessionId } = req.params;

    const session = await Session.findByPk(sessionId);
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }
    if (session.currentPlayers >= session.maxPlayers) {
      return res.status(400).json({ error: "Session is full" });
    }
    const player = await Player.findByPk(playerId);
    if (!player) {
      return res.status(404).json({ error: "Player not found" });
    }
    const sessionMembers = await SessionMembers.findOne({
      where: {
        sessionId,
        playerId,
        status: "out",
      },
    });
    if (sessionMembers) {
      await sessionMembers.update({
        status: "in",
        joinedAt: new Date(),
      });
      await session.update({
        currentPlayers: session.currentPlayers + 1,
      });
      return res.status(200).json(sessionMembers);
    }

    const sessionMember = await SessionMembers.create({
      sessionId,
      playerId,
    });
    await session.update({
      currentPlayers: session.currentPlayers + 1,
    });
    if (!sessionMember) {
      return res.status(404).json({ error: "Session member not found" });
    }
    res.status(201).json(sessionMember);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

sessionMemberController.leaveSession = async (req, res) => {
  try {
    const { id: playerId } = req.player;
    const { id: sessionId } = req.params;
    console.log(playerId, sessionId);
    const sessionMember = await SessionMembers.findOne({
      where: {
        sessionId,
        playerId,
      },
    });
    if (!sessionMember) {
      return res.status(404).json({ error: "Session member not found" });
    }
    await sessionMember.update({
      status: "out",
      leftAt: new Date(),
    });
    const session = await Session.findByPk(sessionId);
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }
    await session.update({
      currentPlayers: session.currentPlayers - 1,
    });
    res.status(200).json(sessionMember);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

sessionMemberController.getSessionMembers = async (req, res) => {
  try {
    const { id: sessionId } = req.params;
    const sessionMembers = await SessionMembers.findAll({
      where: {
        sessionId,
        status: "in",
      },
    });
    res.status(200).json(sessionMembers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = sessionMemberController;
