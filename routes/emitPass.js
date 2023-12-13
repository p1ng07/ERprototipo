var express = require("express");
var router = express.Router();
var fs = require("fs");

/* GET Pedir passe page. */
router.get("/", function (req, res, next) {
    const account_list = JSON.parse(fs.readFileSync("./contas.json"));
    const admin = account_list.find(account => account.isAdmin === true);
    const studentFormData = admin.emitList;
    const changeData = admin.changeList;
    res.render('emitPass', { studentFormData: studentFormData, changeData: changeData });
});

router.post("/emitir/:index", function (req, res) {
    const index = req.params.index;
    const email = req.body.emailAssociado;

    const account_list = JSON.parse(fs.readFileSync("./contas.json"));
    const account = account_list.find(account => account.email === email);
    const adminIndex = account_list.findIndex(account => account.isAdmin === true);

    if (account) {
        account.emittedPass = true;
        account.hasPass = true;
        account.typePass = req.body.tipoPasse;
    }
    if (adminIndex !== -1) {
        if (index >= 0 && index < account_list[adminIndex].emitList.length) {
            account_list[adminIndex].emitList[index].emitted = true;
        }
    }
    fs.writeFile("./contas.json", JSON.stringify(account_list), (error) => {
        if (error) throw error;
    });

    res.redirect("/emitPass");
});

router.post("/emitir/muda/:index", function (req, res) {
    const index = req.params.index;
    const email = req.body.emailAssociado;

    const account_list = JSON.parse(fs.readFileSync("./contas.json"));
    const account = account_list.find(account => account.email === email);
    const adminIndex = account_list.findIndex(account => account.isAdmin === true);

    if (account) {
        account.changePass = false;
        account.typePass = req.body.tipoPasse;
    }

    if (adminIndex !== -1) {
        if (index >= 0 && index < account_list[adminIndex].changeList.length) {
            account_list[adminIndex].changeList[index].emitted = true;
        }
    }

    fs.writeFile("./contas.json", JSON.stringify(account_list), (error) => {
        if (error) throw error;
    });

    res.redirect("/emitPass");
});

router.post("/apagar/:index", function (req, res) {
    const index = req.params.index;
    const email = req.body.emailAssociado;

    const account_list = JSON.parse(fs.readFileSync("./contas.json"));
    const account = account_list.find(account => account.email === email);
    const adminIndex = account_list.findIndex(account => account.isAdmin === true);

    if (account) {
        account.getPass = false;
        account.typePass = "";
    }
    if (adminIndex !== -1) {
        if (index >= 0 && index < account_list[adminIndex].emitList.length) {
            account_list[adminIndex].emitList.splice(index, 1);
        }
    }
    fs.writeFile("./contas.json", JSON.stringify(account_list), (error) => {
        if (error) throw error;
    });

    res.redirect("/emitPass");
});

router.post("/apagar/muda/:index", function (req, res) {
    const index = req.params.index;
    const email = req.body.emailAssociado;

    const account_list = JSON.parse(fs.readFileSync("./contas.json"));
    const account = account_list.find(account => account.email === email);
    const adminIndex = account_list.findIndex(account => account.isAdmin === true);

    if (account) {
        account.changePass = false;
    }

    if (adminIndex !== -1) {
        if (index >= 0 && index < account_list[adminIndex].changeList.length) {
            account_list[adminIndex].changeList.splice(index, 1);
        }
    }

    fs.writeFile("./contas.json", JSON.stringify(account_list), (error) => {
        if (error) throw error;
    });

    res.redirect("/emitPass");
});

module.exports = router;