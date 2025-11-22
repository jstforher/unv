"""
User models - extending Django's default User model.
"""
from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    """Extended profile for User model."""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username}'s Profile"