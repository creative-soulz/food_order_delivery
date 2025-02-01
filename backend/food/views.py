from django.shortcuts import render
# Create your views here.
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.pagination import PageNumberPagination
from .models import Food
from .serializers import FoodSerializer
from users.permissions import *


from rest_framework.decorators import action
from rest_framework.response import Response

# Pagination class
class FoodPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100


class FoodViewSet(viewsets.ModelViewSet):
    queryset = Food.objects.all()
    serializer_class = FoodSerializer
    pagination_class = FoodPagination
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['name', 'category','available']  
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = [IsAdminUser]
        return [permission() for permission in permission_classes]




    @action(detail=False, methods=['get'], url_path='stats')
    def get_food_stats(self, request):
        # Count the total, available, and unavailable foods
        total_foods = Food.objects.count()
        available_foods = Food.objects.filter(available=True).count()
        unavailable_foods = Food.objects.filter(available=False).count()

        # Count vegetarian and non-vegetarian foods
        vegetarian_foods = Food.objects.filter(category='veg').count()
        non_vegetarian_foods = Food.objects.filter(category='non_veg').count()

        # Prepare the response data
        stats_data = {
            'total_foods': total_foods,
            'available_foods': available_foods,
            'unavailable_foods': unavailable_foods,
            'vegetarian_foods': vegetarian_foods,
            'non_vegetarian_foods': non_vegetarian_foods,
        }

        return Response(stats_data)