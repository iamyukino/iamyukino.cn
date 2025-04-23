from django.urls import path, re_path
from . import views

urlpatterns = [
    path('submit_ask/', views.submit_ask, name='submit_ask'),
]