var express = require('express');
var router = express.Router();
var mainController = require("../controllers/mainController")
const requireAuth = require("../middleware/requireAuth")

router.use(requireAuth);
/* GET home page. */

router.get("/contacts", mainController.getContacts)
router.post("/contacts", mainController.addContact)

router.get("/chats", mainController.getChats)
module.exports = router;
