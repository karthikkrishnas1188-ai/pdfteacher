from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Document, ChatMessage
from .serializers import DocumentSerializer, ChatMessageSerializer
import PyPDF2

class DocumentViewSet(viewsets.ModelViewSet):
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer
    parser_classes = (MultiPartParser, FormParser)

    def create(self, request, *args, **kwargs):
        file_obj = request.FILES.get('file')
        if not file_obj:
            return Response({'error': 'No file provided'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Read PDF content
        try:
            pdf_reader = PyPDF2.PdfReader(file_obj)
            extracted_text = ""
            for page in pdf_reader.pages:
                text = page.extract_text()
                if text:
                    extracted_text += text + "\n"
        except Exception as e:
            return Response({'error': f'Failed to parse PDF: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)
        
        doc = Document.objects.create(
            title=file_obj.name,
            file=file_obj,
            extracted_text=extracted_text
        )
        
        serializer = self.get_serializer(doc)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'])
    def chat(self, request, pk=None):
        document = self.get_object()
        user_message = request.data.get('message')
        
        if not user_message:
            return Response({'error': 'Message is required'}, status=status.HTTP_400_BAD_REQUEST)
            
        # Save user message
        ChatMessage.objects.create(document=document, role='user', content=user_message)
        
        # Mock simple AI logic (keyword search)
        text_lower = document.extracted_text.lower()
        if not text_lower:
             response_text = "The document appears to be empty or unreadable."
        elif any(word in text_lower for word in user_message.lower().split()):
            # Simulate finding information
            snippet = document.extracted_text[:300] + "..." if len(document.extracted_text) > 300 else document.extracted_text
            response_text = f"Based on the PDF, here is some relevant context:\n\n{snippet}\n\n(This is a simulated AI response based on matching keywords in the document.)"
        else:
            response_text = "I couldn't find specific information related to your question in the document, but I'm here to help!"
            
        # Save assistant message
        ChatMessage.objects.create(document=document, role='assistant', content=response_text)
        
        # Return history
        messages = document.messages.all().order_by('timestamp')
        return Response([ChatMessageSerializer(msg).data for msg in messages])
