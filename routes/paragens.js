var express = require("express");
var router = express.Router();
var fs = require("fs");

router.get("/", function (req, res, next) {
  // TODO verificar se existem notificações que devam disparar, se sim fazer com que apareçà uma notificação no ecra, elemento com posição fixa que quando clicado, remove-se ou mete hidden
  if (typeof req.session.notification_list == "undefined") {
    req.session.notification_list = [];
  }
  let notifications = req.session.notification_list;

  res.render("paragens", { title: "Paragens", notifications: notifications });
});

// Endpoint para criar notificações
router.post("/criar", function (req, res, next) {
  const carreira = req.body.opcao_escolhida;
  const tempo_antecipar = req.body.tempo_antecipar;
  const notification = {
    carreira: carreira,
    tempo_antecipar: tempo_antecipar,
    index: req.session.notification_list.length,
  };

  req.session.notification_list.push(notification);

  req.session.save();
  res.redirect("/paragens/");
});

// Endpoint para cancelar notificações
router.get("/cancelar/:index", function (req, res, next) {
  console.log("Apagar:" + req.params.index);

  req.session.notification_list = req.session.notification_list.filter(
    (notification) => notification.index != req.params.index
  );

  req.session.save();
  console.log(req.session.notification_list);
  res.sendStatus(200);
});

module.exports = router;
