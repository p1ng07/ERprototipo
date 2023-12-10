var express = require("express");
var router = express.Router();
var fs = require("fs");

/* GET Pedir passe page. */
router.get("/", function (req, res, next) {
    const studentFormData = req.session.studentFormData || []
    res.render('emitPass', { studentFormData: studentFormData });
});

router.post("/emitir/:index", function (req, res) {
    const index = req.params.index;
    const email = req.body.emailAssociado;

    const account_list = JSON.parse(fs.readFileSync("./contas.json"));
    const account = account_list.find(account => account.email === email);

    if (account) {
        account.emittedPass = true;
        account.hasPass = true;
        fs.writeFile("./contas.json", JSON.stringify(account_list), (error) => {
            if (error) throw error;
        });
    }

    req.session.studentFormData[index].emitted = true;

    res.redirect("/emitPass");
});

router.post("/apagar/:index", function (req, res) {
    const index = req.params.index;
    const email = req.body.emailAssociado;

    const account_list = JSON.parse(fs.readFileSync("./contas.json"));
    const account = account_list.find(account => account.email === email);

    if (account) {
        account.getPass = false;
        fs.writeFile("./contas.json", JSON.stringify(account_list), (error) => {
            if (error) throw error;
        });
    }

    req.session.studentFormData.splice(index, 1);

    res.redirect("/emitPass");
});

module.exports = router;