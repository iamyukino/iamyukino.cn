from django.contrib import admin
from django.urls import path, re_path

from . import views

urlpatterns = [
    # re_path(r'^iframe_content.html$', views.iframe),
    path('db_ask', views.db_ask),
    re_path(r'^(?P<lang>ja-JP)?/?$', views.index),
    re_path(
        r'^rec(?:/(?P<block>[^/]{1,31})(?:/(?P<content>[^/]{1,31})/?)?)?/?$',
        views.rec
    ),
    re_path(
        r'^work(?:/(?P<block>[^/]{1,31})(?:/(?P<content>[^/]{1,31})/?)?)?/?$',
        views.work
    ),
    re_path(
        r'^ask(?:/(?P<block>[^/]{1,31})(?:/(?P<content>[^/]{1,31})/?)?)?/?$',
        views.ask
    ),
]

handler404 = views.err404
handler500 = views.err500