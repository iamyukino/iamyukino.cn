# from django.shortcuts import render
from django.utils import timezone
from .models import Ask

import json
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods

import requests
# from django.views.decorators.csrf import csrf_exempt
from django.db.models import Q, Case, When, Value, BooleanField
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger

def check_spam(request, nickname, que_text, user_ip, user_agent):
    try:
        akismet_api_key = "7a4e40829953"
        akismet_url = f"https://{akismet_api_key}.rest.akismet.com/1.1/comment-check"
        response = requests.post(
            akismet_url,
            data={
                'blog': 'https://iamyukino.cn',
                'user_ip': user_ip,
                'user_agent': user_agent,
                'comment_author': nickname,
                'comment_content': que_text,
                'comment_type': 'comment',
                'referrer': request.META.get('HTTP_REFERER', ''),
            },
            headers={'Content-Type': 'application/x-www-form-urlencoded'},
            timeout=5
        )
        response.raise_for_status()
        return response.text == 'true'
    except requests.exceptions.RequestException:
        raise Exception("AkismetAPI request timeout.")

def get_client_ip(request):
    xff = request.META.get('HTTP_X_FORWARDED_FOR', '')
    return next(iter(
        [ip.strip() for ip in xff.split(',') if ip.strip()][:1] or 
        [request.META.get('REMOTE_ADDR', '0.0.0.0')]
    ), '0.0.0.0')[:16]

@require_http_methods(["POST"])
def submit_ask(request):
    try:
        data = json.loads(request.body)
        m_nickname = data['nickname'][:16]
        m_que_text = data['que_text'][:300]
        if len(m_nickname) == 0: m_nickname = '?null'
        if len(m_que_text) == 0: m_que_text = '?null'
        m_authorip = get_client_ip(request)
        m_autagent = (request.META.get('HTTP_USER_AGENT', ''))[:64]
    except Exception as e:
        return JsonResponse({'status': 'error',
            'message': 'POST request missing parameters.'}, status=400)
    
    try:
        if check_spam(request, m_nickname, "", m_authorip, m_autagent):
            raise Exception("不许给自己取奇怪的昵称！试试用「草莓糯米团」这样甜滋滋的名字好不好呀？")
        if check_spam(request, m_nickname, m_que_text, m_authorip, m_autagent):
            raise Exception("内容好像有点饿瘪瘪，给它喂点故事糖果和细节饼干会更元气满满哦！(๑•̀ㅂ•́)و✧")
        ask = Ask.objects.create(nickname=m_nickname, que_text=m_que_text, authorip=m_authorip, autagent=m_autagent)
        return JsonResponse({'status': 'success',
            'id': ask.id, 'json': str(ask)}, status=200)
    except Exception as e:
        return JsonResponse({'status': 'error',
            'message': str(e)}, status=400)

@require_http_methods(["GET"])
def get_asks(request):
    page = request.GET.get('page', 1)
    current_ip = get_client_ip(request)
    asks_list = Ask.objects.annotate(
        can_delete=Case(
            When(
                Q(authorip=current_ip) & Q(ans_time__isnull=True),
                then=Value(True)
            ),
            default=Value(False),
            output_field=BooleanField()
        )
    ).filter(
        Q(ans_time__isnull=False) | Q(authorip=current_ip),
        que_text__isnull=False
    ).exclude(que_text='').order_by('-que_time')
    
    paginator = Paginator(asks_list, 5)
    try:
        asks = paginator.page(page)
    except PageNotAnInteger:
        asks = paginator.page(1)
    except EmptyPage:
        asks = paginator.page(paginator.num_pages)

    asks_data = []
    for ask in asks:
        asks_data.append({
            "id": ask.id,
            "nickname": ask.nickname,
            "que_time": ask.que_time.astimezone(timezone.get_current_timezone()).strftime("%Y/%m/%d"),
            "que_text": ask.que_text,
            "ans_time": ask.ans_time.astimezone(timezone.get_current_timezone()).strftime("%Y/%m/%d %H:%M") if ask.ans_time else None,
            "ans_text": ask.ans_text,
            "can_delete" : ask.can_delete,
        })
    
    return JsonResponse({
        "status": "success",
        "asks": asks_data,
        "total_pages": paginator.num_pages,
        "current_page": asks.number
    })

@require_http_methods(["DELETE"])
def delete_ask(request, ask_id):
    current_ip = get_client_ip(request)

    try:
        ask = Ask.objects.get(
            id=ask_id,
            authorip=current_ip,
            ans_time__isnull=True
        )
    except Ask.DoesNotExist:
        return JsonResponse({
            'status': 'error',
            'message': '权限不足'
        }, status=403)

    ask.delete()
    return JsonResponse({'status': 'success', 'message': '已撤回'})
