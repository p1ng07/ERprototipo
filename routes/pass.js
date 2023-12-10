var express = require("express");
var router = express.Router();
var fs = require("fs");

/* GET pass page. */
router.get("/", function (req, res, next) {
    let hasPass = false;
    let getPass = false;
    let emittedPass = false;
    const account_list = JSON.parse(fs.readFileSync("./contas.json"));
    account_list.every((account) => {
        if (account.email == req.session.email) {
            if (account.hasPass == true) {
                hasPass = true;
            }
            if (account.getPass == true) {
                getPass = true;
            }
            if (account.emittedPass == true) {
                emittedPass = true;
            }
            res.render("pass", { title: "Passe", hasPass, getPass, emittedPass })
            return false;
        }
        return true;
    });
});

router.post("/", function (req, res, next) {
    res.render("pass", { title: "Passe" });
});

module.exports = router;
