from django.contrib import admin
from .models import *
admin.site.register(Cart)
admin.site.register(Order)
admin.site.register(OrderItem)
admin.site.register(TrackDelivery)
# Register your models here.
