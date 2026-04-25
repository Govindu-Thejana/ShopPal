# ShopMate AWS Deployment Guide

This deployment design matches a typical assignment requirement that asks for `EC2`, `Auto Scaling Group`, `Application Load Balancer`, `Target Group`, and `GitHub Actions`.

## Architecture

- `ALB` is internet-facing and listens on `HTTP 80` or `HTTPS 443`.
- The `Target Group` forwards traffic to EC2 instances on port `80`.
- Each EC2 instance belongs to an `Auto Scaling Group`.
- Each instance runs the full ShopMate stack with Docker Compose.
- The `edge-proxy` container receives ALB traffic and routes:
  - `/` to `client2`
  - `/legacy/` to `client`
  - `/api/*` to the internal API gateway
- GitHub Actions triggers deployment by using `AWS Systems Manager` to run the deploy script on all ASG instances.

## Files In This Folder

- `docker-compose.prod.yml`: production stack for EC2
- `nginx.edge.conf`: Nginx reverse proxy exposed on port `80`
- `ec2-user-data.sh`: bootstrap script used in the Launch Template
- `write-env.sh`: creates `deploy/aws/env/app.env` from SSM Parameter Store
- `deploy.sh`: pulls the latest code and restarts the stack
- `env/app.env.example`: example environment variables

## 1. Prepare AWS Services

### 1.1 Create a Key Pair

Create an EC2 key pair only if your assignment requires SSH access. If SSH is not required, Systems Manager is enough.

### 1.2 Create IAM Role For EC2

Attach these permissions:

- `AmazonSSMManagedInstanceCore`
- A custom policy that allows `ssm:GetParameter` on:
  - `/shopmate/prod/MONGO_URI`
  - `/shopmate/prod/JWT_SECRET`
  - `/shopmate/prod/ALLOWED_ORIGINS`
  - `/shopmate/prod/EMAIL_USER`
  - `/shopmate/prod/EMAIL_PASS`
  - `/shopmate/prod/EMAIL_TO`

### 1.3 Store Secrets In AWS Systems Manager Parameter Store

Create these secure parameters:

- `/shopmate/prod/MONGO_URI`
- `/shopmate/prod/JWT_SECRET`
- `/shopmate/prod/ALLOWED_ORIGINS`
- `/shopmate/prod/EMAIL_USER`
- `/shopmate/prod/EMAIL_PASS`
- `/shopmate/prod/EMAIL_TO`

Example `ALLOWED_ORIGINS` value:

```text
http://your-alb-dns-name.us-east-1.elb.amazonaws.com
```

## 2. Create Networking

Use a VPC with at least:

- `2 public subnets` for the ALB
- `2 private or public subnets` for EC2 instances

For a student assignment, public EC2 subnets are acceptable if the lecturer has not required private subnets.

### Security Groups

Create two security groups:

`alb-sg`
- Inbound `80` from `0.0.0.0/0`
- Inbound `443` from `0.0.0.0/0` if using HTTPS
- Outbound all

`ec2-sg`
- Inbound `80` from `alb-sg`
- Inbound `22` from your IP only if SSH is required
- Outbound all

## 3. Create Launch Template

Use:

- AMI: `Amazon Linux 2023`
- Instance type: `t3.medium` or higher
- IAM role: the role created above
- Security group: `ec2-sg`
- User data: paste `deploy/aws/ec2-user-data.sh`

Before pasting the user data, replace:

- `YOUR-USERNAME`
- `YOUR-REPOSITORY`

If the repo is private, use one of these approaches:

- make the repo temporarily public for the demo
- clone using a GitHub deploy key
- replace the clone step with an S3 artifact download flow

## 4. Create Target Group

Create an `Instance` target group with:

- Protocol: `HTTP`
- Port: `80`
- Health check path: `/health`
- Health check protocol: `HTTP`

Recommended health settings:

- Healthy threshold: `2`
- Unhealthy threshold: `3`
- Timeout: `5`
- Interval: `30`

## 5. Create Application Load Balancer

Create an internet-facing ALB:

- Listener `HTTP :80`
- Forward to the ShopMate target group
- Select at least two public subnets
- Attach `alb-sg`

If your assignment expects HTTPS:

- Request an ACM certificate
- Add listener `HTTPS :443`
- Forward to the same target group

## 6. Create Auto Scaling Group

Create the ASG using the Launch Template:

- Desired capacity: `2`
- Minimum: `2`
- Maximum: `4`
- Attach the existing target group
- Enable ELB health checks

Recommended scaling policy:

- Target tracking on average CPU at `60%`

## 7. Configure GitHub Actions

Create this GitHub repository secret:

- `AWS_GITHUB_ACTIONS_ROLE_ARN`

That role should trust GitHub OIDC and allow:

- `ssm:SendCommand`
- `ssm:ListCommandInvocations`
- `ec2:DescribeInstances`

The workflow is already added at `.github/workflows/aws-deploy.yml`.

How it works:

- on push to `main`, GitHub Actions authenticates to AWS
- it sends an SSM command to all EC2 instances tagged with `App=shopmate` and `Environment=prod`
- every instance runs `deploy/aws/deploy.sh`
- the script pulls the latest code and rebuilds the Docker services

## 8. Tag EC2 Instances

Make sure the ASG or Launch Template applies these instance tags:

- `App = shopmate`
- `Environment = prod`

Without these tags, the GitHub Actions deployment command will not find your instances.

## 9. Verify Deployment

Check these URLs:

- `http://<ALB-DNS>/health`
- `http://<ALB-DNS>/`
- `http://<ALB-DNS>/api/auth/health`
- `http://<ALB-DNS>/api/analytics/dashboard/summary`

Also verify:

- EC2 instances are healthy in the target group
- Docker containers are running on each instance
- SSM command history shows successful deployments

## 10. Useful Commands On EC2

```bash
cd /opt/shopmate
docker compose -f deploy/aws/docker-compose.prod.yml --env-file deploy/aws/env/app.env ps
docker compose -f deploy/aws/docker-compose.prod.yml --env-file deploy/aws/env/app.env logs -f edge-proxy
docker compose -f deploy/aws/docker-compose.prod.yml --env-file deploy/aws/env/app.env logs -f login-service
```

## Important Notes

- This setup uses one Kafka container per EC2 instance. That is acceptable for an assignment demo, but not ideal for production.
- MongoDB is expected to stay on MongoDB Atlas.
- The `order-service` was updated to use `MONGO_URI` from environment variables.
- The `login-service` was updated to use `JWT_SECRET`, `ALLOWED_ORIGINS`, and `PORT` from environment variables.
