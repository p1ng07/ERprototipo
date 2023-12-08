var express = require("express");
var router = express.Router();
var multer = require("multer");
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/uploads/')); //Caminho onde as imagens serão armazenadas
    },
    filename: function (req, file, cb) {
        //Função para tratar os caracteres especiais
        cb(null, Date.now() + '-' + encodeURIComponent(file.originalname));
    }
});

const upload = multer({ storage: storage });

/* GET Pedir passe page. */
router.get("/", function (req, res, next) {
    res.render("getPass")
});

router.post("/", upload.fields([
    { name: 'CCMembroUMa', maxCount: 1 },
    { name: 'cartaoMembroUMa', maxCount: 1 },
    { name: 'comprovativoMorada', maxCount: 1 }
]), function (req, res, next) {
    try {
        const formData = {
            nomeMembroUMa: req.body.nomeMembroUMa,
            numberMembroUMa: req.body.numberMembroUMa,
            CCMembroUMa: '/uploads/' + req.files['CCMembroUMa'][0].filename,
            cartaoMembroUMa: '/uploads/' + req.files['cartaoMembroUMa'][0].filename,
            tipoPasse: req.body.tipoPasse,
            comprovativoMorada: req.files['comprovativoMorada'] ? '/uploads/' + req.files['comprovativoMorada'][0].filename : null,
            emitted: false
        };

        req.session.studentFormData = req.session.studentFormData || [];
        req.session.studentFormData.push(formData);
        res.redirect('/');
    } catch (error) {
        next(error);
    }
});


module.exports = router;