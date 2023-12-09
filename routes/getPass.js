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
    res.render("getPass", { nome_error: false, numero_error: false, cc_error: false, cartao_error: false, tipo_error: false, comprovativo_error: false })
});

router.post("/", upload.fields([
    { name: 'CCMembroUMa' },
    { name: 'cartaoMembroUMa' },
    { name: 'comprovativoMorada' }
]), function (req, res, next) {
    const { nomeMembroUMa, numberMembroUMa, tipoPasse } = req.body;

    let nome_error = false;
    let numero_error = false;
    let cc_error = false;
    let cartao_error = false;
    let tipo_error = false;
    let comprovativo_error = false;

    if (nomeMembroUMa.length == 0) {
        nome_error = true;
    }

    if (numberMembroUMa.length !== 7) {
        numero_error = true;
    }

    if (!req.files['CCMembroUMa'] || req.files['CCMembroUMa'].length == 0 || req.files['CCMembroUMa'].length > 2 || req.files['CCMembroUMa'].every(file => file.mimetype !== 'image/jpeg')) {
        cc_error = true;
    }

    if (!req.files['cartaoMembroUMa'] || req.files['cartaoMembroUMa'].length == 0 || req.files['cartaoMembroUMa'].length > 2 || req.files['cartaoMembroUMa'].every(file => file.mimetype !== 'image/jpeg')) {
        cartao_error = true;
    }

    if (tipoPasse != 'Interurbano' && tipoPasse != 'Urbano') {
        tipo_error = true;
    }

    if (tipoPasse == 'Interurbano' && (!req.files['comprovativoMorada'] || req.files['comprovativoMorada'].length == 0 || req.files['comprovativoMorada'].length > 2 || req.files['comprovativoMorada'].every(file => file.mimetype !== 'image/jpeg'))) {
        comprovativo_error = true;
    }

    if (nome_error || numero_error || cc_error || cartao_error || tipo_error || comprovativo_error) {
        res.render("getPass", { nome_error, numero_error, cc_error, cartao_error, tipo_error, comprovativo_error });
    } else {
        try {
            const formData = {
                nomeMembroUMa: req.body.nomeMembroUMa,
                numberMembroUMa: req.body.numberMembroUMa,
                CCMembroUMa: Array.isArray(req.files['CCMembroUMa']) ?
                    req.files['CCMembroUMa'].map(file => '/uploads/' + file.filename) :
                    '/uploads/' + req.files['CCMembroUMa'][0].filename,
                cartaoMembroUMa: Array.isArray(req.files['cartaoMembroUMa']) ?
                    req.files['cartaoMembroUMa'].map(file => '/uploads/' + file.filename) :
                    '/uploads/' + req.files['cartaoMembroUMa'][0].filename,
                tipoPasse: req.body.tipoPasse,
                comprovativoMorada: req.files['comprovativoMorada'] ?
                    Array.isArray(req.files['comprovativoMorada']) ?
                        req.files['comprovativoMorada'].map(file => '/uploads/' + file.filename) :
                        '/uploads/' + req.files['comprovativoMorada'][0].filename :
                    null,
                emitted: false
            };


            req.session.studentFormData = req.session.studentFormData || [];
            req.session.studentFormData.push(formData);
            res.redirect('/');
        } catch (error) {
            next(error);
        }
    }
});


module.exports = router;