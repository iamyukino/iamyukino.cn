from django.db import models

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
        ret = {
            "username" : self.username,
            "time" : str(self.time),
            "site" : self.site,
            "content" : self.content
        }
        return str(ret)
