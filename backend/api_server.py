"""
Simple Flask API server for local development.
This wraps the Lambda handlers to provide HTTP endpoints.
"""
import datetime
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import os
import sys

# Add src to path
sys.path.insert(0, '/app')

from src.app import handlers
from src.utils import local_adapter

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend

# Set environment variables
os.environ.setdefault('BUCKET_NAME', 'image-uploads')
os.environ.setdefault('TABLE_NAME', 'ImageMetadata')
os.environ.setdefault('AWS_ENDPOINT_URL', 'http://localstack:4566')
os.environ.setdefault('USE_LOCAL_STORAGE', 'true') # Default to local storage for easier setup

@app.route('/local-store/<object_name>', methods=['PUT'])
def local_upload(object_name):
    content = request.get_data()
    # Ensure it's not a directory traversal attempt (simple check)
    if '..' in object_name or '/' in object_name:
        return '', 400
    local_adapter.save_file_content(object_name, content)
    return '', 200

@app.route('/local-store/<object_name>', methods=['GET'])
def local_download(object_name):
    # Ensure it's not a directory traversal attempt
    if '..' in object_name or '/' in object_name:
        return '', 400
    path = local_adapter.get_file_content(object_name)
    if path:
        return send_file(path)
    return '', 404

@app.route('/generate-upload-url', methods=['POST', 'OPTIONS'])
def generate_upload_url():
    if request.method == 'OPTIONS':
        return '', 204
    
    event = {'body': request.get_data(as_text=True)}
    response = handlers.generate_upload_url_handler(event, None)
    
    import json
    body = response.get('body', '{}')
    if isinstance(body, str):
        body = json.loads(body)
    
    return jsonify(body), response.get('statusCode', 200)

@app.route('/save-metadata', methods=['POST', 'OPTIONS'])
def save_metadata():
    if request.method == 'OPTIONS':
        return '', 204
    
    event = {'body': request.get_data(as_text=True)}
    response = handlers.save_metadata_handler(event, None)
    
    import json
    body = response.get('body', '{}')
    if isinstance(body, str):
        body = json.loads(body)
        
    return jsonify(body), response.get('statusCode', 200)

@app.route('/images', methods=['GET', 'OPTIONS'])
def list_images():
    if request.method == 'OPTIONS':
        return '', 204
    
    event = {'queryStringParameters': request.args.to_dict()}
    response = handlers.list_images_handler(event, None)
    
    # Parse JSON body if it's a string
    import json
    body = response.get('body', '{}')
    if isinstance(body, str):
        body = json.loads(body)
    
    return jsonify(body), response.get('statusCode', 200)

@app.route('/generate-download-url', methods=['GET', 'OPTIONS'])
def generate_download_url():
    if request.method == 'OPTIONS':
        return '', 204
    
    event = {'queryStringParameters': request.args.to_dict()}
    response = handlers.generate_download_url_handler(event, None)
    
    import json
    body = response.get('body', '{}')
    if isinstance(body, str):
        body = json.loads(body)
    
    return jsonify(body), response.get('statusCode', 200)

@app.route('/delete', methods=['DELETE', 'OPTIONS'])
def delete_image():
    if request.method == 'OPTIONS':
        return '', 204
    
    event = {'queryStringParameters': request.args.to_dict()}
    response = handlers.delete_image_handler(event, None)
    
    import json
    body = response.get('body', '{}')
    if isinstance(body, str):
        body = json.loads(body)
    
    return jsonify(body), response.get('statusCode', 200)

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy'}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)
