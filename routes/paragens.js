var express = require("express");
var router = express.Router();
var fs = require("fs");

router.get("/", function (req, res, next) {
    res.render("paragens", { title: "Paragens" });
  });

module.exports = router;