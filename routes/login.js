var express = require("express");
var router = express.Router();
var fs = require("fs");

router.get("/logout", function (req, res, next) {
  req.session.isAdmin = undefined;
  req.session.save();
  res.redirect("/");
});

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("login", { error_pass: false, error_email: false });
});

router.post("/", function (req, res, next) {
  // Sinaliza se houve um erro com a palavra-passe
  let error_pass = true;
  // Sinaliza se houve um erro com o email
  let error_email = true;

  const account_list = JSON.parse(fs.readFileSync("./contas.json"));

  // Verifica se a conta usada no login existe
  account_list.every((account) => {
    if (account.email == req.body.form__email) {
      console.log("Email aceite");
      // Sinalizar que não houve nenhum erro com o email
      error_email = false;
      if (account.pass == req.body.form__password) {
        // Conta existe, fazer login
        req.session.isAdmin = account.isAdmin;
        req.session.email = account.email;
        req.session.save();

        console.log("Pass aceite");
        // Sinalizar que não houve nenhum erro com a pass
        error_pass = false;
        return false;
      }
    }
    return true;
  });

  if (error_pass || error_email) {
    // Mandar de volta para o login com erros
    res.render("login", { error_pass: error_pass, error_email: error_email });
  } else {
    // Guardar na sessão se o utilizador corrente é admin ou não

    // Renderizar a página principal
    console.log("Sessao:" + req.session);   
    if (req.session.isAdmin) {
      // Acesso aos dados dos students na sessão
      console.log(req.session.studentFormData);
    }
    res.redirect("/");
  }
});

module.exports = router;
