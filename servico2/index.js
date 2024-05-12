const express = require("express");
const amqp = require("amqplib/callback_api");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.post("/notificar", (req, res) => {
    console.log(req.body);

    const message = req.body?.message;

    if (!message) return res.status(400).send("Nenhuma mensagem foi definida para envio");

    try {
        amqp.connect("amqp://localhost", (err, con) => {
            if (err) throw err;

            con.createChannel((err, channel) => {
                if (err) throw err;

                const queue = "notify_rabbitmq";

                channel.assertQueue(queue, { durable: false });

                channel.sendToQueue(queue, Buffer.from(message));

                res.send({ message: `[x] Sent ${message}` });

                setTimeout(() => con.close(), 500);
            });
        });
    } catch (err) {
        console.error(err?.response?.data || err);
        res.status(500).send(err?.response?.data || err);
    }
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`rodando na porta ${PORT}`);
});
