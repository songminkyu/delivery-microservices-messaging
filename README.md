# Delivery Microservices Application

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

## 프로젝트 개요

이 프로젝트는 NestJS 프레임워크를 사용하여 구현된 배달 서비스 마이크로서비스 아키텍처입니다. 사용자 관리, 상품 관리, 주문 처리, 결제 처리, 알림 서비스 등 다양한 기능을 제공합니다. 이 애플리케이션은 확장성, 유지보수성, 그리고 장애 격리를 위해 마이크로서비스 패턴을 따르고 있습니다.

## 아키텍처

이 애플리케이션은 다음과 같은 마이크로서비스로 구성되어 있습니다:

1. **Gateway 서비스**: API 게이트웨이로 모든 클라이언트 요청을 처리하고 적절한 마이크로서비스로 라우팅합니다. JWT 기반 인증을 처리하고 API 엔드포인트를 제공합니다.
2. **User 서비스**: 사용자 관리 및 인증을 담당합니다. 사용자 등록, 로그인, 프로필 관리 기능을 제공합니다. PostgreSQL 데이터베이스를 사용합니다.
3. **Product 서비스**: 상품 정보 관리를 담당합니다. 상품 목록 조회, 상세 정보 조회 기능을 제공합니다. PostgreSQL 데이터베이스를 사용합니다.
4. **Order 서비스**: 주문 처리를 담당합니다. 주문 생성, 주문 상태 관리, 배송 정보 관리 기능을 제공합니다. MongoDB 데이터베이스를 사용합니다.
5. **Payment 서비스**: 결제 처리를 담당합니다. 결제 처리, 결제 상태 관리 기능을 제공합니다. PostgreSQL 데이터베이스를 사용합니다.
6. **Notification 서비스**: 알림 처리를 담당합니다. 주문 상태 변경, 결제 완료 등의 이벤트에 대한 알림을 처리합니다. MongoDB 데이터베이스를 사용합니다.

### 서비스 간 통신

- **동기식 통신**: 서비스 간 직접 통신은 gRPC 프로토콜을 사용하여 이루어집니다. 각 서비스는 proto 파일에 정의된 인터페이스를 통해 통신합니다.
- **비동기식 통신**: 이벤트 기반 통신은 RabbitMQ를 통한 AMQP 프로토콜을 사용합니다. 이를 통해 서비스 간 느슨한 결합을 유지합니다.

### 데이터 저장소

- **PostgreSQL**: User, Product, Payment 서비스에서 사용되며, 관계형 데이터를 저장합니다.
- **MongoDB**: Order, Notification 서비스에서 사용되며, 문서 기반 데이터를 저장합니다.
- **Redis**: 캐싱 및 세션 관리에 사용됩니다.

## 기술 스택

- **백엔드 프레임워크**: NestJS (Node.js 기반)
- **언어**: TypeScript
- **패키지 매니저**: pnpm v9.1.1
- **데이터베이스**:
  - PostgreSQL v16: 관계형 데이터 저장
  - MongoDB v8: 문서 기반 데이터 저장
- **서비스 간 통신**:
  - gRPC: 동기식 서비스 간 통신
  - RabbitMQ (AMQP): 비동기식 이벤트 기반 통신
- **캐싱**: Redis
- **컨테이너화 및 오케스트레이션**:
  - Docker, Docker Compose: 로컬 개발 및 테스트
  - Kubernetes: 프로덕션 배포
  - Helm: Kubernetes 리소스 관리
- **인증 및 보안**: JWT (JSON Web Tokens)
- **테스트**: Jest

## 사전 요구사항

- Node.js (v16 이상)
- pnpm (v9.1.1 이상)
- Docker 및 Docker Compose
- Git

## 설치 방법

1. 저장소 클론:

```bash
$ git clone <repository-url>
$ cd delivery
```

2. 의존성 설치:

```bash
$ pnpm install
```

