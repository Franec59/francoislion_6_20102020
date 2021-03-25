//page model => sauce
//=======================================

const mongoose = require('mongoose');

const sauceSchema = mongoose.Schema({
  userId: { type: String },
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  description: { type: String, required: true },
  mainPepper: { type: String, required: true },
  imageUrl: { type: String, required: true },
  heat: { type: Number, required: true },
  likes: { type: Number },
  disLikes: { type: Number },
  usersLiked: { type: Array },
  usersDisLiked: { type: Array },
  
});

module.exports = mongoose.model('Sauce', sauceSchema); //1er argument = le nom du model
