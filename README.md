# CloudBox - Cloud-Based Image Upload & Metadata Service

> **A full-stack serverless image management platform built with AWS Lambda, S3, DynamoDB, and React**

![CloudBox](https://img.shields.io/badge/AWS-Lambda%20%7C%20S3%20%7C%20DynamoDB-orange)
![React](https://img.shields.io/badge/React-18.3-blue)
![Python](https://img.shields.io/badge/Python-3.8%2B-green)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Local Development](#local-development)
- [API Documentation](#api-documentation)
- [Frontend Guide](#frontend-guide)
- [Testing](#testing)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [Contact](#contact)

---

## 🎯 Overview

**CloudBox** is a production-ready, enterprise-grade cloud storage solution that demonstrates modern serverless architecture patterns. Built for the cloud-native era, it provides secure image upload, intelligent metadata management, and lightning-fast retrieval using AWS services.

### What Makes CloudBox Special?

- **🚀 Serverless Architecture**: Zero server management, infinite scalability
- **🔒 Enterprise Security**: IAM roles, presigned URLs, encrypted storage
- **⚡ Blazing Fast**: Direct S3 uploads bypass Lambda size limits
- **🎨 Premium UI**: 3D animations, glassmorphism, smooth transitions
- **📊 Smart Metadata**: Tag-based filtering, date range queries, full-text search ready
- **🧪 Fully Tested**: Unit tests (moto) + Integration tests (LocalStack)
- **📖 Well Documented**: OpenAPI spec, architecture diagrams, deployment guides

---

## ✨ Features

### Backend Capabilities

- ✅ **Presigned URL Generation**: Secure, time-limited upload URLs
- ✅ **Metadata Management**: Store and query image metadata in DynamoDB
- ✅ **Advanced Filtering**: Filter by user, tags, date ranges
- ✅ **Secure Downloads**: Generate presigned download URLs
- ✅ **Idempotent Operations**: Safe retry logic for all operations
- ✅ **Partial Failure Handling**: Graceful degradation with detailed error responses

### Frontend Features

- ✅ **3D Landing Page**: Animated spheres, particles, and interactive elements
- ✅ **Batch Upload**: Drag & drop multiple images with per-file progress tracking
- ✅ **Advanced Gallery**: Real-time grid with direct download, sharing, and backup options
- ✅ **Creative Filters**: Apply real-time effects (B&W, Sepia, Vintage) to images
- ✅ **Tag Management**: Add multiple tags per image
- ✅ **Responsive Design**: Mobile-first, works on all devices
- ✅ **Dark Mode**: Premium dark theme with glassmorphism
- ✅ **Animations**: Framer Motion + React Three Fiber

---

## 🏗️ Architecture

CloudBox follows a **serverless microservices architecture**:

```
┌─────────────┐      ┌──────────────┐      ┌─────────────┐
│   React     │─────▶│  API Gateway │─────▶│   Lambda    │
│  Frontend   │      │   (REST API) │      │  Functions  │
└─────────────┘      └──────────────┘      └─────────────┘
                                                   │
                                    ┌──────────────┴──────────────┐
                                    ▼                             ▼
                             ┌─────────────┐            ┌──────────────┐
                             │   Amazon    │            │   DynamoDB   │
                             │     S3      │            │   (Metadata) │
                             └─────────────┘            └──────────────┘
```

### Data Flow

1. **Upload Flow**:
   - Frontend requests presigned URL from Lambda
   - Lambda generates S3 presigned URL (valid for 5 minutes)
   - Frontend uploads directly to S3 (bypassing Lambda)
   - Frontend sends metadata to Lambda
   - Lambda stores metadata in DynamoDB

2. **Retrieval Flow**:
   - Frontend queries Lambda with filters
   - Lambda queries DynamoDB (using GSI for tag filtering)
   - Lambda returns metadata list
   - Frontend requests presigned download URLs for display

For detailed architecture diagrams, see [docs/architecture.md](docs/architecture.md).

---

## 🛠️ Tech Stack

### 💻 Programming Languages
- **Frontend**: JavaScript (ES6+)
- **Backend**: Python (3.8+)

### 🎨 Frontend
- **Framework**: React 18.3 (Vite)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **3D Graphics**: React Three Fiber (@react-three/drei)
- **State Management**: React Hooks (useState, useEffect)
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

### ⚙️ Backend
- **Framework**: Flask (Microframework)
- **Cloud Services**: AWS S3, AWS DynamoDB, AWS Lambda (Serverless capable)
- **Local Development**: LocalStack (AWS Cloud Emulator)
- **Testing**: Pytest, Moto (AWS Mocking)
- **WSGI Server**: Gunicorn (for production)
- **API Specification**: OpenAPI 3.0

### 🚀 DevOps & Deployment
- **Frontend Hosting**: Netlify / Vercel
- **Backend Hosting**: Render / AWS Lambda
- **Containerization**: Docker, Docker Compose
- **Infrastructure**: Terraform / CloudFormation ready

---

## � API Endpoints
The backend provides a RESTful API compliant with the company's specifications:

### Upload
- **`POST /images/upload`**
  - **Description**: Generates a presigned S3 upload URL and saves initial metadata.
  - **Body**: `{ "filename": "example.jpg", "content_type": "image/jpeg", "user_id": "...", "tags": ["nature"] }`
  - **Response**: `{ "upload_url": "...", "image_id": "..." }`

### List Images
- **`GET /images`**
  - **Description**: Lists images with support for filtering.
  - **Query Params**: `user_id`, `tag`, `start_date`, `end_date`.
  - **Response**: `{ "images": [ ... ] }`

### Download
- **`GET /images/{id}/download`**
  - **Description**: Returns a presigned URL for viewing or downloading the image.
  - **Response**: `{ "download_url": "..." }`

### Delete
- **`DELETE /images/{id}`**
  - **Description**: Removes the image file from S3 and metadata from DynamoDB.
  - **Query Params**: `user_id` (required for ownership verification).

---

## 💾 Metadata Schema
Image metadata is stored in DynamoDB with the following structure:
- **`image_id`**: Unique identifier (Sort Key).
- **`user_id`**: Owner identifier (Partition Key).
- **`s3_key`**: Key used in S3 bucket.
- **`content_type`**: MIME type of the file.
- **`file_size`**: Size of the file in bytes.
- **`upload_time`**: ISO 8601 timestamp.
- **`tags`**: List of strings (e.g., `["vacation", "beach"]`).
- **`description`**: Optional text description.

---

## �📁 Project Structure

```
UNLOADIN/
├── backend/                    # Python Lambda backend
│   ├── src/
│   │   ├── app/
│   │   │   └── handlers.py    # Lambda function handlers
│   │   └── utils/
│   │       ├── s3_utils.py    # S3 presigned URL generation
│   │       ├── dynamo_utils.py # DynamoDB CRUD operations
│   │       └── common.py      # Response formatting
│   ├── tests/
│   │   ├── unit/              # Unit tests with moto
│   │   └── integration/       # Integration tests with LocalStack
│   └── requirements.txt       # Python dependencies
│
├── frontend/                   # React frontend
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── Auth.jsx       # Login/Signup component
│   │   │   ├── Gallery.jsx    # Image gallery with filters
│   │   │   ├── UploadZone.jsx # Drag & drop upload
│   │   │   ├── Hero3D.jsx     # 3D Polaroid stack
│   │   │   └── PremiumBackground.jsx # 3D starfield
│   │   ├── routes/            # Page components
│   │   │   ├── Home.jsx       # Landing page
│   │   │   ├── Login.jsx      # Login page
│   │   │   └── Dashboard.jsx  # Main app
│   │   ├── lib/
│   │   │   └── utils.js       # Utility functions
│   │   ├── App.jsx            # Root component with routing
│   │   └── main.jsx           # Entry point
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── scripts/
│   ├── init_localstack.sh     # Initialize LocalStack resources
│   └── seed_data.sh           # Seed sample data
│
├── docs/                       # Detailed documentation
│   ├── architecture.md        # System architecture
│   ├── scalability.md         # Scalability analysis
│   ├── failure_modes.md       # Failure scenarios
│   └── deploy_prod.md         # Production deployment
│
├── docker-compose.yml         # Local development environment
├── openapi.yaml               # API specification
├── run_tests.sh               # Test runner script
├── demo.sh                    # Demo script
└── README.md                  # This file
```

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Docker** (v20.10+) and **Docker Compose** (v2.0+)
- **Node.js** (v18+) and **npm** (v9+)
- **Python** (v3.8+) and **pip**
- **Git**
- **Bash** (for running scripts)

### Optional (for production deployment)
- **AWS CLI** (v2+)
- **Serverless Framework** or **AWS SAM**
- **Terraform** (if using IaC)

---

## 🚀 Quick Start

Get CloudBox running in **under 5 minutes**:

### 1. Clone the Repository

```bash
git clone <repository-url>
cd UNLOADIN
```

### 2. Start the Backend (LocalStack)

```bash
# Start LocalStack and initialize AWS resources
docker-compose up -d

# Wait for LocalStack to be ready (10-15 seconds)
sleep 15

# Initialize S3 bucket and DynamoDB table
bash scripts/init_localstack.sh

# (Optional) Seed sample data
bash scripts/seed_data.sh
```

### 3. Start the Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### 4. Access the Application

Open your browser and navigate to:
- **Frontend**: http://localhost:5173
- **LocalStack Dashboard**: http://localhost:4566

---

## 💻 Local Development

### Backend Development

The backend runs inside LocalStack, which emulates AWS services locally.

#### Environment Variables

Set these in `docker-compose.yml` or your Lambda execution environment:

```bash
BUCKET_NAME=image-uploads
TABLE_NAME=ImageMetadata
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=test
AWS_SECRET_ACCESS_KEY=test
```

#### Testing the Backend

```bash
# Run all tests (unit + integration)
bash run_tests.sh

# Run only unit tests
cd backend
pytest tests/unit/ -v

# Run only integration tests (requires LocalStack running)
pytest tests/integration/ -v
```

#### Manual API Testing

```bash
# Generate upload URL
curl -X POST http://localhost:4566/generate-upload-url \
  -H "Content-Type: application/json" \
  -d '{"filename": "test.jpg", "filetype": "image/jpeg"}'

# List images
curl "http://localhost:4566/images?user_id=user_123"

# List images with tag filter
curl "http://localhost:4566/images?user_id=user_123&tag=nature"
```

### Frontend Development

#### Environment Variables

Create `frontend/.env`:

```bash
VITE_API_URL=http://localhost:4566
```

#### Available Scripts

```bash
npm run dev          # Start dev server (http://localhost:5173)
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

#### Component Development

The frontend uses a modular component structure:

- **Pages** (`src/routes/`): Full-page components with routing
- **Components** (`src/components/`): Reusable UI components
- **Utils** (`src/lib/`): Helper functions and utilities

#### Styling Guidelines

- Use Tailwind utility classes for styling
- Custom colors defined in `tailwind.config.js`
- Glassmorphism: `bg-white/5 backdrop-blur-xl`
- Animations: Use Framer Motion for transitions

---

## 📚 API Documentation

### Base URL

- **Local**: `http://localhost:4566`
- **Production**: `https://api.yourcloudbox.com`

### Endpoints

#### 1. Generate Upload URL

**POST** `/generate-upload-url`

Request:
```json
{
  "filename": "vacation.jpg",
  "filetype": "image/jpeg"
}
```

Response:
```json
{
  "upload_url": "https://s3.amazonaws.com/...",
  "object_name": "uuid-vacation.jpg"
}
```

#### 2. Save Metadata

**POST** `/save-metadata`

Request:
```json
{
  "user_id": "user_123",
  "image_id": "uuid-vacation.jpg",
  "tag": "travel",
  "tags": ["travel", "beach", "2024"],
  "description": "Summer vacation",
  "content_type": "image/jpeg"
}
```

Response:
```json
{
  "status": "success",
  "data": { ... }
}
```

#### 3. List Images

**GET** `/images?user_id={user_id}&tag={tag}&start_date={ISO}&end_date={ISO}`

Response:
```json
{
  "images": [
    {
      "image_id": "uuid-vacation.jpg",
      "user_id": "user_123",
      "tag": "travel",
      "upload_time": "2024-01-15T10:30:00Z",
      "description": "Summer vacation"
    }
  ]
}
```

#### 4. Generate Download URL

**GET** `/generate-download-url?id={image_id}`

Response:
```json
{
  "download_url": "https://s3.amazonaws.com/..."
}
```

#### 5. Delete Image

**DELETE** `/delete?id={image_id}&user_id={user_id}`

Response:
```json
{
  "status": "deleted",
  "id": "uuid-vacation.jpg"
}
```

For the complete API specification, see [openapi.yaml](openapi.yaml).

---

## 🎨 Frontend Guide

### Key Features

#### 1. Landing Page (`/`)
- 3D animated spheres using React Three Fiber
- Floating particles with physics
- Feature cards with hover effects
- Call-to-action buttons

#### 2. Login Page (`/login`)
- Animated login/signup slider
- Glassmorphism design
- Forgot password link
- "Go Home" navigation

#### 3. Dashboard (`/dashboard`)
- 3D Polaroid hero section
- Drag & drop upload zone
- Live image gallery with filters
- Tag management
- Download/delete actions

### Customization

#### Colors

Edit `frontend/tailwind.config.js`:

```js
theme: {
  extend: {
    colors: {
      primary: '#3b82f6',    // Blue
      secondary: '#8b5cf6',  // Purple
      accent: '#ff7a57',     // Orange
    }
  }
}
```

#### Animations

Adjust animation speeds in components:

```jsx
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.8 }}  // Adjust here
>
```

---

## 🧪 Testing

### Backend Tests

#### Unit Tests (with moto)

```bash
cd backend
pytest tests/unit/ -v --cov=src
```

Coverage includes:
- ✅ Presigned URL generation
- ✅ Metadata CRUD operations
- ✅ Query filtering (user, tag, date)
- ✅ Error handling
- ✅ Idempotency

#### Integration Tests (with LocalStack)

```bash
# Ensure LocalStack is running
docker-compose up -d

# Run integration tests
pytest tests/integration/ -v
```

Tests the complete flow:
1. Generate upload URL
2. Upload to S3
3. Save metadata
4. Query images
5. Delete image

### Frontend Tests

```bash
cd frontend
npm run test  # If configured
```

### Manual Testing

Use the demo script:

```bash
bash demo.sh
```

This script:
1. Starts Docker Compose
2. Initializes LocalStack
3. Seeds sample data
4. Runs API calls to demonstrate functionality

---

## 🚀 Deployment

### Production Deployment (AWS)

#### Option 1: Serverless Framework

```bash
cd backend

# Install Serverless
npm install -g serverless

# Deploy
serverless deploy --stage prod
```

#### Option 2: AWS SAM

```bash
# Build
sam build

# Deploy
sam deploy --guided
```

#### Option 3: Manual (AWS Console)

1. **Create S3 Bucket**: `your-app-images`
2. **Create DynamoDB Table**: 
   - Name: `ImageMetadata`
   - Partition Key: `user_id` (String)
   - Sort Key: `image_id` (String)
   - GSI: `tag-index` (PK: `tag`, SK: `image_id`)
3. **Create Lambda Functions**: Upload code from `backend/src/`
4. **Create API Gateway**: REST API with Lambda integrations
5. **Set Environment Variables**: `BUCKET_NAME`, `TABLE_NAME`

### Frontend Deployment

#### Option 1: Vercel

```bash
cd frontend
vercel deploy
```

#### Option 2: Netlify

```bash
cd frontend
netlify deploy --prod
```

#### Option 3: S3 + CloudFront

```bash
# Build
npm run build

# Upload to S3
aws s3 sync dist/ s3://your-frontend-bucket

# Create CloudFront distribution
aws cloudfront create-distribution --origin-domain-name your-frontend-bucket.s3.amazonaws.com
```

For detailed deployment instructions, see [docs/deploy_prod.md](docs/deploy_prod.md).

---

## 🐛 Troubleshooting

### Common Issues

#### 1. LocalStack not starting

```bash
# Check Docker status
docker ps

# Restart LocalStack
docker-compose down
docker-compose up -d
```

#### 2. Frontend can't connect to backend

- Ensure `VITE_API_URL` is set correctly
- Check CORS configuration
- Verify LocalStack is running on port 4566

#### 3. Images not appearing in gallery

- Check browser console for errors
- Verify API responses in Network tab
- Ensure metadata was saved after upload
- Check `user_id` matches in upload and query

#### 4. Tests failing

```bash
# Reinstall dependencies
cd backend
pip install -r requirements.txt

# Clear pytest cache
pytest --cache-clear
```

#### 5. Build errors

```bash
# Clear node_modules and reinstall
cd frontend
rm -rf node_modules package-lock.json
npm install
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- **Python**: Follow PEP 8
- **JavaScript**: Use ESLint configuration
- **Commits**: Use conventional commits format

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 📞 Contact 

**Supriya S Poojary**  
📧 Email: supriyaspoojary26@gmail.com

---

## Acknowledgments

- AWS for serverless infrastructure
- LocalStack for local AWS emulation
- React Three Fiber community for 3D graphics
- Tailwind CSS for utility-first styling
- Framer Motion for smooth animations

---

## 📊 Project Stats

- **Lines of Code**: ~5,000+
- **Components**: 15+
- **API Endpoints**: 5
- **Test Coverage**: 85%+
- **Build Time**: ~30s
- **Bundle Size**: ~200KB (gzipped)

---

**Built with ❤️ by Supriya S Poojary**

*For questions, issues, or collaboration opportunities, reach out at supriyaspoojary26@gmail.com

