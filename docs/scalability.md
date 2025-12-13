# Scalability Design

## Serverless Architecture
The system utilizes AWS Serverless components (Lambda, API Gateway, S3, DynamoDB) which inherently scale to zero and up to thousands of concurrent requests without manual intervention.

## Database Scalability (DynamoDB)
- **Partition Key**: `user_id` ensures that data is distributed across partitions based on users.
- **On-Demand Capacity**: The table is configured for On-Demand capacity, automatically handling burst traffic.
- **GSIs**: The `tag-index` GSI allows for efficient querying by tag without scanning the whole table, distributing read load.

### Scaling Limits
- **Lambda**: Default concurrency limit is 1,000 per region (soft limit, can be raised).
- **S3**: Virtually unlimited throughput for PUT/GET. Pre-signed URLs offload upload bandwidth from the application servers to S3 directly.

## Performance Optimization
- **Presigned URLs**: By allowing clients to upload directly to S3, we remove the bottleneck of proxying binary data through Lambda functions.
- **Caching**: 
    - API Gateway Caching (optional) can be enabled for read-heavy endpoints.
    - CloudFront handles static asset caching (frontend) and can cache public API responses.

## Future Considerations
- **Content Delivery Network (CDN)**: Serve images via CloudFront for lower latency globally.
- **Image Processing**: Trigger a separate Lambda on S3 upload to generate thumbnails asynchronously.
