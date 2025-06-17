# 1. **Message-Based Delivery Microservices Application**

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

## Project Overview

This project is a delivery service microservices architecture implemented using the NestJS framework. It provides various functionalities including user management, product management, order processing, payment processing, and notification services. This application follows microservices patterns for scalability, maintainability, and fault isolation.

## Architecture

This application consists of the following microservices:

1. **Gateway Service**: Acts as an API gateway that handles all client requests and routes them to appropriate microservices. It processes JWT-based authentication and provides API endpoints.
2. **User Service**: Responsible for user management and authentication. Provides user registration, login, and profile management features. Uses PostgreSQL database.
3. **Product Service**: Handles product information management. Provides product listing and detailed information retrieval features. Uses PostgreSQL database.
4. **Order Service**: Handles order processing. Provides order creation, order status management, and delivery information management features. Uses MongoDB database.
5. **Payment-Command Service**: Handles payment processing. Provides payment processing and payment status management features. Uses PostgreSQL database along with MongoDB.
6. **Payment-Query Service**: Handles payment information retrieval. Provides payment history inquiry features. Configured to use MongoDB in development environment and PostgreSQL in production environment.
7. **Notification Service**: Handles notification processing. Processes notifications for events such as order status changes and payment completion. Uses MongoDB database.

### Inter-Service Communication

- **Synchronous Communication**: Direct communication between services is done using gRPC protocol. Each service communicates through interfaces defined in proto files.
- **Asynchronous Communication**: Event-based communication is done through Kafka. This maintains loose coupling between services.

### Data Storage

- **PostgreSQL**: Used by User, Product, and Payment-Command services for storing relational data.
- **MongoDB**: Used by Order, Notification, and Payment-Query services for storing document-based data. Payment-Command service also stores some data here.
- **Redis**: Used for caching and session management.

## Technology Stack

- **Backend Framework**: NestJS (Node.js based)
- **Language**: TypeScript
- **Package Manager**: pnpm v9.1.1
- **Databases**:
    - PostgreSQL v16: Relational data storage
    - MongoDB v8: Document-based data storage
- **Inter-Service Communication**:
    - gRPC: Synchronous inter-service communication
    - Kafka v3.8.0: Asynchronous event-based communication
- **Caching**: Redis
- **Containerization and Orchestration**:
    - Docker, Docker Compose: Local development and testing
    - Kubernetes: Production deployment
    - Helm: Kubernetes resource management
- **Authentication and Security**: JWT (JSON Web Tokens)
- **Testing**: Jest

## Prerequisites

- Node.js (v16 or higher)
- pnpm (v9.1.1 or higher)
- Docker and Docker Compose
- Git

## Installation

1. Clone the repository:

```bash
$ git clone <repository-url>
$ cd delivery
```

2. Install dependencies:

```bash
$ pnpm install
```

3. Set up environment variables for each service:
    - `envs/gateway/.env`: API gateway configuration (JWT secret, port, etc.)
    - `envs/user/.env`: User service configuration (database connection info, etc.)
    - `envs/product/.env`: Product service configuration (database connection info, etc.)
    - `envs/order/.env`: Order service configuration (database connection info, etc.)
    - `envs/payment-command/.env`: Payment command service configuration (database connection info, etc.)
    - `envs/payment-query/.env`: Payment query service configuration (database connection info, etc.)
    - `envs/notification/.env`: Notification service configuration (database connection info, etc.)

Each environment variable file should include the following information:
- Database connection information (host, port, username, password, database name)
- gRPC server configuration (host, port)
- Other service-specific configurations

## Running the Application

### Local Development Environment

```bash
# Development mode
$ pnpm run start

# Development mode (watch mode)
$ pnpm run start:dev

# Production mode
$ pnpm run start:prod
```

### Using Docker Compose

The project includes three Docker Compose configuration files:

1. **docker-compose.yml**: Basic configuration file for development environment that builds directly from source code.
2. **docker-compose.image-test.yml**: Configuration file for testing pre-built Docker images.
3. **docker-compose.prod.yml**: Simplified configuration file for production environment that uses external databases.

