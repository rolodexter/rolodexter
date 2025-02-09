from flask import Flask, request, jsonify, send_from_directory
import os
import requests
from dotenv import load_dotenv
from flask_cors import CORS

load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for development

@app.route('/')
def serve_frontend():
    return send_from_directory('.', 'index.html')

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        user_message = request.json.get('message', '')
        headers = {
            'Authorization': f"Bearer {os.getenv('OPENROUTER_API_KEY')}",
            'Content-Type': 'application/json'
        }
        data = {
            'model': 'gpt-4o',
            'messages': [{'role': 'user', 'content': user_message}],
            'max_tokens': 100
        }
        response = requests.post(
            'https://openrouter.ai/api/v1/chat/completions', 
            headers=headers, 
            json=data
        )
        return jsonify(response.json())
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    port = int(os.getenv('PORT', 8080))
    app.run(host='0.0.0.0', port=port)