3. 각 서비스의 환경 변수 설정:
   - `apps/gateway/.env`: API 게이트웨이 설정 (JWT 시크릿, 포트 등)
   - `apps/user/.env`: 사용자 서비스 설정 (데이터베이스 연결 정보 등)
   - `apps/product/.env`: 상품 서비스 설정 (데이터베이스 연결 정보 등)
   - `apps/order/.env`: 주문 서비스 설정 (데이터베이스 연결 정보 등)
   - `apps/payment/.env`: 결제 서비스 설정 (데이터베이스 연결 정보 등)
   - `apps/notification/.env`: 알림 서비스 설정 (데이터베이스 연결 정보 등)

각 환경 변수 파일에는 다음과 같은 정보가 포함되어야 합니다:
- 데이터베이스 연결 정보 (호스트, 포트, 사용자 이름, 비밀번호, 데이터베이스 이름)
- gRPC 서버 설정 (호스트, 포트)
- 기타 서비스별 설정

## 실행 방법

### 로컬 개발 환경

```bash
# 개발 모드
$ pnpm run start

# 개발 모드 (변경 감지)
$ pnpm run start:dev

# 프로덕션 모드
$ pnpm run start:prod
```

### Docker Compose 사용

모든 서비스와 데이터베이스를 한 번에 실행:

```bash
$ docker-compose up
```

특정 서비스만 실행:

```bash
$ docker-compose up gateway user
```

백그라운드에서 실행:

```bash
$ docker-compose up -d
```

### 서비스 접근

- Gateway API: http://localhost:3000
- 각 서비스는 내부 gRPC 포트를 통해 통신합니다.
- 데이터베이스 포트:
  - PostgreSQL (User): 6001
  - PostgreSQL (Product): 6002
  - MongoDB (Order): 6003
  - PostgreSQL (Payment): 6005
  - MongoDB (Notification): 6006

## 테스트

```bash
# 단위 테스트
$ pnpm run test

# e2e 테스트
$ pnpm run test:e2e

# 테스트 커버리지
$ pnpm run test:cov
```

## API 문서

API 문서는 Postman 컬렉션으로 제공됩니다. `docs/NestJS Microservice.postman_environment.json` 파일을 Postman으로 가져와서 사용할 수 있습니다.

주요 API 엔드포인트:
- 인증: `/auth/register`, `/auth/login`
- 상품: `/product`
- 주문: `/order`
- 결제: `/payment`

## 프로젝트 구조

