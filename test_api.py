import os
import requests
import json

api_key = os.environ.get('SARVAM_API_KEY', 'sk_tyn5z559_MYZwjiZpbCi50ZJM6iKkDlxj')
url = "https://api.sarvam.ai/v1/chat/completions"
headers = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {api_key}"
}
payload = {
    "model": "sarvam-30b",
    "messages": [
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "What is 2+2?"}
    ],
    "temperature": 0.5,
    "max_tokens": 800
}

response = requests.post(url, headers=headers, json=payload)
print(response.status_code)
print(json.dumps(response.json(), indent=2))
