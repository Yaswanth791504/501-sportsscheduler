const Session = require("../models/sessionModel");

const sessionController = {};

sessionController.createSession = async (req, res) => {
  try {
    console.log(req.body);
    const { id: createdBy } = req.player;
    let { title, game, maxPlayers, start, end, description, location } =
      req.body;
    maxPlayers = parseInt(maxPlayers);
    const session = await Session.create({
      title,
      game,
      maxPlayers,
      currentPlayers: 0,
      createdBy,
      start,
      end,
      description,
      location,
    });
    res.status(201).json(session);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

sessionController.getSessions = async (req, res) => {
  try {
    const sessions = await Session.findAll();
    res.status(200).json(sessions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

sessionController.getSession = async (req, res) => {
  try {
    const { id } = req.params;
    const session = await Session.findByPk(id);
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }
    res.status(200).json(session);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

sessionController.updateSession = async (req, res) => {
  try {
    const { id } = req.params;
    const session = await Session.findByPk(id);
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }
    const {
      game = session.game,
      maxPlayers = session.maxPlayers,
      currentPlayers = session.currentPlayers,
    } = req.body;
    await session.update({
      game,
      maxPlayers,
      currentPlayers,
    });
    res.status(200).json(session);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

sessionController.deleteSession = async (req, res) => {
  try {
    const { id } = req.params;
    const session = await Session.findByPk(id);
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }
    await session.destroy();
    res.status(204).json();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = sessionController;
