import { Kafka } from "kafkajs";
import nodemailer from "nodemailer";
import { buildOrderEmail } from "./emailTemplate.js";

const kafka = new Kafka({
  clientId: "email-service",
  brokers: (process.env.KAFKA_BROKERS || "kafka:9092").split(","),
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: "email-service" });

// SMTP (Gmail app password required)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const run = async () => {
  await consumer.connect();
  await producer.connect();
  await consumer.subscribe({ topic: "order-successful", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const { userId, orderId, cart = [] } = JSON.parse(message.value.toString());

      // Map your cart to items (name/qty/price). Adjust as needed.
      const items = cart.map((c) => ({
        name: c.name,
        qty: c.qty || 1,
        price: Number(c.price || 0),
      }));

      const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
      const shipping = 0;
      const tax = +(subtotal * 0.08).toFixed(2);
      const total = +(subtotal + shipping + tax).toFixed(2);

      const { subject, html, text } = buildOrderEmail({
        userName: `User ${userId}`,
        orderId,
        items,
        subtotal,
        shipping,
        tax,
        total,
        deliveryEta: "Aug 29 – Sep 19",
        supportEmail: "amarasingheau@gmail.com",
        address: {
          name: `User ${userId}`,
          line1: "123 Market St",
          city: "Colombo",
          state: "WP",
          zip: "00001",
          country: "Sri Lanka",
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: [process.env.EMAIL_USER, "amarasingheau@gmail.com"].filter(Boolean).join(", "),
        subject,
        html,
        text, // good for spam filters + accessibility
        attachments: [
          // Optional embedded logo
          {
            filename: "logo.png",
            path: "/app/assets/logo.png", // place a small logo file in services/email-service/assets/logo.png
            cid: "shopmateLogo",
          },
        ],
      };

      try {
        const info = await transporter.sendMail(mailOptions);
        console.log("✅ Email sent:", info.messageId);
        await producer.send({
          topic: "email-successful",
          messages: [{ value: JSON.stringify({ userId, emailId: info.messageId }) }],
        });
      } catch (err) {
        console.error("❌ Email send failed:", err.message);
      }
    },
  });
};

run().catch(console.error);