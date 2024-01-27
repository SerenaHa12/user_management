var express = require("express");
var router = express.Router();
const roleController = require("../controllers/role.controller");

router.get("/", roleController.index);

module.exports = router;