```
delivery/
├── .github/                # GitHub 관련 설정
├── apps/                   # 마이크로서비스 애플리케이션
│   ├── gateway/            # API 게이트웨이 (포트: 3000)
│   │   ├── src/            # 소스 코드
│   │   │   ├── auth/       # 인증 관련 코드
│   │   │   ├── order/      # 주문 관련 코드
│   │   │   └── product/    # 상품 관련 코드
│   │   └── Dockerfile      # Docker 빌드 설정
│   ├── user/               # 사용자 서비스
│   │   ├── src/            # 소스 코드
│   │   │   ├── auth/       # 인증 관련 코드
│   │   │   └── user/       # 사용자 관련 코드
│   │   └── Dockerfile      # Docker 빌드 설정
│   ├── product/            # 상품 서비스
│   │   ├── src/            # 소스 코드
│   │   │   └── product/    # 상품 관련 코드
│   │   └── Dockerfile      # Docker 빌드 설정
│   ├── order/              # 주문 서비스
│   │   ├── src/            # 소스 코드
│   │   │   └── order/      # 주문 관련 코드
│   │   └── Dockerfile      # Docker 빌드 설정
│   ├── payment/            # 결제 서비스
│   │   ├── src/            # 소스 코드
│   │   │   └── payment/    # 결제 관련 코드
│   │   └── Dockerfile      # Docker 빌드 설정
│   └── notification/       # 알림 서비스
│       ├── src/            # 소스 코드
│       │   └── notification/ # 알림 관련 코드
│       └── Dockerfile      # Docker 빌드 설정
├── docs/                   # 문서
│   ├── auth-login-scripts.md # 인증 및 로그인 스크립트 문서
│   ├── dockerhub_image_push.txt # Docker Hub 이미지 푸시 가이드
│   ├── NestJS Microservice.postman_environment.json # Postman 환경 설정
│   └── post_order.md       # 주문 생성 관련 문서
├── k8s/                    # 쿠버네티스 및 Helm 관련 설정
│   ├── delivery/           # 배달 서비스 쿠버네티스 설정
│   ├── helm/               # Helm 차트
│   ├── infra/              # 인프라 관련 설정
│   └── kubernetes/         # 쿠버네티스 기본 설정
├── libs/                   # 공유 라이브러리
│   └── common/             # 공통 모듈
│       ├── src/            # 소스 코드
│       │   ├── const/      # 상수
│       │   ├── dto/        # 데이터 전송 객체
│       │   ├── grpc/       # gRPC 관련 코드
│       │   └── interceptor/ # 인터셉터
│       └── tsconfig.lib.json # TypeScript 설정
├── proto/                  # gRPC 프로토콜 정의
│   ├── notification.proto  # 알림 서비스 프로토콜
│   ├── order.proto         # 주문 서비스 프로토콜
│   ├── payment.proto       # 결제 서비스 프로토콜
│   ├── product.proto       # 상품 서비스 프로토콜
│   └── user.proto          # 사용자 서비스 프로토콜
├── build-and-push-ps.ps1   # PowerShell 스크립트 (Docker 이미지 빌드 및 푸시)
├── build-and-push.sh       # Bash 스크립트 (Docker 이미지 빌드 및 푸시)
├── docker-compose.image-test.yml # Docker Compose 이미지 테스트 설정
├── docker-compose.prod.yml # Docker Compose 프로덕션 설정
├── docker-compose.yml      # Docker Compose 개발 설정
├── nest-cli.json           # NestJS CLI 설정
├── package.json            # 프로젝트 메타데이터 및 의존성
├── pnpm-lock.yaml          # pnpm 락 파일
├── run-docker-compose.ps1  # PowerShell 스크립트 (Docker Compose 실행)
├── tsconfig.build.json     # TypeScript 빌드 설정
├── tsconfig.json           # TypeScript 기본 설정
└── webpack.config.js       # Webpack 설정
```

## 쿠버네티스 배포

프로젝트는 쿠버네티스 배포를 위한 설정 파일을 포함하고 있습니다. `k8s/kubernetes` 디렉토리에서 다음과 같은 쿠버네티스 리소스 예제를 확인할 수 있습니다:

- 파드 (Pod)
- 레플리카셋 (ReplicaSet)
- 디플로이먼트 (Deployment)
- 네임스페이스 (Namespace)
- 컨피그맵 (ConfigMap)과 시크릿 (Secret)
- 라이브니스 프로브 (Liveness Probe)와 레디니스 프로브 (Readiness Probe)
- 서비스 (NodePort, ClusterIP)
- 퍼시스턴트 볼륨 (PersistentVolume)과 퍼시스턴트 볼륨 클레임 (PersistentVolumeClaim)

또한 `k8s/helm` 디렉토리에서 Helm 차트를 통한 배포 예제를 확인할 수 있습니다. 실제 배포 설정은 `k8s/delivery` 디렉토리에서 확인할 수 있으며, 인프라 관련 설정은 `k8s/infra` 디렉토리에 있습니다.

## 기여 방법

1. 이 저장소를 포크합니다.
2. 새로운 브랜치를 생성합니다: `git checkout -b feature/your-feature-name`
3. 변경 사항을 커밋합니다: `git commit -m 'Add some feature'`
4. 포크한 저장소에 푸시합니다: `git push origin feature/your-feature-name`
5. Pull Request를 생성합니다.

## 라이센스

이 프로젝트는 [MIT 라이센스](LICENSE)를 따릅니다.
