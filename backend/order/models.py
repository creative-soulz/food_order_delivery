from django.db import models
from django.contrib.auth import get_user_model
from food.models import Food

class Cart(models.Model):
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
    food_item = models.ForeignKey(Food, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    total_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    def save(self, *args, **kwargs):
        self.total_cost = self.food_item.price * self.quantity
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Cart - {self.user.username} - {self.food_item.name}"

class OrderItem(models.Model):
    order = models.ForeignKey('Order', related_name='order_items', on_delete=models.CASCADE)
    food_item = models.ForeignKey(Food, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    total_cost = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.food_item.name} (x{self.quantity})"

class Order(models.Model):
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
    total_cost = models.DecimalField(max_digits=10, decimal_places=2,null=False, default=0.0)
    ordered_at = models.DateTimeField(auto_now_add=True)
        
    def calculate_total(self):
        total = sum([item.total_cost for item in self.order_items.all()])
        self.total_cost = total
        self.save()

    def __str__(self):
        return f"Order - {self.user.username} - Total: {self.total_cost}"

class TrackDelivery(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
    ]
    
    order = models.ForeignKey('Order', on_delete=models.CASCADE)
    delivery_man = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, limit_choices_to={'role': 'delivery_man'}, null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    delivery_date = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Order {self.order.id} - Status: {self.status}"
