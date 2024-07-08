const router = require("express").Router();
const playerController = require("../controllers/playerController");
const { protect } = require("../controllers/authController");

router.use(protect);
router.get("/", playerController.getPlayers);
router.get("/:id", playerController.getPlayer);

module.exports = router;
