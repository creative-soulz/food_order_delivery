from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *

# Create a router and register the viewsets with it
router = DefaultRouter()

# Register the viewsets with their base name
router.register(r'cart', CartViewSet, basename='cart')
router.register(r'orders', OrderViewSet, basename='orders')
router.register(r'track-delivery', TrackDeliveryViewSet, basename='track-delivery')

# Wire up the API using the router
urlpatterns = [
    path('', include(router.urls)),  # This will automatically generate the routes for the viewsets
]
