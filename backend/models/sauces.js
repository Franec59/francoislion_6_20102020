//page model => sauce
//=======================================

const mongoose = require('mongoose');

const sauceSchema = mongoose.Schema({
  userId: { type: String },
  name: { type: String, required: true },
  manufacturer: { type: String, 
    maxlength : [30, "maximum 30 caractères"],
    required: true,
    match : /^[^@&*";?#/\$=*<>]+$/g
   },
  description: { type: String,
    maxlength : [150, "maximum 150 caractères"],
    required: true,
    match : /^[^@&*";?#/\$=*<>]+$/g
  },
  mainPepper: { type: String,
    maxlength : [30, "maximum 30 caractères"],
    required: true,
    match : /^[^@&*";?#/\$=*<>]+$/g
  },
  imageUrl: { type: String, required: true },
  heat: { type: Number, required: true },
  likes: { type: Number },
  dislikes: { type: Number },
  usersLiked: { type: Array },
  usersDisliked: { type: Array },
  
});

module.exports = mongoose.model('Sauce', sauceSchema); //1er argument = le nom du model
