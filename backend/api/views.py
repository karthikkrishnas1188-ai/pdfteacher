import os
import requests
from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['POST'])
def upload_pdf(request):
    file = request.FILES.get('file')
    if file:
        return Response({'message': f'Received file {file.name}'})
    return Response({'error': 'No file uploaded'}, status=400)

@api_view(['POST'])
def upload_question_paper(request):
    file = request.FILES.get('file')
    if file:
        return Response({'message': f'Received question paper {file.name}'})
    return Response({'error': 'No file uploaded'}, status=400)

@api_view(['POST'])
def chat(request):
    message = request.data.get('message', '')
    
    api_key = os.environ.get('SARVAM_API_KEY')
    if not api_key:
        return Response({'reply': 'Error: Sarvam API Key not found. Please set SARVAM_API_KEY in backend/.env.'})

    url = "https://api.sarvam.ai/v1/chat/completions"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"
    }
    
    payload = {
        "model": "sarvam-30b",
        "messages": [
            {"role": "system", "content": "You are a helpful PDF Teacher AI assistant."},
            {"role": "user", "content": message}
        ],
        "temperature": 0.3
    }
    
    try:
        response = requests.post(url, headers=headers, json=payload)
        response.raise_for_status()
        data = response.json()
        reply_content = data['choices'][0]['message']['content']
        return Response({'reply': reply_content})
    except Exception as e:
        error_msg = str(e)
        if 'response' in locals() and hasattr(response, 'text'):
            error_msg += f" - Response: {response.text}"
        print(f"Sarvam AI Error: {error_msg}")
        return Response({'reply': f'Error connecting to AI: {str(e)}'})
