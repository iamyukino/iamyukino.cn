from django.urls import path, re_path
from . import views

urlpatterns = [
    path('submit_ask/', views.submit_ask, name='submit_ask'),
    path('get_asks/', views.get_asks, name='get_asks'),
    re_path(r'^delete_ask/(?P<ask_id>\d{1,10})/?$', views.delete_ask, name='delete_ask'),
]