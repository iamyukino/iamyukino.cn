from django.contrib import admin
from django.urls import include, path, re_path
from . import views

urlpatterns = [
    path('api/x/', include('mod_iamyukino.urls')),

    re_path(r'^(?P<lang>ja-JP)?/?$', views.index),
    re_path(r'^ask(?:/(?P<block>[^/]{1,31})(?:/(?P<content>[^/]{1,31})/?)?)?/?$', views.ask ),
    re_path(r'^rec(?:/(?P<block>[^/]{1,31})(?:/(?P<content>[^/]{1,31})/?)?)?/?$', views.rec ),
    re_path(r'^work(?:/(?P<block>[^/]{1,31})(?:/(?P<content>[^/]{1,31})/?)?)?/?$',views.work),
]

handler404 = views.err404
handler500 = views.err500