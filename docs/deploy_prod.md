# Production Deployment Guide

## Prerequisites
- AWS CLI configured with Administrator permissions
- Node.js and npm installed (for frontend build)
- Python 3.9+ installed
- Docker (optional, for building lambda layers)

## Backend Deployment (AWS Lambda + API Gateway)

### Option 1: Using Serverless Framework (Recommended)
1. Install Serverless: `npm install -g serverless`
2. Create `serverless.yml` (template below).
3. Deploy: `sls deploy --stage prod`

**Sample serverless.yml:**
```yaml
service: cloud-image-service
provider:
  name: aws
  runtime: python3.9
  environment:
    BUCKET_NAME: ${self:service}-uploads-${opt:stage}
    TABLE_NAME: ImageMetadata-${opt:stage}
  iamRoleStatements:
    - Effect: Allow
      Action:
        - s3:PutObject
        - s3:GetObject
        - s3:DeleteObject
      Resource: "arn:aws:s3:::${self:provider.environment.BUCKET_NAME}/*"
    - Effect: Allow
      Action:
        - dynamodb:Query
        - dynamodb:PutItem
        - dynamodb:DeleteItem
        - dynamodb:GetItem
      Resource: "arn:aws:dynamodb:*:*:table/${self:provider.environment.TABLE_NAME}*"

functions:
  generateUploadUrl:
    handler: src.app.handlers.generate_upload_url_handler
    events:
      - http: POST /generate-upload-url
  saveMetadata:
    handler: src.app.handlers.save_metadata_handler
    events:
      - http: POST /save-metadata
  listImages:
    handler: src.app.handlers.list_images_handler
    events:
      - http: GET /images

resources:
  Resources:
    ImagesBucket:
      Type: AWS::S3::Bucket
      Properties:
        BucketName: ${self:provider.environment.BUCKET_NAME}
        CorsConfiguration:
          CorsRules:
            - AllowedHeaders: ['*']
              AllowedMethods: [GET, PUT, DELETE]
              AllowedOrigins: ['*']
    MetadataTable:
      Type: AWS::DynamoDB::Table
      Properties:
        TableName: ${self:provider.environment.TABLE_NAME}
        AttributeDefinitions:
          - AttributeName: user_id
            AttributeType: S
          - AttributeName: image_id
            AttributeType: S
        KeySchema:
          - AttributeName: user_id
            KeyType: HASH
          - AttributeName: image_id
            KeyType: RANGE
        BillingMode: PAY_PER_REQUEST
```

### Option 2: Manual / ZIP Upload
1. Zip the `src` folder and `site-packages` (installed dependencies).
2. Create Lambda functions via AWS Console.
3. Set Environment Variables (`BUCKET_NAME`, `TABLE_NAME`).
4. Create API Gateway and link to Lambdas.

## Frontend Deployment

1. **Build**:
   ```bash
   cd frontend
   npm run build
   ```
   This creates a `dist` folder.

2. **Deploy to S3**:
   ```bash
   aws s3 sync dist/ s3://your-frontend-bucket-name
   ```

3. **CloudFront**:
   - Create a CloudFront distribution pointing to the S3 bucket.
   - Set OAI (Origin Access Identity) to restrict bucket access to CloudFront only.
   - Configure Route53 for custom domain (e.g., `app.yourdomain.com`).

## Verification
- Visit the CloudFront URL.
- Test Login/Upload flow.
- Monitor CloudWatch Logs for Lambda errors.
