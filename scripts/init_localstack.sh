#!/bin/bash
echo "Initializing LocalStack resources..."

awslocal s3 mb s3://image-uploads

awslocal dynamodb create-table \
    --table-name ImageMetadata \
    --attribute-definitions \
        AttributeName=user_id,AttributeType=S \
        AttributeName=image_id,AttributeType=S \
        AttributeName=tag,AttributeType=S \
    --key-schema \
        AttributeName=user_id,KeyType=HASH \
        AttributeName=image_id,KeyType=RANGE \
    --global-secondary-indexes \
        "[
            {
                \"IndexName\": \"tag-index\",
                \"KeySchema\": [{\"AttributeName\": \"tag\",\"KeyType\": \"HASH\"}, {\"AttributeName\": \"image_id\",\"KeyType\": \"RANGE\"}],
                \"Projection\": {\"ProjectionType\": \"ALL\"}
            }
        ]" \
    --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5

echo "Resources created."
