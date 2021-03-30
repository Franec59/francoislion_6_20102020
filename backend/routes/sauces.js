//page router des sauces
//================================

const express = require('express');

//création d'un router avec la méthode router d'express
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

//on va récupérer le controller
const saucesCtrl = require('../controllers/sauces');

//routes POST, PUT, DELETE, GET
//=========================================

router.post('/', auth, multer, saucesCtrl.createSauce );
router.put('/:id', auth, multer, saucesCtrl.modifySauce);
router.delete('/:id', auth, saucesCtrl.deleteSauce);
router.get('/:id', auth, saucesCtrl.getOneSauce);
router.get('/', auth, saucesCtrl.getAllSauces);

//route pour le like
router.post('/:id/like', auth, saucesCtrl.likePost);


//il faut réexporter le router de ce fichier
module.exports = router;
