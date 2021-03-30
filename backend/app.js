const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

var helmet = require('helmet');

const saucesRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');

const path = require('path');

const mongoSanitize = require('express-mongo-sanitize');

//Ddos
//===========================================
var Ddos = require('ddos')
var ddos = new Ddos({burst:10, limit:15})
    
//pour utiliser des variables d'environnement pour la connexion à mongoDB
require('dotenv').config()

//connection à mongoDB avec la varibale d'environnement
//======================================================
mongoose.connect(process.env.MONGODB,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();


//1er middleware : CORS
//========================
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

//2ème middleware bodyparser
//=============================
//app.use(bodyParser.json());//deprecated
app.use (express.json ());//remplace bodyParser

// middleware avec le router
//===================================

app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

//middleware helmet
//=======================
app.use(helmet());

//middleware mongosanitize
//===============================
app.use(mongoSanitize());

//middleware Ddos
app.use(ddos.express);

//fin de la page app
//=====================================
module.exports = app;

