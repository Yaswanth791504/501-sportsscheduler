const router = require("express").Router();

const { restrictTo, protect } = require("../controllers/authController");
const {
  createSession,
  getSessions,
  getSession,
  updateSession,
  deleteSession,
} = require("../controllers/sessionController");

router.get("/", getSessions);
router.get("/:id", getSession);

router.use(protect, restrictTo("admin"));
router.post("/", createSession);
router.put("/:id", updateSession);
router.delete("/:id", deleteSession);

module.exports = router;
