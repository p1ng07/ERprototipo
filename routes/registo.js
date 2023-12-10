var express = require("express");
var router = express.Router();

const fs = require("fs");

router.get("/", function (req, res, next) {
  res.render("registo", { error_check_email: false });
});

router.post("/", function (req, res, next) {
  // Verifica se ocorreu um erro na criação do email
  let error_check_email = true;

  if (Object.keys(req.body.form__email).length === 0) {
    res.render("registo", { error_check_email: error_check_email });
  }

  // TODO Fazer verificação de dados (email pass e numero)

  fs.readFile("./contas.json", (error, data) => {
    if (error) throw error;
    const account_list = JSON.parse(data.toString());

    // Adicionar nova conta à lista de contas
    const new_account = {
      email: req.body.form__email,
      pass: req.body.form__pass,
      numero: req.body.form__number,
      isAdmin: false,
    };

    account_list.push(new_account);

    // Escrever nova lista de contas
    fs.writeFile("./contas.json", JSON.stringify(account_list), (error) => {
      if (error) throw error;
    });
  });

  // TODO Acrescentar validação de erros
  res.redirect("/login");
});

module.exports = router;
