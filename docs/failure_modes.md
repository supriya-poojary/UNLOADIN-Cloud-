# Failure Modes and Handling

## 1. S3 Upload Failures
- **Scenario**: Client fails to upload image to S3 presigned URL (e.g., network drop).
- **Impact**: No file in S3.
- **Handling**: Client-side retry. No metadata is created until the client explicitly calls `/save-metadata`. If the client never calls save, no orphan metadata exists.
- **Cleanup**: S3 Lifecycle Policy (e.g., Delete incomplete multipart uploads after 1 day) handles orphaned partial uploads.

## 2. Metadata Save Failures
- **Scenario**: Image uploaded to S3, but `/save-metadata` call fails (dynamodb error/timeout).
- **Impact**: Orphaned file in S3 with no DB record.
- **Handling**: Client should retry the save call.
- **Recovery**: If the client gives up, the file remains "orphaned". A scheduled Lambda could scan S3 and delete files older than X hours that have no corresponding DynamoDB entry (optional maintenance task).

## 3. Deletion Failures (Partial Delete)
- **Scenario**: Client requests delete. 
    1. S3 delete succeeds.
    2. DynamoDB delete fails.
- **Impact**: Metadata points to a non-existent file.
- **Handling**: The API returns a `207 Multi-Status` or specific error code indicating partial success.
- **Idempotency**: The delete operation is idempotent. The client (or user) can simply click "delete" again. The second request will find the S3 file missing (success) and then retry DynamoDB delete (success).
- **Consistnecy**: Since S3 delete is performed first, we risk "dangling metadata" (better than paying for storage of dangling files). The UI handles missing images gracefully (404 on image load).

## 4. DynamoDB Throttling
- **Scenario**: Sudden spike in uploads/reads.
- **Impact**: 400/500 errors from API.
- **Handling**: 
    - Enable Exponential Backoff in AWS SDK (built-in).
    - API Gateway throttling limits to protect downstream.
    - On-Demand capacity handles bursts automatically.
