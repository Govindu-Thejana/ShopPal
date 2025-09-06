import express from "express";
import cors from "cors";
import { Kafka, Partitioners } from "kafkajs";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(express.json());

const kafka = new Kafka({
  clientId: "payment-service",
  brokers: [process.env.KAFKA_BROKERS || "kafka:9092"],
});

const producer = kafka.producer({
  createPartitioner: Partitioners.LegacyPartitioner,
});

const connectToKafka = async () => {
  try {
    await producer.connect();
    console.log("✅ Kafka Producer connected successfully!");
    return true;
  } catch (err) {
    console.log("❌ Error connecting to Kafka:", err.message);
    return false;
  }
};

app.post("/payment-service", async (req, res) => {
  try {
    const { cart, username } = req.body;
    const userId = Math.floor(Math.random() * 100);
    console.log("🔄 Processing payment for userId:", userId);

    // TODO: PAYMENT PROCESSING

    // KAFKA - Send message to payment-successful topic
    try {
      console.log("📤 Attempting to send Kafka message...");
      const kafkaMessage = {
        userId,
        username,
        cart,
        timestamp: new Date().toISOString(),
      };

      await producer.send({
        topic: "payment-successful",
        messages: [
          {
            key: userId.toString(),
            value: JSON.stringify(kafkaMessage),
          },
        ],
      });

      console.log(
        "✅ Kafka message sent successfully to 'payment-successful' topic:",
        kafkaMessage
      );
    } catch (kafkaError) {
      console.error("❌ Kafka message failed:", kafkaError.message);
      // Don't fail the payment if Kafka fails
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

app.listen(8000, () => {
  connectToKafka();
  console.log("Payment service is running on port 8000");
});

export default app;
