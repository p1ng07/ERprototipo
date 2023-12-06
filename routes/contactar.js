var express = require("express");
var router = express.Router();
var nodemailer = require("nodemailer")

//O envio de emails não funciona com o gmail por isso foi utilzado o outlook
//Este é um email de teste que já tinha criado
//Credenciais do email
var email = "horarios.phpweb@outlook.pt"
var pass = "PHPWEB123"

/* GET contacts page. */
router.get("/", function (req, res, next) {
    res.render("contactar")
})

const transporter = nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
    secure: false,
    auth: {
        user: email,
        pass: pass
    }
})

router.post("/", function (req, res, next) {
    const { nomeMembroUMa, emailMembroUMa, assuntoEmail, mensagemEmail } = req.body

    const mailData = {
        from: email,
        to: email,
        subject: assuntoEmail,
        text: `Nome: ${nomeMembroUMa}\nEmail: ${emailMembroUMa}\nMensagem: ${mensagemEmail}`
    }

    transporter.sendMail(mailData, (error, info) => {
        if (error) {
            return res.status(500).send(error.toString());
        }
        //TODO: Fazer o tratamento de quando o email é enviado
        res.status(200).send('E-mail enviado com sucesso!');
    })

})


module.exports = router;
