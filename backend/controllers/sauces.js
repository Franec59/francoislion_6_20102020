//page controllers des sauces : logique métier
// =============================================

const Sauce = require('../models/sauces');
const fs = require('fs');

//POST
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce(
      {...sauceObject,
        likes: 0,
        dislikes: 0,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` //pour générer l'url de l'image
      });
    sauce.save()
      .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
      .catch(error => res.status(400).json({ error }));
};

//get one sauce
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
      .then(sauce => res.status(200).json( sauce ))
      .catch(error => res.status(404).json({ error }));
};

//PUT
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
      {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Objet modifié !' }))
      .catch(error => res.status(400).json({ error }));
  };

//Delete
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne( {_id: req.params.id } )
  .then(sauce => {
    const filename = sauce.imageUrl.split('/images/')[1];
    fs.unlink(`images/${filename}`, () => {
      Sauce.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
        .catch(error => res.status(400).json({ error }));
    });
  })
  .catch(error => res.status(500).json({ error }));
};

//get all Sauce
exports.getAllSauces = (req, res, next) => {
  Sauce.find()
      .then(sauces =>res.status(200).json(sauces))
      .catch(error => res.status(400).json({ error }));
};

//like & disLike !
//=====================================================================================================

  //Si j'aime = 1, l'utilisateur aime la sauce. 
  //Si j'aime = 0, l'utilisateur annule ce qu'il aime ou ce qu'il n'aime pas.
  //Si j'aime =-1, l'utilisateur n'aime pas la sauce.

  /*
  L'identifiant de l'utilisateur doit être ajouté ou supprimé du tableau approprié, en gardant une trace de
  ses préférences et en l'empêchant d'aimer ou de ne pas aimer la même sauce plusieurs fois.
  */
  
  //Nombre total de"j'aime" et de "je n'aime pas" à mettre à jour avec chaque "j'aime"


//essai 4 fonctionnel !

exports.likePost = (req, res, next) => {
  console.log(req.body);
  console.log(req.body.like);
  console.log(req.body.userId);
  
  try {
    if (req.body.like == 1) {
      // l'utilisateur aime la sauce. 
    
      Sauce.updateOne({ _id: req.params.id }, { $addToSet : { usersLiked : req.body.userId}, $inc : { likes : +1} } )
        .then(() => res.status(200).json({ message: 'Sauce liked !' }))
        .catch(error => res.status(400).json({ error }));
  
        } else if (req.body.like == -1) {
      // l'utilisateur n'aime pas la sauce.
    
      Sauce.updateOne({ _id: req.params.id }, { $addToSet : { usersDisliked : req.body.userId}, $inc : { dislikes : +1} } )
        .then(() => res.status(200).json({ message: 'Sauce disLiked !' }))
        .catch(error => res.status(400).json({ error }));

    } else {
      //Si j'aime = 0, l'utilisateur annule ce qu'il aime ou ce qu'il n'aime pas.
      Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            if (sauce.usersLiked.includes(req.body.userId)) {
              Sauce.updateOne(
                { _id: req.params.id },
                {
                  $pull: { usersLiked: req.body.userId },
                  $inc: { likes: -1 },
                }
              )
                .then(() => res.status(200).json({ message: "like : choix annulé !" }))
                .catch((error) => res.status(400).json({ error }));     

            } else if (sauce.usersDisliked.includes(req.body.userId)) {
              Sauce.updateOne(
                { _id: req.params.id },
                {
                  $pull: { usersDisliked: req.body.userId },
                  $inc: { dislikes: -1 },
                }
              )
              .then(() =>
                res.status(200).json({ message: "dislike : choix annulé !" })
              )
              .catch((error) => res.status(400).json({ error }));
            }
          })
        }
      } catch(error) { 
      res.status(400).json({ error });   
    }//fin de try
}//fin de exports.likepost



//essai 3 pas de suppression dans mongoDB!
/*
exports.likePost = (req, res, next) => {
  
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      switch (req.body.like){
        case 1 :
        //Si j'aime = 1, l'utilisateur aime la sauce. 
        if (!sauce.usersLiked.includes(req.body.userId)){
          Sauce.updateOne({ _id: req.params.id },
            { $inc : { likes : 1 },
              $push : { usersLiked : req.body.userId },
            _id:req.params.id } )
        .then(() => res.status(200).json({ message: 'Sauce liked !' }))
        .catch(error => res.status(400).json({ error }));
        }//fin de if
      break;

        case -1 :
        //Si j'aime =-1, l'utilisateur n'aime pas la sauce.
        if (!sauce.usersDisliked.includes(req.body.userId)){
          Sauce.updateOne({ _id: req.params.id }, 
            { $inc : { dislikes : 1 },
              $push : { usersDisliked : req.body.userId },
            _id:req.params.id } )
        .then(() => res.status(200).json({ message: 'Sauce disliked !' }))
        .catch(error => res.status(400).json({ error }));
        }//fin de if
      break;

      case 0 :
      //Si j'aime = 0, l'utilisateur annule ce qu'il aime ou ce qu'il n'aime pas.
      if (sauce.usersLiked.includes(req.body.userId)){
        Sauce.updateOne({ _id: req.params.id }, 
          { $inc : { likes : -1 },
            $pull : { usersliked : req.body.userId },
          _id:req.params.id } )
      .then(() => res.status(200).json({ message: 'j aime : choix annulé !' }))
      .catch(error => res.status(400).json({ error }));

        } else if (sauce.usersDisliked.includes(req.body.userId)){
          Sauce.updateOne({ _id: req.params.id }, 
            { $inc : { dislikes : -1 },
              $pull : { usersDisliked : req.body.userId },
            _id:req.params.id } )
        .then(() => res.status(200).json({ message: 'je n aime pas : choix annulé !' }))
        .catch(error => res.status(400).json({ error }));
        }
      break;

      default : 
        throw { error : "erreur"}

      }//fin de switch

    })//fin de then
  .catch(error => res.status(500).json({ error }));

};//fin de la fonction exports.likePost
*/

//essai 2 incomplet
/*
exports.likePost = (req, res, next) => {
  console.log(req.body);  
  try {

    switch (req.body.like) {
      case 1: 
        Sauce.updateOne({ _id: req.params.id }, { 
          $addToSet : { usersLiked : req.body.userId},
          $pull : { usersDisliked : req.body.userId},
          $inc : { likes : 1}
          
        })
        .then(() => res.status(200).json({ message: 'Sauce liked !' }))
        .catch(error => res.status(400).json({ error }));

      case -1: 
        Sauce.updateOne({ _id: req.params.id }, { 
          $addToSet : { usersDisliked : req.body.userId},
          $pull : { usersLiked : req.body.userId},
          $inc : { dislikes : 1}
          
        })
        .then(() => res.status(200).json({ message: 'Sauce disliked !' }))
        .catch(error => res.status(400).json({ error }));

        case 0:
          Sauce.updateOne({ _id: req.params.id }, { 
            $pull : { usersDisliked : req.body.userId},
            $pull : { usersLiked : req.body.userId},
            $inc : { likes : usersLiked.count()},
            $inc : { dislikes : usersDisliked.count()}
      
          } )
          .then(() => res.status(200).json({ message: 'choix annulée !' }))
          .catch(error => res.status(400).json({ error }));
    }

  } catch(error) { 
    res.status(400).json({ error });

  }//fin de try

}//fin de exports.likepost

*/



//essai 1 non aboutit
/*
exports.likePost = (req, res, next) => {
  console.log(req.body);
  
  try {
    if (req.body.like == 1) {
      // l'utilisateur aime la sauce. 
    
      Sauce.updateOne({ _id: req.params.id }, { $addToSet : { usersLiked : req.body.userId}, $inc : { likes : 1} } )
        .then(() => res.status(200).json({ message: 'Sauce liked !' }))
        .catch(error => res.status(400).json({ error }));
  
        } else if (req.body.like == -1) {
      // l'utilisateur n'aime pas la sauce.
    
      Sauce.updateOne({ _id: req.params.id }, { $addToSet : { usersDisliked : req.body.userId}, $inc : { dislikes : 1} } )
        .then(() => res.status(200).json({ message: 'Sauce disLiked !' }))
        .catch(error => res.status(400).json({ error }));

      } else if (req.body.like == 0 && usersLiked.includes(req.body.userId) ) {
        // l'utilisateur annule ce qu'il aime 
        
        Sauce.updateOne({ _id: req.params.id }, 
          {  $pull : { usersLiked : req.body.userId},
              $inc : { likes : -1},  
          })
          .then(() => res.status(200).json({ message: 'j aime : choix annulé !' }))
          .catch(error => res.status(400).json({ error }));

        } else if (req.body.like == 0 && usersDisliked.includes(req.body.userId) ) {
          // l'utilisateur annule ce qu'il n'aime pas.
          
        Sauce.updateOne({ _id: req.params.id }, 
          {  $pull : { usersDisliked : req.body.userId},
             $inc : { dislikes : -1},
            })
            .then(() => res.status(200).json({ message: 'choix annulé !' }))
            .catch(error => res.status(400).json({ error }));
          }

  } catch(error) { 
    res.status(400).json({ error });

  }//fin de try

}//fin de exports.likepost
*/

/*
//get all Sauce
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};
*/

/*
//get one sauce
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
      .then(sauce => {
        
        sauce.likes = sauce.usersLiked.count()
        sauce.disLikes = sauce.usersDisLiked.count()
        
       res.status(200).json( sauce )
      })
      .catch(error => res.status(404).json({ error }));
};
*/