#### Development Environment

Run all services and databases at once:

```bash
$ docker-compose up
```

Run specific services only:

```bash
$ docker-compose up gateway user
```

Run in background:

```bash
$ docker-compose up -d
```

#### Image Testing

Test pre-built Docker images:

```bash
$ docker-compose -f docker-compose.image-test.yml up
```

#### Production Environment

Run in production environment:

```bash
$ docker-compose -f docker-compose.prod.yml up -d
```

### Service Access

- Gateway API: http://localhost:3000
- Each service communicates through internal gRPC ports.
- Database ports:
    - PostgreSQL (User): 6001
    - PostgreSQL (Product): 6002
    - MongoDB (Order): 6003
    - PostgreSQL (Payment-Command): 6005
    - MongoDB (Payment-Command): 6010
    - MongoDB (Payment-Query): 6011
    - MongoDB (Notification): 6006
- Kafka:
    - Internal communication port: 9092
    - External access port: 29092

## Testing

```bash
# Unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# Test coverage
$ pnpm run test:cov
```

## API Documentation

API documentation is provided as a Postman collection. You can import the `docs/NestJS Microservice.postman_environment.json` file into Postman for use.

Main API endpoints:
- Authentication: `/auth/register`, `/auth/login`
- Products: `/product`
- Orders: `/order`
- Payment Command: `/payment-command`
- Payment Query: `/payment-query`
- Notifications: `/notification`

## Project Structure

```
delivery-microservices-messaging/
├── .github/                # GitHub related configurations
├── .idea/                  # IDE settings (JetBrains)
├── apps/                   # Microservice applications
│   ├── gateway/            # API Gateway (Port: 3000)
│   │   ├── src/            # Source code
│   │   │   ├── auth/       # Authentication related code
│   │   │   ├── health/     # Health check related code
│   │   │   ├── order/      # Order related code
│   │   │   └── product/    # Product related code
│   │   ├── .env            # Development environment variables
│   │   ├── prod.env        # Production environment variables
│   │   └── Dockerfile      # Docker build configuration
│   ├── user/               # User service
│   │   ├── src/            # Source code
│   │   │   ├── auth/       # Authentication related code
│   │   │   └── user/       # User related code
│   │   ├── .env            # Development environment variables
│   │   ├── prod.env        # Production environment variables
│   │   └── Dockerfile      # Docker build configuration
│   ├── product/            # Product service
│   │   ├── src/            # Source code
│   │   │   └── product/    # Product related code
│   │   ├── .env            # Development environment variables
│   │   ├── prod.env        # Production environment variables
│   │   └── Dockerfile      # Docker build configuration
│   ├── order/              # Order service
│   │   ├── src/            # Source code
│   │   │   └── order/      # Order related code
│   │   ├── .env            # Development environment variables
│   │   ├── prod.env        # Production environment variables
│   │   └── Dockerfile      # Docker build configuration
│   ├── payment-command/    # Payment command service
│   │   ├── src/            # Source code
│   │   │   └── payment/    # Payment related code
│   │   ├── .env            # Development environment variables
│   │   ├── prod.env        # Production environment variables
│   │   └── Dockerfile      # Docker build configuration
│   ├── payment-query/      # Payment query service
│   │   ├── src/            # Source code
│   │   │   └── payment/    # Payment related code
│   │   ├── .env            # Development environment variables
│   │   ├── prod.env        # Production environment variables
│   │   └── Dockerfile      # Docker build configuration
│   └── notification/       # Notification service
│       ├── src/            # Source code
│       │   └── notification/ # Notification related code
│       ├── .env            # Development environment variables
│       ├── prod.env        # Production environment variables
│       └── Dockerfile      # Docker build configuration
├── envs/                   # Environment variable configuration files
│   ├── gateway/            # Gateway environment variables
│   ├── user/               # User service environment variables
│   ├── product/            # Product service environment variables
│   ├── order/              # Order service environment variables
│   ├── payment-command/    # Payment command service environment variables
│   ├── payment-query/      # Payment query service environment variables
│   └── notification/       # Notification service environment variables
├── docs/                   # Documentation
│   ├── auth-login-scripts.md # Authentication and login scripts documentation
│   ├── dockerhub_image_push.txt # Docker Hub image push guide
│   ├── NestJS Microservice.postman_environment.json # Postman environment configuration
│   └── post_order.md       # Order creation related documentation
├── k8s/                    # Kubernetes and Helm related configurations
│   ├── delivery/           # Delivery service Kubernetes configuration
│   ├── helm/               # Helm charts
│   ├── infra/              # Infrastructure related configuration
│   └── kubernetes/         # Basic Kubernetes configuration
├── libs/                   # Shared libraries
│   └── common/             # Common modules
│       ├── src/            # Source code
│       │   ├── const/      # Constants
│       │   ├── dto/        # Data Transfer Objects
│       │   ├── grpc/       # gRPC related code
│       │   └── interceptor/ # Interceptors
│       └── tsconfig.lib.json # TypeScript configuration
├── node_modules/           # Node modules (package dependencies)
├── postgres/               # PostgreSQL data directory
│   ├── user/               # User service data
│   ├── product/            # Product service data
│   └── payment_command/    # Payment command service data
├── mongo/                  # MongoDB data directory
│   ├── order/              # Order service data
│   ├── payment_command/    # Payment command service data
│   ├── payment_query/      # Payment query service data
│   └── notification/       # Notification service data
├── proto/                  # gRPC protocol definitions
│   ├── notification.proto  # Notification service protocol
│   ├── order.proto         # Order service protocol
│   ├── payment.proto       # Payment service protocol
│   ├── product.proto       # Product service protocol
│   └── user.proto          # User service protocol
├── .dockerignore           # Docker build exclusion file
├── .eslintrc.js            # ESLint configuration
├── .gitignore              # Git exclusion file
├── .prettierrc             # Prettier configuration
├── build-and-push-ps.ps1   # PowerShell script (Docker image build and push)
├── build-and-push.sh       # Bash script (Docker image build and push)
├── docker-compose.image-test.yml # Docker Compose image test configuration
├── docker-compose.prod.yml # Docker Compose production configuration
├── docker-compose.yml      # Docker Compose development configuration
├── nest-cli.json           # NestJS CLI configuration
├── package.json            # Project metadata and dependencies
├── pnpm-lock.yaml          # pnpm lock file
├── README.md               # Project documentation
├── run-docker-compose.ps1  # PowerShell script (Docker Compose execution)
├── tsconfig.build.json     # TypeScript build configuration
├── tsconfig.json           # TypeScript basic configuration
└── webpack.config.js       # Webpack configuration
```

