//page model Users
//================================

//importer mongoose
const mongoose = require('mongoose');

const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    email : { type : String, required : true, unique : true },
    password : { type : String, required : true }
});

userSchema.plugin(uniqueValidator);

//exporter le schema sous forme de modèle
module.exports = mongoose.model('User', userSchema);


//Notes
// en rajoutant "unique : true", on empèche le user de s'enregistrer plusieurs fois avec la même adresse mail
// il faut rajouter un package mongoose validator

