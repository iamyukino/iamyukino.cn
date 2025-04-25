from django.db import models
from django.utils import timezone
import json

class Ask(models.Model):
    nickname = models.CharField(max_length=32, null=False, blank=False)
    authorip = models.CharField(max_length=16, null=False, blank=False, default="0.0.0.0")
    autagent = models.CharField(max_length=64, null=False, blank=False, default="unknown")
    que_time = models.DateTimeField(default=timezone.now)
    que_text = models.TextField(null=False, blank=False)
    ans_time = models.DateTimeField(null=True, blank=True)
    ans_text = models.TextField(null=True, blank =True)

    class Meta:
        db_table = 't_ask'
        indexes = [
            models.Index(fields=['que_time'], name='idx_que_time')
        ]

    def __str__(self):
        s_que_time = self.que_time.astimezone(timezone.get_current_timezone()).strftime("%Y-%m-%d %H:%M")
        s_ans_time = self.ans_time.astimezone(timezone.get_current_timezone()).strftime("%Y-%m-%d %H:%M") if self.ans_time else "null"
        s_ans_text = self.ans_text if self.ans_time else "null"
        ret = {
            "author": self.nickname,
            "q_time": s_que_time,
            "q_text": self.que_text,
            "a_time": s_ans_time,
            "a_text": s_ans_text
        }
        return json.dumps(ret)
