//middleware multer-config
//=================================

const multer = require('multer');

//limitation du nombre et de la taille des images pour ne pas surcharger l'appli
//===============================================================================
var limits = {
  files: 1, // allow only 1 file per request
  fileSize: 1 * 1024 * 1024, // 1 MB (max file size)
  };


const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    
    callback(null, name + Date.now() + '.' + extension);
  }
  
});


module.exports = multer({storage: storage, limits: limits }).single('image');
