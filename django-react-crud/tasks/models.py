from django.db import models
from user_api.models import AppUser

# Create your models here.
class Task(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    done = models.BooleanField(default=False)
    idUsuario = models.ForeignKey(AppUser, on_delete=models.CASCADE, to_field='email')
    def __str__(self):
        return self.title