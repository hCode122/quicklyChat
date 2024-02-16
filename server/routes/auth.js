var router = require("express").Router();
var authController = require("../controllers/authController")

router.post("/login", authController.login);

router.post("/signup", authController.signup);
module.exports = router;