import express from "express";
import cors from "cors";
import { Kafka, Partitioners } from "kafkajs";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
  }),
);
app.use(express.json());

const kafka = new Kafka({
  clientId: "payment-service",
  brokers: [process.env.KAFKA_BROKERS || (process.env.NODE_ENV === "production" ? "kafka:9092" : "localhost:9094")],
});

const producer = kafka.producer({
  createPartitioner: Partitioners.LegacyPartitioner,
});

let kafkaReady = false;

const connectToKafka = async () => {
  if (kafkaReady) {
    return true;
  }

  try {
    await producer.connect();
    kafkaReady = true;
    console.log("✅ Kafka Producer connected successfully!");
    return true;
  } catch (err) {
    console.log("❌ Error connecting to Kafka:", err.message);
    return false;
  }
};

const sendPaymentEvent = async (kafkaMessage, userId) => {
  await connectToKafka();

  try {
    await producer.send({
      topic: "payment-successful",
      messages: [
        {
          key: userId.toString(),
          value: JSON.stringify(kafkaMessage),
        },
      ],
    });

    console.log("✅ Kafka message sent successfully to 'payment-successful' topic:", kafkaMessage);
    return true;
  } catch (kafkaError) {
    kafkaReady = false;
    console.error("❌ Kafka message failed:", kafkaError.message);

    try {
      await producer.disconnect();
    } catch {
      // ignore disconnect cleanup errors
    }

    const reconnected = await connectToKafka();
    if (!reconnected) {
      return false;
    }

    await producer.send({
      topic: "payment-successful",
      messages: [
        {
          key: userId.toString(),
          value: JSON.stringify(kafkaMessage),
        },
      ],
    });

    kafkaReady = true;
    console.log("✅ Kafka message sent successfully to 'payment-successful' topic after reconnect:", kafkaMessage);
    return true;
  }
};

app.get("/", (_req, res) => {
  res.json({ ok: true });
});

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "payment-service", kafkaReady });
});

app.post("/payment-service", async (req, res) => {
  try {
    const { cart, username } = req.body;
    const userId = Math.floor(Math.random() * 100);
    console.log("🔄 Processing payment for userId:", userId);

    // TODO: PAYMENT PROCESSING

    // KAFKA - Send message to payment-successful topic
    const kafkaMessage = {
      userId,
      username,
      cart,
      timestamp: new Date().toISOString(),
    };

    console.log("📤 Attempting to send Kafka message...");
    const delivered = await sendPaymentEvent(kafkaMessage, userId);
    if (!delivered) {
      return res.status(503).json({
        error: "Payment accepted, but Kafka delivery failed",
        message: "Unable to publish payment event",
      });
    }

    // Use Promise-based timeout instead of callback
    await new Promise((resolve) => setTimeout(resolve, 3000));

    console.log("💰 Payment completed for userId:", userId);
    return res.status(200).json({
      message: "Payment successful",
      userId,
      cart,
    });
  } catch (error) {
    console.error("❌ Payment processing error:", error);
    return res.status(500).json({
      error: "Payment failed",
      message: error.message,
    });
  }
});

app.use((err, req, res, next) => {
  console.error("Global error handler:", err);
  res.status(err.status || 500).json({
    error: err.message || "Internal server error",
  });
});

const bootstrap = async () => {
  await connectToKafka();
  app.listen(8000, () => {
    console.log("Payment service is running on port 8000");
  });
};

bootstrap().catch((err) => {
  console.error("❌ Payment service bootstrap failed:", err);
  process.exit(1);
});

export default app;
