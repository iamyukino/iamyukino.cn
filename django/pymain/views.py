from django.shortcuts import render, redirect
from urllib.parse import urlencode
from django.http import Http404


def index(request, lang="index"):
    if (request.path.endswith("ja-JP/")):
        pstr = request.path
        return redirect(pstr.rstrip("/"))
    try:
        return render(request, lang + ".html")
    except:
        raise Http404("views.index: page not found")


def rec(request, block="", content=""):
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
