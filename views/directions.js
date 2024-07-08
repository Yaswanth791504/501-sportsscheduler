const router = require("express").Router();
const jwt = require("jsonwebtoken");
const Player = require("../models/playerModel");
const Session = require("../models/sessionModel");
const SessionMembers = require("../models/SessionMembersModel");

const formateDate = (date) => {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const getDuration = (start, end) => {
  const duration = new Date(end) - new Date(start);
  return duration / 1000 / 60 / 60 / 24;
};

router.get("/login", (req, res) => {
  res.render("templates/login.ejs", { title: "Login" });
});

router.get("/register", (req, res) => {
  res.render("templates/signup.ejs", { title: "Register" });
});

router.use(async (req, res, next) => {
  const token = req.cookies.token;
  if (token) {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.player = await Player.findByPk(decoded.id);
  }
  next();
});

router.get("/", (req, res) => {
  res.render("templates/homepage.ejs", {
    title: "Home",
    player: req.player || "",
  });
});

router.get("/dashboard", async (req, res) => {
  if (!req.player) {
    return res.redirect("/login");
  }
  res.render("templates/dashboard.ejs", {
    title: "Dashboard",
    player: req.player || "",
  });
});

router.get("/session/:id", async (req, res) => {
  if (!req.player) {
    return res.redirect("/login");
  }
  const session = await Session.findByPk(req.params.id);
  if (!session) {
    return res.redirect("/dashboard");
  }
  session.dataValues.start = formateDate(session.dataValues.start);
  session.dataValues.end = formateDate(session.dataValues.end);
  session.dataValues.duration = getDuration(
    session.dataValues.start,
    session.dataValues.end
  );
  const sessionMembers = await SessionMembers.findAll({
    where: { sessionId: req.params.id, status: "in" },
    include: [{ model: Player, as: "player" }],
  });

  session.dataValues.sessionMembers = sessionMembers.map((member) => {
    const memberData = member.dataValues;
    memberData.player = member.player ? member.player.dataValues : null;
    return memberData.player;
  });

  session.dataValues.sessionMemberIds = sessionMembers.map(
    (member) => member.dataValues.playerId
  );

  res.render("templates/session.ejs", {
    title: "Session",
    player: req.player || "",
    session: session.dataValues || null,
  });
});

module.exports = router;
