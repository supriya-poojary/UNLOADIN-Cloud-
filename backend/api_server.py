"""
Simple Flask API server for local development.
This wraps the Lambda handlers to provide HTTP endpoints.
"""
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import sys

# Add src to path
sys.path.insert(0, '/app')

from src.app import handlers

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend

# Set environment variables
os.environ.setdefault('BUCKET_NAME', 'image-uploads')
os.environ.setdefault('TABLE_NAME', 'ImageMetadata')
os.environ.setdefault('AWS_ENDPOINT_URL', 'http://localstack:4566')

@app.route('/generate-upload-url', methods=['POST', 'OPTIONS'])
def generate_upload_url():
    if request.method == 'OPTIONS':
        return '', 204
    
    event = {'body': request.get_data(as_text=True)}
    response = handlers.generate_upload_url_handler(event, None)
    return jsonify(response.get('body', {})), response.get('statusCode', 200)

@app.route('/save-metadata', methods=['POST', 'OPTIONS'])
def save_metadata():
    if request.method == 'OPTIONS':
        return '', 204
    
    event = {'body': request.get_data(as_text=True)}
    response = handlers.save_metadata_handler(event, None)
    return jsonify(response.get('body', {})), response.get('statusCode', 200)

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
