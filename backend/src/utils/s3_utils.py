import boto3
import logging
from botocore.exceptions import ClientError
from botocore.config import Config

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def get_s3_client():
    """Returns a boto3 S3 client."""
    # Config signature_version='s3v4' is important for presigned URLs
    return boto3.client('s3', config=Config(signature_version='s3v4'))

def generate_presigned_upload_url(bucket_name, object_name, expiration=3600):
    """Generate a presigned URL to upload a file to S3."""
    s3_client = get_s3_client()
    try:
        response = s3_client.generate_presigned_url('put_object',
                                                    Params={'Bucket': bucket_name,
                                                            'Key': object_name},
                                                    ExpiresIn=expiration)
    except ClientError as e:
        logger.error(e)
        return None
    return response

def generate_presigned_download_url(bucket_name, object_name, expiration=3600):
    """Generate a presigned URL to download a file from S3."""
    s3_client = get_s3_client()
    try:
        response = s3_client.generate_presigned_url('get_object',
                                                    Params={'Bucket': bucket_name,
                                                            'Key': object_name},
                                                    ExpiresIn=expiration)
    except ClientError as e:
        logger.error(e)
        return None
    return response

def delete_s3_object(bucket_name, object_name):
    """Delete an object from an S3 bucket."""
    s3_client = get_s3_client()
    try:
        s3_client.delete_object(Bucket=bucket_name, Key=object_name)
        return True
    except ClientError as e:
        logger.error(f"Failed to delete {object_name} from {bucket_name}: {e}")
        return False
