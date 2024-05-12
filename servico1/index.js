const express = require("express");
const axios = require("axios");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.post("/pagar", async (req, res) => {
    const paymentId = req.body?.paymentId;
    const value = req.body?.value;
    const payer = req.body?.payer;

    if (!paymentId || !value || !payer) {
        const missing = [{ paymentId }, { value }, { payer }]
            .filter((n) => !Object.values(n)[0])
            .map((n) => Object.keys(n)[0])
            .join(", ");

        return res
            .status(400)
            .send(
                `Não foram fornecidos todos os dados para realizar seu pagamento (faltando: ${missing})`
            );
    }

    try {
        const notification = await axios.post("http://localhost:3001/notificar", {
            message: `${payer} pagou o valor ${value} para a conta ${paymentId}`,
        });

        res.send(notification.data);
    } catch (err) {
        console.error(err?.response?.data || err);
        res.status(500).send(err?.response?.data || err);
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`rodando na porta ${PORT}`);
});
