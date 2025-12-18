### Frontend
- **Framework**: React + Vite
- **Styling**: Tailwind CSS + Framer Motion
- **Hosting**: S3 Static Website Hosting behind CloudFront

### Backend
- **Compute**: AWS Lambda (Python 3.8+)
- **API**: Amazon API Gateway (REST API)
- **Storage**: Amazon S3 (Binary Objects)
- **Database**: Amazon DynamoDB (Metadata)

### Database Schema
**Table: ImageMetadata**
- **PK**: `user_id` (String)
- **SK**: `image_id` (String, ISO Timestamp)
- **GSI1**: `tag-index` (PK: `tag`, SK: `image_id`)
