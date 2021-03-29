//router user
//================================

const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');

const verifyPassword = require("../middleware/password");
//ajouter verifyPassword dans la route signup

//npm rate-limit pour limiter un nombre abusif de requetes, a ajouter dans la route login !
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});


router.post('/signup', verifyPassword, userCtrl.signup);
router.post('/login', limiter, userCtrl.login);

module.exports = router;