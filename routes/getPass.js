var express = require("express");
var router = express.Router();
var multer = require("multer");
var fs = require("fs");
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
    res.render("getPass", { nome_error: false, cc_error: false, cartao_error: false, tipo_error: false, comprovativo_error: false })
});

router.post("/", upload.fields([
    { name: 'CCMembroUMa' },
    { name: 'cartaoMembroUMa' },
    { name: 'comprovativoMorada' }
]), function (req, res, next) {
    const { nomeMembroUMa, tipoPasse } = req.body;

    let nome_error = false;
    let cc_error = false;
    let cc_file_error = false;
    let cartao_error = false;
    let cartao_file_error = false;
    let tipo_error = false;
    let comprovativo_error = false;
    let comprovativo_file_error = false;

    if (nomeMembroUMa.length == 0) {
        nome_error = true;
    }

    if (req.files['CCMembroUMa']) {
        req.files['CCMembroUMa'].forEach(file => {
            const fileName = file.originalname;
            if (fileName.toLowerCase().endsWith('jpg')) { } else {
                cc_file_error = true;
            }
        });
    }

    if (req.files['cartaoMembroUMa']) {
        req.files['cartaoMembroUMa'].forEach(file => {
            const fileName = file.originalname;
            if (fileName.toLowerCase().endsWith('jpg')) { } else {
                cartao_file_error = true;
            }
        });
    }

    if (req.files['comprovativoMorada']) {
        req.files['comprovativoMorada'].forEach(file => {
            const fileName = file.originalname;
            if (fileName.toLowerCase().endsWith('jpg')) { } else {
                comprovativo_file_error = true;
            }
        });
    }

    if (!req.files['CCMembroUMa'] || req.files['CCMembroUMa'].length == 0 || req.files['CCMembroUMa'].length > 2 || cc_file_error) {
        cc_error = true;
    }

    if (!req.files['cartaoMembroUMa'] || req.files['cartaoMembroUMa'].length == 0 || req.files['cartaoMembroUMa'].length > 2 || cartao_file_error) {
        cartao_error = true;
    }

    if (tipoPasse != 'Interurbano' && tipoPasse != 'Urbano') {
        tipo_error = true;
    }

    if (tipoPasse == 'Interurbano' && (!req.files['comprovativoMorada'] || req.files['comprovativoMorada'].length == 0 || req.files['comprovativoMorada'].length > 2 || comprovativo_file_error)) {
        comprovativo_error = true;
    }

    if (nome_error || cc_error || cartao_error || tipo_error || comprovativo_error) {
        res.render("getPass", { nome_error, cc_error, cartao_error, tipo_error, comprovativo_error });
    } else {
        try {
            let numeroUMa;
            const account_list = JSON.parse(fs.readFileSync("./contas.json"));
            const account = account_list.find(account => account.email === req.session.email)
            if (account) {
                numeroUMa = account.numero;
                account.getPass = true;
                fs.writeFile("./contas.json", JSON.stringify(account_list), (error) => {
                    if (error) throw error;
                });
            }

            const formData = {
                nomeMembroUMa: req.body.nomeMembroUMa,
                numberMembroUMa: numeroUMa,
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
                emitted: false,
                emailAssociado: req.session.email
            };
            console.log(formData)

            req.session.studentFormData = req.session.studentFormData || [];
            req.session.studentFormData.push(formData);
            res.redirect('/');
        } catch (error) {
            next(error);
        }
    }
});


module.exports = router;