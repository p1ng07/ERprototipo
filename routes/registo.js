var express = require("express");
var router = express.Router();
const fs = require("fs");
const validator = require("email-validator");

function isNumeric(str) {
  if (typeof str != "string") return false; // we only process strings!
  return !isNaN(str) && !isNaN(parseFloat(str));
}

router.get("/", function (req, res, next) {
  res.render("registo", {
    error_check_email: "",
    error_confirmation_pass: false,
    error_number: false,
  });
});

router.post("/", function (req, res, next) {
  // Verifica se ocorreu um erro na criação do email
  let error_check_email = "";
  let error_confirmation_pass = false;
  let error_number = false;

  console.log(req.body);

  const email = req.body.form__email;
  const password = req.body.form__pass;
  const confirmation_pass = req.body.form__confirmation_pass;
  const mec_number = req.body.form__number;

  if (typeof email == "undefined") {
    error_check_email = "O e-mail é de preenchimento obrigatório.";
  } else {
    if (!validator.validate(email)) {
      error_check_email = "O e-mail inserido não é válido.";
    } else {
      const account_list = JSON.parse(fs.readFileSync("./contas.json"));
      const account = account_list.filter((account) => account.email == email);

      if (account.length > 0) {
        error_check_email = "O e-mail inserido já é utilizado numa conta.";
      }
    }
  }

  if (typeof confirmation_pass == "undefined") {
    error_confirmation_pass = true;
  } else {
    if (confirmation_pass !== password) {
      error_confirmation_pass = true;
    }
  }

  if (typeof mec_number == "undefined") {
    error_number = true;
  } else {
    if (!isNumeric(mec_number)) {
      error_number = true;
    } else {
      if (mec_number.length !== 7) {
        error_number = true;
      }
    }
  }

  if (error_check_email !== "" || error_confirmation_pass || error_number) {
    res.render("registo", {
      error_confirmation_pass: error_confirmation_pass,
      error_number: error_number,
      error_check_email: error_check_email,
    });
    return;
  }

  fs.readFile("./contas.json", (error, data) => {
    if (error) throw error;
    const account_list = JSON.parse(data.toString());

    // Adicionar nova conta à lista de contas
    const new_account = {
      email: req.body.form__email,
      pass: req.body.form__pass,
      numero: req.body.form__number,
      isAdmin: false,
      hasPass: false,
      getPass: false,
      emittedPass: false,
      changePass: false,
      typePass: "",
      payed: false,
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
