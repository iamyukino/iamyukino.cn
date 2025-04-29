import os
from django.conf import settings
from django.utils import timezone
from datetime import datetime

def get_mod_time(dir):
    full_path = os.path.abspath(
        os.path.join(settings.BASE_DIR, 'htdocs', dir)
    )
    if not full_path.startswith(os.path.join(settings.BASE_DIR, 'htdocs')):
        raise ValueError("Invalid path")
    timestamp = os.path.getmtime(full_path)
    naive_time = datetime.fromtimestamp(timestamp)
    aware_time = timezone.make_aware(naive_time)
    return aware_time

assitemap = [{
    "loc":"https://iamyukino.cn",
    "lastmod":get_mod_time("index.html"),
    "changefreq":"daily",
    "priority":"1.0",
    "alternate":[{
        "hreflang":"zh",
        "href":"https://iamyukino.cn/"
    },{
        "hreflang":"ja",
        "href":"https://iamyukino.cn/ja-JP"
    },{
        "hreflang":"x-default",
        "href":"https://iamyukino.cn/"
    }]
},{
    "loc":"https://iamyukino.cn/ask",
    "lastmod":get_mod_time("ask/index.html"),
    "changefreq":"daily",
    "priority":"0.8",
    "alternate":[]
},{
    "loc":"https://iamyukino.cn/rec/live2d",
    "lastmod":get_mod_time("rec/live2d/index.html"),
    "changefreq":"daily",
    "priority":"0.8",
    "alternate":[]
},{
    "loc":"https://iamyukino.cn/work",
    "lastmod":get_mod_time("work/index.html"),
    "changefreq":"daily",
    "priority":"0.8",
    "alternate":[]
}]
