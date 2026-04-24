# Microservices E-commerce Platform

A cloud-native microservices architecture built with Node.js, Next.js, MongoDB, and Kafka, deployed on Kubernetes. This project demonstrates modern distributed system patterns for an e-commerce application.

## 🏗️ Architecture Overview

This project implements an event-driven microservices architecture with the following components:

### Core Services
- **Login Service** - JWT-based authentication and authorization
- **Order Service** - Order management and processing 
- **Payment Service** - Payment processing and validation
- **Email Service** - Email notifications via Nodemailer
- **Analytics Service** - Data analytics and reporting dashboard

### Infrastructure
- **Apache Kafka** - Event streaming and message brokering
- **MongoDB** - Document database for data persistence
- **Kubernetes** - Container orchestration and deployment
- **Next.js Frontend** - Modern React-based user interface

### Event-Driven Communication
Services communicate asynchronously through Kafka topics, enabling:
- Loose coupling between services
- Fault tolerance and resilience
- Scalable message processing
- Event sourcing capabilities

## 📋 Prerequisites

- **Docker & Kubernetes**: Local cluster (Docker Desktop, minikube, or kind)
- **Node.js**: v16+ for local development
- **kubectl**: Kubernetes command-line tool
- **Git**: Version control

## 🚀 Quick Start

### 1. Clone the Repository
```bash path=null start=null
git clone <repository-url>
cd Microservices
```

### 2. Build Docker Images
```bash path=null start=null
# Build all service images
docker build -t micro/login-service:dev ./services/login-service
docker build -t micro/payment-service:dev ./services/payment-service
docker build -t micro/analytic-service:dev ./services/analytic-service
docker build -t micro/order-service:dev ./services/order-service
docker build -t micro/email-service:dev ./services/email-service
```

### 3. Deploy to Kubernetes
```bash path=null start=null
# Apply the Kubernetes configuration
kubectl apply -f k8s.yaml

# Verify deployments
kubectl get pods -n micro
kubectl get services -n micro
```

### 4. Access the Application
```bash path=null start=null
# Port forward to access services locally
kubectl port-forward -n micro svc/login-service 7070:7070
kubectl port-forward -n micro svc/payment-service 8000:8000
kubectl port-forward -n micro svc/analytic-service 8001:8001
```

### 5. API Gateway (Nginx)

A local Nginx API gateway is provided at `services/gateway`.

```bash path=null start=null
cd services/gateway
docker compose up -d
```

Gateway base URL:

```text
http://localhost:8088
```

Gateway routes:

- `GET /gateway/health` -> gateway health
- `GET|POST /api/auth/*` -> login-service (`localhost:7070`)
- `GET|POST /api/payments/*` -> payment-service (`localhost:8000`)
- `GET /api/analytics/*` -> analytic-service (`localhost:8001`)

Examples:

```bash path=null start=null
# health
curl http://localhost:8088/gateway/health

# auth login
curl -X POST http://localhost:8088/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"nisal","password":"123456"}'

# payment
curl -X POST http://localhost:8088/api/payments/payment-service \
  -H "Content-Type: application/json" \
  -d '{"username":"nisal","cart":[{"id":1,"name":"Item","price":10.5}]}'

# analytics summary
curl http://localhost:8088/api/analytics/dashboard/summary
```

## 🛠️ Development Setup

### Local Development

1. **Install Dependencies**
```bash path=null start=null
# For each service
cd services/login-service && npm install
cd services/payment-service && npm install
cd services/analytic-service && npm install
cd services/order-service && npm install
cd services/email-service && npm install

# For frontend clients
cd services/client && npm install
cd services/client2 && npm install
```

2. **Environment Variables**
Create `.env` files in each service directory:

```bash path=null start=null
# Example for login-service/.env
KAFKA_BROKERS=localhost:9092
JWT_SECRET=supersecretkey
PORT=7070
```

3. **Start Services**
```bash path=null start=null
# Start individual services
cd services/login-service && npm run dev
cd services/payment-service && npm start
cd services/analytic-service && npm run dev
```

## 📦 Service Details

### Login Service (Port 7070)
- **Technology**: Node.js, Express, JWT, bcryptjs
- **Purpose**: User authentication and authorization
- **Endpoints**: 
  - `POST /login` - User authentication
  - `POST /register` - User registration
  - Health check endpoint at `/`