## Messaging System (Kafka)

This project uses Kafka for asynchronous communication between services. Kafka is a distributed event streaming platform that provides high throughput, durability, and scalability.

### Kafka Configuration

In development and test environments, Kafka is automatically configured through Docker Compose:

- Kafka version: 3.8.0 (Bitnami image)
- Internal communication port: 9092
- External access port: 29092
- KRaft mode enabled (runs without ZooKeeper)

### Key Event Flows

1. Order Creation → Payment Processing → Notification Sending
2. Payment Completion → Order Status Update → Notification Sending
3. Order Status Change → Notification Sending

Each service produces and consumes relevant events to implement a loosely coupled microservices architecture.

## Kubernetes Deployment

The project includes configuration files for Kubernetes deployment. In the `k8s/kubernetes` directory, you can find examples of the following Kubernetes resources:

- Pods
- ReplicaSets
- Deployments
- Namespaces
- ConfigMaps and Secrets
- Liveness Probes and Readiness Probes
- Services (NodePort, ClusterIP)
- Persistent Volumes and Persistent Volume Claims

You can also find deployment examples using Helm charts in the `k8s/helm` directory. Actual deployment configurations can be found in the `k8s/delivery` directory, and infrastructure-related configurations are in the `k8s/infra` directory.

## Contributing

1. Fork this repository.
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to your forked repository: `git push origin feature/your-feature-name`
5. Create a Pull Request.

## License

This project follows the [MIT License](LICENSE).