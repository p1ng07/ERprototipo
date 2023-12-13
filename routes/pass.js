var express = require("express");
var router = express.Router();
var fs = require("fs");

/* GET pass page. */
router.get("/", function (req, res, next) {
    let hasPass = false;
    let getPass = false;
    let emittedPass = false;
    let typePass = "";
    let payed = false;
    let changePass = false;
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
            if (account.typePass !== "") {
                typePass = account.typePass;
            }
            if (account.payed == true) {
                payed = true;
            }
            if (account.changePass == true){
                changePass = true;
            }
            res.render("pass", { title: "Passe", hasPass, getPass, emittedPass, typePass, payed, changePass, changeType: false })
            return false;
        }
        return true;
    });
});


module.exports = router;
