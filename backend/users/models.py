from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('delivery_man', 'Delivery_man'),
        ('customer', 'Customer'),
    )
    role = models.CharField(max_length=15, choices=ROLE_CHOICES, default='customer')
    phone_number = models.CharField(max_length=15, unique=True)
    address = models.TextField(null=True, blank=True)
