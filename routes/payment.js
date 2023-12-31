var express = require("express");
var router = express.Router();
var fs = require("fs");

/* GET payment page. */
router.get("/", function (req, res, next) {
    let email = req.session.email;
    const account_list = JSON.parse(fs.readFileSync("./contas.json"));
    const account = account_list.find(account => account.email === email);
    let numeroString = account.numero.toString();
    let numeroFormatado = numeroString.slice(0,3) + ' ' + numeroString.slice(3,6) + ' ' + numeroString.slice(6)
    res.render("payment", { title: "Pagamento", payed: false, email, numeroFormatado });
});

router.get("/check", function (req, res, next) {
    let email = req.session.email;
    const account_list = JSON.parse(fs.readFileSync("./contas.json"));
    const account = account_list.find(account => account.email === email);
    let numeroString = account.numero.toString();
    let numeroFormatado = numeroString.slice(0,3) + ' ' + numeroString.slice(3,6) + ' ' + numeroString.slice(6)
    res.render("payment", { title: "Comprovativo", payed: true, email, numeroFormatado });
});

router.post("/", function (req, res, next) {
    const account_list = JSON.parse(fs.readFileSync("./contas.json"));
    const account = account_list.find(account => account.email === req.session.email)
    if (account) {
        account.payed = true;
        fs.writeFile("./contas.json", JSON.stringify(account_list), (error) => {
            if (error) throw error;
        });
    }
    res.redirect("/pass");
});

router.post("/check", function (req, res, next) {
    res.redirect("/pass");
});

module.exports = router;
