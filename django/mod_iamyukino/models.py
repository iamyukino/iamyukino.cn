from django.db import models
from django.utils import timezone

class Ask(models.Model):
    username = models.CharField(max_length=32)
    time = models.DateTimeField(auto_now_add=True)
    site = models.CharField(max_length=128, null=True, blank=True)
    content = models.TextField(null=True, blank=True)

    class Meta:
        indexes = [
            models.Index(fields=['time'], name='idx_time')
        ]

    def __str__(self):
        beijing_time = self.time.astimezone(timezone.get_current_timezone())
        formatted_time = beijing_time.strftime("%Y-%m-%d %H:%M:%S")  # 添加时区偏移
        
        ret = {
            "username": self.username,
            "time": formatted_time,
            "site": self.site,
            "content": self.content
        }
        return str(ret)
