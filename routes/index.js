var express = require("express");
var path = require("path");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("home", {
    title: "Home",
    carreira_error: false,
    notify_login: req.query.notify_login == "true",
  });
});

router.post("/visualizar-horario", function (req, res, next) {
  let carreira_error = false;
  const horarioSelecionado = req.body.horario;

  if (horarioSelecionado == "") {
    carreira_error = true;
  }

  if (carreira_error) {
    res.render("horarios", { carreira_error });
  } else {
    const horarioPath = path.join(
      __dirname,
      "../public/horarios",
      `${horarioSelecionado}.pdf`
    );
    res.sendFile(horarioPath);
  }
});

module.exports = router;
