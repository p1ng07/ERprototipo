var express = require("express");
var router = express.Router();

/* GET Pedir passe page. */
router.get("/", function (req, res, next) {
        const studentFormData = req.session.studentFormData || []
        res.render('emitPass', { studentFormData: studentFormData });
});

module.exports = router;