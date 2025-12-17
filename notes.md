# Notes

## Key Design Decisions
1.  **Presigned URLs**: 
    - *Why?* Offload binary traffic from Lambda to S3 directly. Reduces cost (Lambda GB-seconds) and improves performance (throughput).
    - *Tradeoff*: Client complexity increases slightly (2-step upload).

2.  **DynamoDB Schema**:
    - *PK*: `user_id` for tenant isolation and efficient querying of user galleries.
    - *GSI*: `tag-index` for flexible filtering.
    - *Why Standard/On-Demand?* Unpredictable traffic patterns of image uploads fit On-Demand scaling well.

3.  **Consistency (S3 vs DynamoDB)**:
    - *Problem*: Atomic transactions across S3 and DDB are hard.
    - *Solution*: Operational approach. Upload to S3 first -> Save Metadata. If metadata save fails, we have an orphan object (cheap). Cleanup via Lifecycle or Cron. If S3 upload fails, no metadata exists (safe).
    - *Delete*: Handled idempotently. UI hides failures if one succeeds.

4.  **Frontend Performance**:
    - *Lazy Loading*: Images in `Gallery.jsx`.
    - *3D Hero*: Optimized with `useFrame` and `instancedMesh` (if many particles) to keep 60fps.

## Scalability
- **Read**: Highly scalable with DynamoDB + CDN (if added).
- **Write**: S3 scales infinitely. DynamoDB handles concurrent writes via sharding (partition keys).

## Failure Scenarios
- **Network Flakiness**: Mobile clients need robust retry logic on uploads. Backend handles retries via idempotent save operations.
- **Cold Starts**: Python Lambda has relatively low cold starts, but Provisioned Concurrency could be used for critical paths.
