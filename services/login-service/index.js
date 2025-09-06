import express from "express";
import cors from "cors";
import { Kafka } from "kafkajs";
import jwt from "jsonwebtoken";

const app = express();

/* ---------------- CORS ---------------- */
// Allow localhost:3000 (and other localhost ports if needed)
const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  // "http://localhost:5173", // uncomment if you use Vite, etc.
];

// Reflect only allowed origins. Works with credentials=true.
const corsConfig = {
  origin(origin, cb) {
    // allow non-browser clients with no Origin (curl, Postman)
    if (!origin) return cb(null, true);
    if (ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
    return cb(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  credentials: true,        // set to true if your frontend sends cookies/credentials
  maxAge: 86400,            // cache preflight
};

app.use(cors(corsConfig));
// ✅ Express 5-safe: handle ALL preflights via regex (not "*")
app.options(/.*/, cors(corsConfig));

app.use(express.json());

/* ------------- Kafka ------------- */
const kafka = new Kafka({ clientId: "login-service", brokers: [process.env.KAFKA_BROKERS || "kafka:9092"] });
const producer = kafka.producer();

/* ------------- JWT ------------- */
const SECRET_KEY = "supersecretkey";

/* ------------- In-memory users ------------- */
const users = [
  { id: 1, username: "nisal", password: "123456", role: "admin" },
  { id: 2, username: "alice", password: "password", role: "seller" },
  { id: 3, username: "hiruna", password: "hii@1234", role: "admin" },
  { id: 4, username: "user1", password: "hii@user1", role: "user" },
];

/* ------------- Health ------------- */
app.get("/", (_req, res) => res.json({ ok: true }));

/* ------------- SIGNUP ------------- */
app.post("/signup", async (req, res) => {
  const { username, password, role } = req.body;

  if (users.find((u) => u.username === username)) {
    return res.status(400).json({ message: "User already exists" });
  }

  const newUser = { id: users.length + 1, username, password, role: role || "user" };
  users.push(newUser);

  const token = jwt.sign(
      { id: newUser.id, username: newUser.username, role: newUser.role },
      SECRET_KEY,
      { expiresIn: "1h" }
  );

  try {
    await producer.send({
      topic: "user-signedup",
      messages: [{ value: JSON.stringify(newUser) }],
    });
    console.log(`📤 user-signedup event sent for user: ${username}`);
  } catch (err) {
    console.error("Kafka publish error (signup):", err);
  }

  res.json({
    message: "Signup successful",
    token,
    user: { id: newUser.id, username: newUser.username, role: newUser.role },
  });
});

/* ------------- LOGIN ------------- */
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = users.find(
      (u) => u.username === username && u.password === password
  );
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      SECRET_KEY,
      { expiresIn: "1h" }
  );

  try {
    await producer.send({
      topic: "login-successful",
      messages: [{ value: JSON.stringify({ userId: user.id, username: user.username }) }],
    });
    console.log(`📤 login-successful event sent for user: ${username}`);
  } catch (err) {
    console.error("Kafka publish error (login):", err);
  }

  res.json({
    token,
    user: { id: user.id, username: user.username, role: user.role },
  });
});

/* ------------- Start ------------- */
app.listen(7070, async () => {
  try {
    await producer.connect();
    console.log("✅ Auth service (login + signup) running on port 7000");
  } catch (err) {
    console.error("❌ Failed to connect Kafka producer at startup:", err);
  }
});