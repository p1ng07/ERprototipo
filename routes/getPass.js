var express = require("express");
var router = express.Router();

/* GET Pedir passe page. */
router.get("/", function (req, res, next) {
  res.render("getPass")
});

module.exports = router;