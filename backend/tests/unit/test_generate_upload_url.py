import boto3
import json
import pytest
from moto import mock_s3
from src.app import handlers
import os

@pytest.fixture
def s3_setup():
    with mock_s3():
        s3 = boto3.client('s3', region_name='us-east-1')
        s3.create_bucket(Bucket='test-bucket')
        os.environ['BUCKET_NAME'] = 'test-bucket'
        yield s3

def test_generate_upload_url_success(s3_setup):
    event = {
        'body': json.dumps({'filename': 'test.jpg', 'filetype': 'image/jpeg'})
    }
    response = handlers.generate_upload_url_handler(event, None)
    
    assert response['statusCode'] == 200
    body = json.loads(response['body'])
    assert 'upload_url' in body
    assert 'object_name' in body
    assert 'test.jpg' in body['object_name']

def test_generate_upload_url_missing_filename(s3_setup):
    event = {
        'body': json.dumps({'filetype': 'image/jpeg'})
    }
    response = handlers.generate_upload_url_handler(event, None)
    
    assert response['statusCode'] == 400
    body = json.loads(response['body'])
    assert body['message'] == 'Missing filename'
