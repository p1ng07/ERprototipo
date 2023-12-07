var express = require("express");
var router = express.Router();

/* GET Pedir passe page. */
router.get("/", function (req, res, next) {
    res.render("getPass")
});

router.post("/", function (req, res, next) {
    const formData = {
        nomeMembroUMa: req.body.nomeMembroUMa,
        numberMembroUMa: req.body.numberMembroUMa,
        CCMembroUMa: req.body.CCMembroUMa,
        cartaoMembroUMa: req.body.cartaoMembroUMa,
        tipoPasse: req.body.tipoPasse,
        comprovativoMorada: req.body.comprovativoMorada,
        emitted: false
    }

    req.session.studentFormData = req.session.studentFormData || []
    req.session.studentFormData.push(formData);
    res.redirect('/')
})

module.exports = router;