// utilisation de Password-validator
//============================================================

var passwordValidator = require('password-validator');
 
// Create a schema
var passSchema = new passwordValidator();

// Add properties to it

passSchema
  .is()
  .min(8)
  .is()
  .max(100)
  .has()
  .uppercase()
  .has()
  .lowercase()
  .has()
  .digits(2)
  .has()
  .not()
  .spaces()
  .is()
  .not()
  .oneOf(["Passw0rd", "Password123"]);

// export shema

module.exports = passSchema;
