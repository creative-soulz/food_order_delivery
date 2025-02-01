from django.db import models

# Create your models here.
class Food(models.Model):
    CATEGORY_CHOICES = [
        ('veg', 'Vegetarian'),
        ('non_veg', 'Non-Vegetarian'),
    ]
    name = models.CharField(max_length=100)
    url = models.URLField(max_length=200,null=True,blank=True)
    description = models.TextField(null=True, blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    available = models.BooleanField(default=True)
    category = models.CharField(max_length=10, choices=CATEGORY_CHOICES)
    def __str__(self):
        return f"{self.name} ({self.get_category_display()})"
