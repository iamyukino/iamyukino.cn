from django.shortcuts import render, redirect
from urllib.parse import urlencode
from django.http import Http404
from mod_iamyukino.tests import Test

# def iframe(request):
#     return render(request, 'iframe_content.html')

def db_ask(request):
    content = Test()
    return render(request,"db_ask.html", {"content":content})

def index(request, lang="index"):
    """
    雨雪冰屋主站
    @state on-hold
    @info 挂起中
    """
    if (request.path.endswith("ja-JP/")):
        pstr = request.path
        return redirect(pstr.rstrip("/"))
    la = ("ja-JP" if lang == "ja-JP" else "zh-CN")
    try:
        return render(request, "index.html", {"la":la})
    except:
        raise Http404("views.index: page not found")


def ask(request, block="", content=""):
    """
    棉花糖 (Q&A)
    @state in-progress
    @info 在写了在写了
    """
    suffix_list = ["/", ".html", "/index"]
    for suffix in suffix_list:
        if request.path.endswith(suffix):
            new_url = request.path.removesuffix(suffix)
            if request.GET:
                new_url += '?' + urlencode(request.GET)
            return redirect(new_url)

    if (block and content):
        template_path = f"ask/{block}/{content}.html"
    elif (not block):
        template_path = "ask/index.html"
    else:
        template_path = f"ask/{block}/index.html"
    
    try:
        return render(request, template_path)
    except:
        raise Http404("views.ask: page not found")


def rec(request, block="", content=""):
    """
    资源站 (图床)
    @state cancelled
    @info 板块已暂停更新
    """
    suffix_list = ["/", ".html", "/index"]
    for suffix in suffix_list:
        if request.path.endswith(suffix):
            new_url = request.path.removesuffix(suffix)
            if request.GET:
                new_url += '?' + urlencode(request.GET)
            return redirect(new_url)
    
    if (block and content):
        template_path = f"rec/{block}/{content}.html"
    elif (not block):
        template_path = "rec/index.html"
    else:
        template_path = f"rec/{block}/index.html"
        
    try:
        return render(request, template_path)
    except:
        raise Http404("views.rec: page not found")


def work(request, block="", content=""):
    """
    工作台 (雨雪博客)
    @state cancelled
    @info 板块已暂停更新
    """
    suffix_list = ["/", ".html", "/index"]
    for suffix in suffix_list:
        if request.path.endswith(suffix):
            new_url = request.path.removesuffix(suffix)
            if request.GET:
                new_url += '?' + urlencode(request.GET)
            return redirect(new_url)
    
    if (block and content):
        template_path = f"work/{block}/{content}.html"
    elif (not block):
        template_path = "work/index.html"
    else:
        template_path = f"work/{block}/index.html"
    
    try:
        return render(request, template_path)
    except:
        raise Http404("views.work: page not found")


def err404(request, exception):
    return render(request, '__epages__/404.html', status=404)
def err500(request):
    return render(request, '__epages__/500.html', status=500)
