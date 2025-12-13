import boto3
import logging
from botocore.exceptions import ClientError
from boto3.dynamodb.conditions import Key, Attr

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def get_dynamodb_resource():
    """Returns a boto3 DynamoDB resource."""
    return boto3.resource('dynamodb')

def save_metadata(table_name, item):
    """Save metadata item to DynamoDB."""
    dynamodb = get_dynamodb_resource()
    table = dynamodb.Table(table_name)
    try:
        table.put_item(Item=item)
        return True
    except ClientError as e:
        logger.error(f"Failed to save metadata: {e}")
        return False

def get_metadata(table_name, user_id, image_id):
    """Get metadata for a specific image."""
    dynamodb = get_dynamodb_resource()
    table = dynamodb.Table(table_name)
    try:
        response = table.get_item(Key={'user_id': user_id, 'image_id': image_id})
        return response.get('Item')
    except ClientError as e:
        logger.error(f"Failed to get metadata: {e}")
        return None

def query_images(table_name, user_id=None, tag=None, start_date=None, end_date=None):
    """
    Query images based on filters.
    Supports:
    - user_id (PK scan range)
    - tag (GSI query)
    - date range (SK condition or FilterExpression)
    """
    dynamodb = get_dynamodb_resource()
    table = dynamodb.Table(table_name)
    
    try:
        if user_id:
            # Main Table Query
            key_condition = Key('user_id').eq(user_id)
            if start_date and end_date:
                key_condition = key_condition & Key('image_id').between(start_date, end_date)
            
            filter_expression = None
            if tag:
                filter_expression = Attr('tags').contains(tag) # Assuming 'tags' is a list or 'tag' is a single field. Let's assume 'tag' single for simplicity as per GSI req.
                # If GSI 'tag-index' exists, better to use it if user_id is NOT provided.
                # But here user_id IS provided, so we query Partition and filter by attr.

            query_kwargs = {'KeyConditionExpression': key_condition}
            if filter_expression:
                query_kwargs['FilterExpression'] = filter_expression
                
            response = table.query(**query_kwargs)
            return response.get('Items', [])
            
        elif tag:
            # GSI Query (Global Secondary Index)
            # Assuming GSI name 'tag-index' where PK=tag
            # And we need to support date range on this GSI if possible? 
            # If GSI Sort Key is 'image_id', we can range query on it.
            key_condition = Key('tag').eq(tag)
            if start_date and end_date:
                key_condition = key_condition & Key('image_id').between(start_date, end_date)
                
            response = table.query(
                IndexName='tag-index',
                KeyConditionExpression=key_condition
            )
            return response.get('Items', [])
            
        else:
            # Scan if no query keys (Inefficient but necessary if no user_id or tag)
            # Or return empty/error. Requirement says "Must support filters".
            # Let's perform a Scan with filters if provided, but warn.
            scan_kwargs = {}
            filter_expressions = []
            if start_date and end_date:
                filter_expressions.append(Attr('image_id').between(start_date, end_date))
            
            if filter_expressions:
                from functools import reduce
                scan_kwargs['FilterExpression'] = reduce(lambda x, y: x & y, filter_expressions)
                response = table.scan(**scan_kwargs)
                return response.get('Items', [])
            
            return [] # Return empty if no filters at all to prevent full table dump

    except ClientError as e:
        logger.error(f"Failed to query images: {e}")
        return []

def delete_metadata_item(table_name, user_id, image_id):
    """Delete metadata item from DynamoDB."""
    dynamodb = get_dynamodb_resource()
    table = dynamodb.Table(table_name)
    try:
        table.delete_item(Key={'user_id': user_id, 'image_id': image_id})
        return True
    except ClientError as e:
        logger.error(f"Failed to delete metadata: {e}")
        return False
