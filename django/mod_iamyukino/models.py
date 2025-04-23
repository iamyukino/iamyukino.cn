from django.db import models
from django.utils import timezone
import json

class Ask(models.Model):
    nickname = models.CharField(max_length=32, null=False, blank=False)
    que_time = models.DateTimeField(default=timezone.now)
    que_text = models.TextField(null=False, blank=False, default="no-content")
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
            "nickname": self.nickname,
            "que_time": s_que_time,
            "que_text": self.que_text,
            "ans_time": s_ans_time,
            "ans_text": s_ans_text
        }
        return json.dumps(ret)
