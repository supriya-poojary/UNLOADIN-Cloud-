#!/bin/bash
echo "Seeding data..."

# Seed Images (Metadata only for DynamoDB, and dummy files for S3 if needed, but requirements just say 'seed data')

# 1. User1, Image1
awslocal dynamodb put-item \
    --table-name ImageMetadata \
    --item '{"user_id": {"S": "user_123"}, "image_id": {"S": "2023-01-01T10:00:00Z"}, "tag": {"S": "vacation"}, "filename": {"S": "photo1.jpg"}}'

# 2. User1, Image2
awslocal dynamodb put-item \
    --table-name ImageMetadata \
    --item '{"user_id": {"S": "user_123"}, "image_id": {"S": "2023-02-01T10:00:00Z"}, "tag": {"S": "work"}, "filename": {"S": "doc1.jpg"}}'

# 3. User2, Image3
awslocal dynamodb put-item \
    --table-name ImageMetadata \
    --item '{"user_id": {"S": "user_456"}, "image_id": {"S": "2023-03-01T10:00:00Z"}, "tag": {"S": "family"}, "filename": {"S": "family.jpg"}}'

# 4. User2, Image4
awslocal dynamodb put-item \
    --table-name ImageMetadata \
    --item '{"user_id": {"S": "user_456"}, "image_id": {"S": "2023-04-01T10:00:00Z"}, "tag": {"S": "vacation"}, "filename": {"S": "beach.jpg"}}'

# 5. User1, Image5
awslocal dynamodb put-item \
    --table-name ImageMetadata \
    --item '{"user_id": {"S": "user_123"}, "image_id": {"S": "2023-05-01T10:00:00Z"}, "tag": {"S": "random"}, "filename": {"S": "test.jpg"}}'

echo "Data seeded."
