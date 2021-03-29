// PassworValidator middleware
//=======================================================

const passSchema = require("../models/password");

// logique du modele utiliser pour valider le mot de passe

module.exports = (req, res, next) => {
  if (!passSchema.validate(req.body.password)) {
    return res.status(400).json({
      error:
        "Force du mot de passe insuffisante ! Au moins une minuscule et une majuscule ! 8 caracters min et 100 max ! 2 chiffres min ! Aucun espace !" +
        passSchema.validate("Renforcer votre mot de passe", { list: true }),
    });
  } else {
    next();
  }
};

