from django.urls import path
from . import views

urlpatterns = [
    path('upload/', views.upload_pdf, name='upload_pdf'),
    path('chat/', views.chat, name='chat'),
]
