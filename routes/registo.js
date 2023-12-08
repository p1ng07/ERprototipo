var express = require("express");
var router = express.Router();

router.get("/", function (req, res, next) {
  res.render("registo", { error_check_email: false});
}); 

router.post("/", function (req, res, next) {
    // Verifica se ocorreu um erro na criação do email
    let error_check_email = true;

    if(Object.keys(req.body.check_email).length === 0) {
        res.render("registo", {error_check_email: error_check_email});
    }   
});


module.exports = router;
