var express = require("express");
var router = express.Router();

router.get("/", function (req, res, next) {
  res.render("registo", { error_check_email: false, error_check_number: false, error_check_password: false, error_check_confirma_password: false});
}); 

router.post("/", function (req, res, next) {
    
  let error_check_email = true;
    
  let error_check_number = true;

  let error_check_password = true;

  let error_check_confirma_password = true;

   // Verifica se o email não está vazio
  if(Object.keys(req.body.check_email).length !== 0) {
    error_check_email = false;
  } 

  // Verifica se o numero não está vazio
  if(Object.keys(req.body.check_numero).length !== 0) {
    error_check_number = false;
  } 

  // Verifica se a password não está vazia
  if(Object.keys(req.body.check_password).length !== 0) {
    error_check_password = false;
  }   
  
  // Verifica se o Confirma password não está vazio
  if(Object.keys(req.body.check_confirma_password).length !== 0) {
    error_check_confirma_password = false;
  } 

  //Verifica se está algum campo vazio
  if(error_check_number == true || error_check_email == true || error_check_password == true || error_check_confirma_password == true){
    res.render("registo", {error_check_number: error_check_number, error_check_email:error_check_email, error_check_password: error_check_password, error_check_confirma_password:error_check_confirma_password});
  }
  
});


module.exports = router;
