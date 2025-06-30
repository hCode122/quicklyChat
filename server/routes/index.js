var express = require('express');
var router = express.Router();
var mainController = require("../controllers/mainController")
const fileController = require('../controllers/fileController');
const userController = require('../controllers/userController');
const requireAuth = require("../middleware/requireAuth")
const upload = require('../middleware/cloudUpload');


router.get('/user/:username/profile', mainController.getPublicProfile);
router.use(requireAuth);


//Contacts Routes
router.get("/contacts", mainController.getContacts)
router.post("/contacts", mainController.addContact)
router.delete ('/contact/:chatId',mainController.removeContact );


//Search Routes
router.post("/search", mainController.search)
router.post('/searchMessages', mainController.searchMessages);


//Chats Routes
router.get("/chats", mainController.getChats)
router.post("/chats", mainController.createChat)
router.post("/check", mainController.chatCheck)
router.delete('/clear/:chatId', mainController.clearMessagesByChatId);


//Messages Routes
router.post("/message", mainController.createMessage)
router.post("/loadMessages", mainController.loadMessages)
router.delete('/message/:id', mainController.deleteMessage);


//Files Routes
router.post('/upload',upload.single('file'),fileController.uploadFile);


//user routes
router.put('/profile', upload.single('profilePic'), userController.updateProfile);
router.get('/profile', userController.getUserProfile);
router.get('/profile/:username', mainController.getPublicProfile);
router.get('/user/:username/status', mainController.getUserStatus);
router.get('/user/:id', mainController.getUserById);


module.exports = router;
