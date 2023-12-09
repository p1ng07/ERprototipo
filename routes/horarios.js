const express = require("express");
const router = express.Router();
const path = require("path");

/* GET horarios page. */
router.get("/", function (req, res, next) {
    res.render("horarios", { carreira_error: false });
});

router.post("/visualizar-horario", function (req, res, next) {
    let carreira_error = false;
    const horarioSelecionado = req.body.horario;

    if (horarioSelecionado == "") {
        carreira_error = true;
    }

    if (carreira_error) {
        res.render("horarios", { carreira_error });
    } else {
        const horarioPath = path.join(__dirname, "../public/horarios", `${horarioSelecionado}.pdf`);
        res.sendFile(horarioPath);
    }
});

module.exports = router;
