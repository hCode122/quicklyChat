var express = require('express');
var router = express.Router();
var mainController = require("../controllers/mainController")
const requireAuth = require("../middleware/requireAuth")

router.use(requireAuth);
/* GET home page. */

router.get("/contacts", mainController.getContacts)
router.post("/contacts", mainController.addContact)

router.post("/search", mainController.search)

router.get("/chats", mainController.getChats)
router.post("/chats", mainController.createChat)

module.exports = router;
