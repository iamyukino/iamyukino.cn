from django.shortcuts import render, redirect
from urllib.parse import urlencode
from django.http import Http404
from mod_iamyukino.tests import Test


def index(request, lang="index"):
    if (request.path.endswith("ja-JP/")):
        pstr = request.path
        return redirect(pstr.rstrip("/"))
    la = ("ja-JP" if lang == "ja-JP" else "zh-CN")
    try:
        return render(request, "index.html", {"la":la})
    except:
        raise Http404("views.index: page not found")

def from_views(ori, request, block, content):    
    suffix_list = ["/", ".html", "/index"]
    for suffix in suffix_list:
        if request.path.endswith(suffix):
            new_url = request.path.removesuffix(suffix)
            if request.GET:
                new_url += '?' + urlencode(request.GET)
            return redirect(new_url)
    if (block and content):
        template_path = f"{ori}/{block}/{content}.html"
    elif (not block):
        template_path = f"{ori}/index.html"
    else:
        template_path = f"{ori}/{block}/index.html"
    try:
        return render(request, template_path)
    except:
        raise Http404(f"views.{ori}: page not found")


def ask(request, block="", content=""):
    return from_views("ask", request, block, content)
def rec(request, block="", content=""):
    return from_views("rec", request, block, content)
def work(request, block="", content=""):
    return from_views("work", request, block, content)

def sitemap(request):
    return render(request, "sitemap.xml", content_type="application/xml")

def err404(request, exception):
    return render(request, '__epages__/404.html', status=404)
def err500(request):
    return render(request, '__epages__/500.html', status=500)
