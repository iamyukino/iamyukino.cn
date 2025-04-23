# from django.shortcuts import render
# from django.core.paginator import Paginator
from django.utils import timezone
from .models import Ask

import json
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt

@require_http_methods(["POST"])
def submit_ask(request):
    try:
        data = json.loads(request.body)
        ask = Ask.objects.create(
            nickname=data['nickname'][:32],
            que_text=data['que_text'][:300],
        )
        return JsonResponse({
            'status': 'success',
            'id': ask.id,
            'json': str(ask)
        }, status=200)
    except Exception as e:
        return JsonResponse({
            'status': 'error',
            'message': str(e)
        }, status=400)
