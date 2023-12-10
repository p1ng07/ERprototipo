var express = require("express");
var router = express.Router();
var fs = require("fs");

/* GET Pedir passe page. */
router.get("/", function (req, res, next) {
    const studentFormData = req.session.studentFormData || []
    const changeData = req.session.changeData || []
    res.render('emitPass', { studentFormData: studentFormData, changeData: changeData });
});

router.post("/emitir/:index", function (req, res) {
    const index = req.params.index;
    const email = req.body.emailAssociado;

    const account_list = JSON.parse(fs.readFileSync("./contas.json"));
    const account = account_list.find(account => account.email === email);

    if (account) {
        account.emittedPass = true;
        account.hasPass = true;
        account.typePass = req.body.tipoPasse;
        fs.writeFile("./contas.json", JSON.stringify(account_list), (error) => {
            if (error) throw error;
        });
    }

    req.session.studentFormData[index].emitted = true;

    res.redirect("/emitPass");
});

router.post("/emitir/muda/:index", function (req, res) {
    const index = req.params.index;
    const email = req.body.emailAssociado;

    const account_list = JSON.parse(fs.readFileSync("./contas.json"));
    const account = account_list.find(account => account.email === email);

    if (account) {
        account.emittedPass = true;
        account.hasPass = true;
        account.typePass = req.body.tipoPasse;
        fs.writeFile("./contas.json", JSON.stringify(account_list), (error) => {
            if (error) throw error;
        });
    }

    req.session.changeData[index].emitted = true;

    res.redirect("/emitPass");
});

router.post("/apagar/:index", function (req, res) {
    const index = req.params.index;
    const email = req.body.emailAssociado;

    const account_list = JSON.parse(fs.readFileSync("./contas.json"));
    const account = account_list.find(account => account.email === email);

    if (account) {
        account.getPass = false;
        account.typePass = "";
        fs.writeFile("./contas.json", JSON.stringify(account_list), (error) => {
            if (error) throw error;
        });
    }

    req.session.studentFormData.splice(index, 1);

    res.redirect("/emitPass");
});

router.post("/apagar/muda/:index", function (req, res) {
    const index = req.params.index;
    const email = req.body.emailAssociado;

    const account_list = JSON.parse(fs.readFileSync("./contas.json"));
    const account = account_list.find(account => account.email === email);

    if (account) {
        account.getPass = false;
        account.typePass = "";
        fs.writeFile("./contas.json", JSON.stringify(account_list), (error) => {
            if (error) throw error;
        });
    }

    req.session.changeData.splice(index, 1);

    res.redirect("/emitPass");
});

module.exports = router;