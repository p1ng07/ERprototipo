var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("login");
  req.session.cookie.isAdmin = true;
  console.log(req.session);
});

router.post("/", function (req, res, next) {
  res.render("login");
  console.log(req.session);
  if (req.session.cookie.isAdmin == true) {
    console.log("user is admin");
  }
});

module.exports = router;
