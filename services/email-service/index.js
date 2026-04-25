import dotenv from "dotenv";
import { Kafka } from "kafkajs";
import nodemailer from "nodemailer";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildOrderEmail } from "./emailTemplate.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });

const kafka = new Kafka({
  clientId: "email-service",
  brokers: (process.env.KAFKA_BROKERS || (process.env.NODE_ENV === "production" ? "kafka:9092" : "localhost:9094")).split(","),
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: "email-service" });

const emailUser = process.env.EMAIL_USER?.trim();
const emailPass = (process.env.EMAIL_PASS || "").replace(/\s+/g, "");
const emailTo = (process.env.EMAIL_TO || emailUser || "").trim();

const validateEmailConfig = () => {
  if (!emailUser || !emailPass) {
    throw new Error(
      "Missing EMAIL_USER or EMAIL_PASS in services/email-service/.env"
    );
  }
};

// SMTP (Gmail app password required)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: emailUser,
    pass: emailPass,
  },
});

const run = async () => {
  validateEmailConfig();

  await consumer.connect();
  await producer.connect();
  await consumer.subscribe({ topic: "order-successful", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const { userId, username, orderId, cart = [] } = JSON.parse(message.value.toString());

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
        userName: username || `User ${userId}`,
        orderId,
        items,
        subtotal,
        shipping,
        tax,
        total,
        deliveryEta: "Aug 29 – Sep 19",
        supportEmail: emailUser,
        address: {
          name: username || `User ${userId}`,
          line1: "123 Market St",
          city: "Colombo",
          state: "WP",
          zip: "00001",
          country: "Sri Lanka",
        },
      });

      const mailOptions = {
        from: emailUser,
        to: emailTo,
        subject,
        html,
        text, // good for spam filters + accessibility
        attachments: [
          // Optional embedded logo
          {
            filename: "logo.png",
            path: path.join(__dirname, "assets", "logo.png"),
            cid: "shopmateLogo",
          },
        ],
      };

      try {
        console.log(`📧 Preparing order email for order ${orderId} with ${items.length} item(s)`);
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
