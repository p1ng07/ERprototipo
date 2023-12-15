var express = require("express");
var router = express.Router();
var fs = require("fs");
const url = require("url");

router.get("/", function (req, res, next) {
  if (typeof req.session.notification_list == "undefined") {
    req.session.notification_list = [];
  }
  let notifications = req.session.notification_list;

  res.render("paragens", {
    title: "Paragens",
    notifications: notifications,
    notify: req.query.notify == 1,
    carreira: req.query.carreira,
    tempo_antecipar: req.query.tempo_antecipar,
  });
});

// Endpoint para criar notificações
router.post("/criar", function (req, res, next) {
  const carreira = req.body.opcao_escolhida;
  const tempo_antecipar = req.body.tempo_antecipar;
  let notification = {
    carreira: carreira,
    tempo_antecipar: tempo_antecipar,
    index: req.session.notification_list.length,
  };

  req.session.notification_list.push(notification);

  if (
    req.session.notification_list.find(
      (notification) => notification.tempo_antecipar == 1
    ) !== undefined
  ) {
    req.session.notification_list = req.session.notification_list.filter(
      (element) => {
        notification = element;
        return element.tempo_antecipar !== "1";
      }
    );
    req.session.save();
    res.redirect(
      url.format({
        pathname: "/paragens/",
        query: {
          notify: 1,
          carreira: notification.carreira,
          tempo_antecipar: notification.tempo_antecipar,
        },
      })
    );
  } else {
    req.session.save();
    res.redirect("/paragens/");
  }
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
