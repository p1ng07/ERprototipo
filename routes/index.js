var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  console.log(req.session);
  res.render("home", { title: "Home" });

  // TODO Fornecer uma lista de carreiras para a página carregar
});

router.post("/", function (req, res, next) {
  console.log(req.session);
  res.render("home", { title: "Home" });
});

module.exports = router;
