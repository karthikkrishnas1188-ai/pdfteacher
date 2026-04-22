import os
import requests
import PyPDF2
from rest_framework.decorators import api_view
from rest_framework.response import Response

document_context = ""

def extract_text_from_pdf(file):
    try:
        reader = PyPDF2.PdfReader(file)
        text = ""
        for page in reader.pages:
            if page.extract_text():
                text += page.extract_text() + "\n"
        return text.strip()
    except Exception as e:
        print(f"Error reading PDF: {e}")
        return ""

@api_view(['POST'])
def upload_pdf(request):
    global document_context
    file = request.FILES.get('file')
    if file:
        extracted = extract_text_from_pdf(file)
        if extracted:
            document_context = extracted
            return Response({'message': f'Received and processed file {file.name}'})
        return Response({'message': f'Received file {file.name} but no text could be extracted.'})
    return Response({'error': 'No file uploaded'}, status=400)

@api_view(['POST'])
def upload_question_paper(request):
    global document_context
    file = request.FILES.get('file')
    if file:
        extracted = extract_text_from_pdf(file)
        if extracted:
            document_context = extracted
            return Response({'message': f'Received and processed file {file.name}'})
        return Response({'message': f'Received file {file.name} but no text could be extracted.'})
    return Response({'error': 'No file uploaded'}, status=400)

@api_view(['POST'])
def chat(request):
    message = request.data.get('message', '')
    
    api_key = os.environ.get('SARVAM_API_KEY', 'sk_tyn5z559_MYZwjiZpbCi50ZJM6iKkDlxj')
    if not api_key:
        return Response({'reply': 'Error: Sarvam API Key not found. Please set SARVAM_API_KEY in backend/.env.'})

    url = "https://api.sarvam.ai/v1/chat/completions"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"
    }
    
    global document_context
    system_prompt = (
        "You are a helpful and knowledgeable PDF Teacher AI assistant. "
        "Provide thorough and clear explanations based on the document. "
        "Structure your answers well, and provide examples if they make the concept easier to understand."
    )
    if document_context:
        system_prompt += f"\n\nHere is the content of the currently uploaded document:\n{document_context[:10000]}"
        
    payload = {
        "model": "sarvam-30b",
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": message}
        ],
        "temperature": 0.5
    }
    
    try:
        response = requests.post(url, headers=headers, json=payload)
        response.raise_for_status()
        data = response.json()
        message_obj = data.get('choices', [{}])[0].get('message', {})
        reply_content = message_obj.get('content', '')
        
        return Response({'reply': reply_content})
    except Exception as e:
        error_msg = str(e)
        return Response({'reply': f'Error connecting to AI: {str(error_msg)}'})
