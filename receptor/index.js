const amqp = require("amqplib/callback_api");

async function main() {
    const { channel, queue } = await new Promise(async (res) => {
        await amqp.connect("amqp://localhost", async (err, con) => {
            if (err) throw err;

            await con.createChannel(async (err, channel) => {
                if (err) throw err;

                const queue = "notify_rabbitmq";

                await channel.assertQueue(queue, { durable: false });

                res({ channel, queue });
            });
        });
    });

    channel.consume(
        queue,
        (msg) => {
            console.log(" [x] Received %s", msg.content.toString());
        },
        { noAck: true }
    );
}

main().catch((err) => {
    console.error(err);
});
