var express = require("express");
var router = express.Router();
var nodemailer = require("nodemailer")

//Este email foi criado para ser possivel responder aos emails enviados
//Credenciais do email
//Esta é a passe de acesso para o envio dos emails
//Se quiserem aceder mesmo ao email a pass é: autocarrosUMa@@2000
var email = "autocarrosuma@gmail.com"
var pass = "ujfdzqglqdvikmxx"

/* GET contacts page. */
router.get("/", function (req, res, next) {
    res.render("contactar", {sended: false})
})

const transporter = nodemailer.createTransport({
    service: "gmail",
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
        res.render("contactar", { sended: true })
    })

})


module.exports = router;
