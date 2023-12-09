var express = require("express");
var router = express.Router();
var nodemailer = require("nodemailer")

//Este email foi criado para ser possivel responder aos emails enviados
//Credenciais do email
//Esta é a passe de acesso para o envio dos emails
//Se quiserem aceder mesmo ao email a pass é: autocarrosUMa@@2000
var email = "autocarrosuma@gmail.com"
var pass = "ujfdzqglqdvikmxx"
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* GET contacts page. */
router.get("/", function (req, res, next) {
    res.render("contactar", {nome_error: false, email_error: false, assunto_error: false, mensagem_error: false, sended: false})
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

    let nome_error = false;
    let email_error = false;
    let assunto_error = false;
    let mensagem_error = false;
    let sended = false;

    if (nomeMembroUMa.length == 0) {
        nome_error = true;
    }

    if (!emailRegex.test(emailMembroUMa)) {
        email_error = true;
    }

    if (assuntoEmail.length == 0) {
        assunto_error = true;
    }

    if (mensagemEmail.length == 0) {
        mensagem_error = true;
    }

    if (nome_error || email_error || assunto_error || mensagem_error) {
        res.render("contactar", { nome_error, email_error, assunto_error, mensagem_error, sended })
    } else {
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
            sended = true;
            res.render("contactar", { nome_error, email_error, assunto_error, mensagem_error, sended })
        })
    }

})


module.exports = router;
