//page controllers user
//=================================

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); //permet de crer des token et de les vérifier

const User = require('../models/User');

//pour utiliser des variables d'environnement pour la connexion à mongoDB
require('dotenv').config()

//fonction signup pour l'enregistrement de nouveau utilisateur
//fonction asynchrone ( then & catch), saler le MP, 
exports.signup = (req, res, next) => {
    bcrypt.hash( req.body.password, 10 )
      .then( hash => {
        const user = new User({
          email: req.body.email,
          password: hash
        });
        user.save()
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };


//fonction login pour connecter les utilisateurs existant
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        }
        bcrypt.compare(req.body.password, user.password)
          .then(valid => {
            if (!valid) {
              return res.status(401).json({ error: 'Mot de passe incorrect !' });
            }
            res.status(200).json({
              userId: user._id,
              token: jwt.sign(
                { userId: user._id },
                process.env.TOKEN, //chaine de caractère aléatoire et plus long pour sécuriser l'encodage
                { expiresIn: '24h' } //expiration du token
              )
            });
          })
          .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
};