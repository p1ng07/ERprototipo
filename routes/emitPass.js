var express = require("express");
var router = express.Router();

/* GET Pedir passe page. */
router.get("/", function (req, res, next) {
    const studentFormData = req.session.studentFormData || []
    res.render('emitPass', { studentFormData: studentFormData });
});

router.post("/emitir/:index", function (req, res) {
    const index = req.params.index;

    req.session.studentFormData[index].emitted = true;

    res.redirect("/emitPass");
});

router.post("/apagar/:index", function (req, res) {
    const index = req.params.index;

    req.session.studentFormData.splice(index, 1);

    res.redirect("/emitPass");
});

module.exports = router;