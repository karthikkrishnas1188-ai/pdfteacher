from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['POST'])
def upload_pdf(request):
    file = request.FILES.get('file')
    if file:
        return Response({'message': f'Received file {file.name}'})
    return Response({'error': 'No file uploaded'}, status=400)

@api_view(['POST'])
def chat(request):
    message = request.data.get('message', '')
    return Response({'reply': f'You said: {message}. This is your PDF Teacher!'})
