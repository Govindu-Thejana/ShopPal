import cors from "cors";
import express from "express";
import { Kafka } from "kafkajs";

const app = express();
app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      if (/^http:\/\/localhost:\d+$/.test(origin)) return cb(null, true);
      return cb(null, false);
    },
    credentials: true,
  })
);
app.use(express.json());
const PORT = process.env.PORT || 8001;

const kafka = new Kafka({
  clientId: "analytic-service",
  brokers: [process.env.KAFKA_BROKERS || "kafka:9092"],
});

const consumer = kafka.consumer({ groupId: "analytic-service" });

// Stats and recent events storage
let totals = {
  payments: 0,
  orders: 0,
  emails: 0,
};

const MAX_RECENT = 10;
const recentPayments = [];
const recentOrders = [];
const recentEmails = [];

const runKafkaConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({
    topics: ["payment-successful", "order-successful", "email-successful"],
    fromBeginning: true,
  });

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      const value = JSON.parse(message.value.toString());

      switch (topic) {
        case "payment-successful": {
          const { userId, cart } = value;
          const total = cart.reduce((acc, item) => acc + item.price, 0);

          totals.payments += 1;

          // Keep recent payments - newest first
          recentPayments.unshift({ userId, total });
          if (recentPayments.length > MAX_RECENT) recentPayments.pop();

          console.log(
            `Analytic consumer ${userId} made a payment of $${total.toFixed(2)}`
          );
          break;
        }
        case "order-successful": {
          const { userId, orderId } = value;

          totals.orders += 1;

          recentOrders.unshift({ userId, orderId });
          if (recentOrders.length > MAX_RECENT) recentOrders.pop();

          console.log(
            `Analytic consumer order created for user ${userId} with order ID ${orderId}`
          );
          break;
        }
        case "email-successful": {
          const { userId, emailId } = value;

          totals.emails += 1;

          recentEmails.unshift({ userId, emailId });
          if (recentEmails.length > MAX_RECENT) recentEmails.pop();

          console.log(
            `Analytic consumer email sent to user ${userId} with email ID ${emailId}`
          );
          break;
        }
        default:
          console.log(`Unknown topic: ${topic}`);
      }
    },
  });
};

// Dashboard API routes
app.get("/dashboard/summary", (req, res) => {
  res.json({
    totalPayments: totals.payments,
    totalOrders: totals.orders,
    totalEmails: totals.emails,
  });
});

app.get("/dashboard/recent-payments", (req, res) => {
  res.json(recentPayments);
});

app.get("/dashboard/recent-orders", (req, res) => {
  res.json(recentOrders);
});

app.get("/dashboard/recent-emails", (req, res) => {
  res.json(recentEmails);
});

app.listen(PORT, () => {
  console.log(`Analytic service running on port ${PORT}`);
  runKafkaConsumer().catch((err) => {
    console.error("Error running Kafka consumer:", err);
  });
});
