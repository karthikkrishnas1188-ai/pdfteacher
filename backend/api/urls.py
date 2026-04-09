from django.urls import path
from . import views

urlpatterns = [
    path('upload/', views.upload_pdf, name='upload_pdf'),
    path('upload-question-paper/', views.upload_question_paper, name='upload_question_paper'),
    path('chat/', views.chat, name='chat'),
]
