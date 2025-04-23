from django.test import TestCase
from .models import Ask

def Test():
    # 创建对象
    Ask.objects.create(nickname="test1", que_text="hello?")
    # 验证数据
    return Ask.objects.all()    

class AskTest(TestCase):
    def test_create_ask(self):
        # 创建对象
        Ask.objects.create(nickname="test2", que_text="hello?")
        
        # 验证数据
        self.assertEqual(Ask.objects.count(), 1)
        print(Ask.objects.all())
