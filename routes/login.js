var express = require("express");
var router = express.Router();

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

  if (req.body.form__email == "admin@uma.pt") {
    error_email = false;

    if (req.body.form__password == "admin") {
      // Variavel de sessao que controla se o utilizador corrente é admin ou não
      req.session.isAdmin = true;
      req.session.save();

      error_pass = false;
    }
  } else if (req.body.form__email == "student@uma.pt") {
    error_email = false;

    if (req.body.form__password == "student") {
      // Variavel de sessao que controla se o utilizador corrente é admin ou não
      req.session.isAdmin = false;
      req.session.save();

      error_pass = false;
    }
  }

  if (error_pass || error_email) {
    // Mandar de volta para o login com erros
    res.render("login", { error_pass: error_pass, error_email: error_email });
  } else {
    // Guardar na sessão se o utilizador corrente é admin ou não

    // Renderizar a página principal
    console.log("Sessao:" + req.session);
    res.redirect("/");
  }
});

module.exports = router;
