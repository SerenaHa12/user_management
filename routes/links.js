var express = require("express");
var router = express.Router();
const linkController = require("../controllers/link.controller");

router.get("/", linkController.index);
router.get("/add", linkController.add);
router.post("/add", linkController.handleAdd);
router.get("/:short", linkController.redirect);

module.exports = router;