### Payment Service (Port 8000)
- **Technology**: Node.js, Express, KafkaJS
- **Purpose**: Payment processing and validation
- **Communication**: Publishes payment events to Kafka

### Analytics Service (Port 8001)
- **Technology**: Node.js, Express, KafkaJS
- **Purpose**: Data analytics and dashboard
- **Endpoints**: 
  - `GET /dashboard/summary` - Analytics dashboard

### Order Service
- **Technology**: Node.js, KafkaJS, Mongoose
- **Purpose**: Order management and processing
- **Database**: MongoDB for order persistence

### Email Service
- **Technology**: Node.js, KafkaJS, Nodemailer
- **Purpose**: Email notifications
- **Integration**: Gmail SMTP for email delivery

### Frontend Services
- **Client**: Next.js with React Query, Tailwind CSS
- **Client2**: Enhanced Next.js with TypeScript, React Icons, Charts

## 🔧 Kubernetes Configuration

The project uses a comprehensive Kubernetes setup with:

### Namespace
- **micro**: Main application namespace

### ConfigMaps & Secrets
- **micro-config**: Kafka brokers and JWT configuration
- **micro-secrets**: Email credentials and MongoDB connection string

### Services & Deployments
All services are deployed with:
- Health checks and readiness probes
- Resource management
- Service discovery through ClusterIP services
- Environment variable injection from ConfigMaps/Secrets

## 📊 Monitoring & Health Checks

### Service Health Endpoints
- **Login Service**: `GET /` (HTTP)
- **Payment Service**: TCP socket check on port 8000
- **Analytics Service**: `GET /dashboard/summary`

### Kubernetes Health Checks
```bash path=null start=null
# Check pod status
kubectl get pods -n micro

# Check service endpoints
kubectl get endpoints -n micro

# View logs
kubectl logs -n micro deployment/login-service
kubectl logs -n micro deployment/payment-service
```

## 🐛 Troubleshooting

### Common Issues

1. **Pods not starting**: Check image availability and resource constraints
```bash path=null start=null
kubectl describe pod <pod-name> -n micro
```

2. **Service communication issues**: Verify service discovery
```bash path=null start=null
kubectl get svc -n micro
kubectl describe svc <service-name> -n micro
```

3. **Kafka connectivity**: Ensure Kafka is running and accessible
```bash path=null start=null
kubectl logs -n micro -l app=kafka
```

### Debug Commands
```bash path=null start=null
# View all resources in micro namespace
kubectl get all -n micro

# Check events for troubleshooting
kubectl get events -n micro --sort-by='.lastTimestamp'

# Execute into a pod for debugging
kubectl exec -it -n micro <pod-name> -- sh
```

## 🔄 CI/CD & Deployment

### Building Images
```bash path=null start=null
# Build script for all services
#!/bin/bash
services=("login-service" "payment-service" "analytic-service" "order-service" "email-service")

for service in "${services[@]}"; do
  echo "Building $service..."
  docker build -t micro/$service:dev ./services/$service
done
```

### Deployment Updates
```bash path=null start=null
# Update deployment with new image
kubectl set image deployment/login-service -n micro login-service=micro/login-service:new-tag

# Rolling restart
kubectl rollout restart deployment/login-service -n micro
```

## 📈 Scaling

### Horizontal Pod Autoscaling
```yaml path=null start=null
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: login-service-hpa
  namespace: micro
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: login-service
  minReplicas: 1
  maxReplicas: 5
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

### Manual Scaling
```bash path=null start=null
# Scale deployment replicas
kubectl scale deployment login-service --replicas=3 -n micro
```

## 🔐 Security Considerations

- **JWT tokens** for stateless authentication
- **Kubernetes secrets** for sensitive configuration
- **CORS configuration** for frontend security
- **Network policies** can be implemented for service isolation
- **Resource limits** to prevent resource exhaustion

## 📚 Technology Stack

| Component | Technology | Version |
|-----------|------------|---------|
| Runtime | Node.js | 16+ |
| Frontend | Next.js | 15.x |
| Database | MongoDB | Atlas |
| Message Broker | Apache Kafka | 2.x |
| Orchestration | Kubernetes | 1.24+ |
| Authentication | JWT | - |
| UI Framework | React | 19.x |
| Styling | Tailwind CSS | 4.x |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License - see the individual package.json files for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review Kubernetes logs for service-specific issues

---

**Note**: This is a university project for Cloud Computing coursework, demonstrating microservices architecture and Kubernetes deployment patterns.
