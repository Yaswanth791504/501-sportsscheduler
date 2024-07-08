const router = require("express").Router();
const { restrictTo, protect } = require("../controllers/authController");
const {
  joinSession,
  leaveSession,
  getSessionMembers,
} = require("../controllers/sessionMemberController");

router.use(protect, restrictTo("admin", "player"));
router.get("/join/:id", joinSession);
router.get("/leave/:id", leaveSession);
router.get("/:id", getSessionMembers);

module.exports = router;
