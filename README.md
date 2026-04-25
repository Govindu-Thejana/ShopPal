# ShopPal Microservices (Local Development Guide)

This repository contains a microservices-based e-commerce demo with:

- Next.js frontend (`services/client2`)
- Login service
- Payment service
- Order service
- Email service
- Analytics service
- Kafka + Kafka UI

This README is focused on running everything locally on Windows (PowerShell).

## Project Structure

- `services/client2` - main frontend (Next.js)
- `services/login-service` - auth (`/login`, `/signup`)
- `services/payment-service` - payment endpoint (`/payment-service`)
- `services/order-service` - consumes `payment-successful`, saves order, emits `order-successful`
- `services/email-service` - consumes `order-successful`, sends email, emits `email-successful`
- `services/analytic-service` - consumes events and exposes dashboard APIs
- `services/kafka` - Docker Compose for Kafka and Kafka UI

## Prerequisites

- Node.js 18+
- npm 9+
- Docker Desktop
- Internet access (MongoDB Atlas + SMTP for email service)

## 1) Start Kafka

Open PowerShell terminal 1:

```powershell
cd C:\Users\yasiru\Desktop\ShopPal\services\kafka
docker compose up -d
```

Check containers:

```powershell
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
```

Expected important ports:

- Kafka external broker: `localhost:9094`
- Kafka UI: `http://localhost:9090`

## 2) Create Kafka Topics (one-time)

Open PowerShell terminal 2:

```powershell
docker exec kafka /opt/kafka/bin/kafka-topics.sh --bootstrap-server localhost:9092 --create --if-not-exists --topic payment-successful --partitions 1 --replication-factor 1
docker exec kafka /opt/kafka/bin/kafka-topics.sh --bootstrap-server localhost:9092 --create --if-not-exists --topic order-successful --partitions 1 --replication-factor 1
docker exec kafka /opt/kafka/bin/kafka-topics.sh --bootstrap-server localhost:9092 --create --if-not-exists --topic email-successful --partitions 1 --replication-factor 1
```

List topics:

```powershell
docker exec kafka /opt/kafka/bin/kafka-topics.sh --bootstrap-server localhost:9092 --list
```

## 3) Configure Email Service Env

Create/update `services/email-service/.env`:

```env
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
KAFKA_BROKERS=localhost:9094
```

Notes:

- `EMAIL_PASS` must be a Gmail App Password, not your normal password.
- If email credentials are invalid, only the email step will fail (other services can still run).

## 4) Install Dependencies

Run once per service:

```powershell
cd C:\Users\yasiru\Desktop\ShopPal\services\login-service
npm install

cd ..\payment-service
npm install

cd ..\analytic-service
npm install

cd ..\order-service
npm install

cd ..\email-service
npm install

cd ..\client2
npm install
```

## 5) Run All Services

Use separate terminals for each process.

### Terminal 3 - login-service

```powershell
cd C:\Users\yasiru\Desktop\ShopPal\services\login-service
$env:KAFKA_BROKERS="localhost:9094"
npm run dev
```

### Terminal 4 - payment-service

```powershell
cd C:\Users\yasiru\Desktop\ShopPal\services\payment-service
$env:KAFKA_BROKERS="localhost:9094"
node index.js
```

### Terminal 5 - analytic-service

```powershell
cd C:\Users\yasiru\Desktop\ShopPal\services\analytic-service
$env:KAFKA_BROKERS="localhost:9094"
node index.js
```

### Terminal 6 - order-service

```powershell
cd C:\Users\yasiru\Desktop\ShopPal\services\order-service
$env:KAFKA_BROKERS="localhost:9094"
node index.js
```

### Terminal 7 - email-service

```powershell
cd C:\Users\yasiru\Desktop\ShopPal\services\email-service
$env:KAFKA_BROKERS="localhost:9094"
node index.js
```

### Terminal 8 - frontend (client2)

```powershell
cd C:\Users\yasiru\Desktop\ShopPal\services\client2
npm run dev
```

## URLs

- Frontend: `http://localhost:3000`
- Login service health: `http://localhost:7070/`
- Analytics summary: `http://localhost:8001/dashboard/summary`
- Kafka UI: `http://localhost:9090`

## Existing Login Credentials

These are hardcoded in `services/login-service/index.js`:

- `nisal` / `123456`
- `alice` / `password`
- `hiruna` / `hii@1234`
- `user1` / `hii@user1`

## End-to-End Test (Payment -> Order -> Email -> Analytics)

Run this in a new PowerShell terminal:

```powershell
$body = @{ username = "user1"; cart = @(@{ name = "Item"; price = 10 }) } | ConvertTo-Json -Depth 5
Invoke-RestMethod -Uri "http://localhost:8000/payment-service" -Method POST -ContentType "application/json" -Body $body
Invoke-RestMethod -Uri "http://localhost:8001/dashboard/summary" -Method GET
```

If everything is connected:

- Payment count increases
- Order count increases
- Email count increases (if SMTP credentials work)

## API Quick Reference

### login-service

- `GET /` -> health
- `POST /login`
- `POST /signup`

### payment-service

- `POST /payment-service`

### analytic-service

- `GET /dashboard/summary`
- `GET /dashboard/recent-payments`
- `GET /dashboard/recent-orders`
- `GET /dashboard/recent-emails`

## Troubleshooting

### 1) Kafka connection errors (`ENOTFOUND kafka` or `ECONNREFUSED`)

Cause: service trying `kafka:9092` in local host mode.

Fix:

- Ensure each Node service has `KAFKA_BROKERS=localhost:9094` before start.
- Ensure Docker Kafka container is up.

### 2) Analytics shows old/high counts after restart

Cause: consumers use `fromBeginning: true`, so messages can be replayed.

Fix options:

- Use fresh Kafka topics for clean tests, or
- Change consumer settings/group IDs for test isolation.

### 3) Email not increasing

Check:

- `services/email-service/.env` values
- Gmail app password validity
- email-service terminal logs

### 4) Next.js hydration error with nested `<html>`

Only root layout should render `<html>` and `<body>`.
Route-group layouts must return wrappers/fragments only.

## Stop Everything

Stop Node services: `Ctrl + C` in each terminal.

Stop Kafka:

```powershell
cd C:\Users\yasiru\Desktop\ShopPal\services\kafka
docker compose down
```
