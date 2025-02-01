from rest_framework import viewsets
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated,AllowAny
from .models import CustomUser
from .serializers import CustomUserSerializer, CustomTokenObtainPairSerializer
from .permissions import IsAdminUser, IsCustomerUser
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.views import TokenObtainPairView
from django_filters import rest_framework as filters

from rest_framework.decorators import action
from rest_framework.response import Response


# Token View for authentication
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

CustomUser = get_user_model()

# Custom pagination class
class CustomUserPagination(PageNumberPagination):
    page_size = 5  

# Define filter set for CustomUser
class CustomUserFilter(filters.FilterSet):
    username = filters.CharFilter(field_name="username", lookup_expr='icontains')
    email = filters.CharFilter(field_name="email", lookup_expr='icontains')
    role = filters.ChoiceFilter(choices=CustomUser.ROLE_CHOICES, field_name="role")

    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'role']

# ViewSet for CustomUser
class CustomUserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    pagination_class = CustomUserPagination
    filter_backends = [DjangoFilterBackend]
    filterset_class = CustomUserFilter  
    ordering = ['id']

    def get_permissions(self):
    # Allow anyone to register (create a user)
        if self.action == 'create':
            self.permission_classes = [AllowAny]
    #   Admins have permissions to create, update, and destroy users
        elif self.action in ['destroy', 'update', 'partial_update']:
            if self.request.user.is_authenticated and self.request.user.role == 'admin':
                self.permission_classes = [IsAdminUser]
            else:
                self.permission_classes = [IsAuthenticated]  # Regular users can update their profile
    # Restrict list and retrieve actions to authenticated users
        elif self.action in ['list', 'retrieve']:
            self.permission_classes = [IsAuthenticated]
    # Default permission
        else:
            self.permission_classes = [IsAuthenticated]

        return super().get_permissions()
    def create(self, request, *args, **kwargs):
        if 'role' not in request.data:
            request.data['role'] = 'customer'
        if request.user.is_authenticated and request.user.role != 'admin':
            request.data['role'] = 'customer'
        return super().create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        if not request.user.role == 'admin' and 'role' in request.data:
            request.data.pop('role')
        return super().update(request, *args, **kwargs)

    def get_queryset(self):
        if self.request.user.is_authenticated and self.request.user.role == 'admin':
            return super().get_queryset()
        return CustomUser.objects.filter(id=self.request.user.id)
    
    @action(detail=False, methods=['get'], permission_classes=[IsAdminUser])
    def stats(self, request):
        total_users = CustomUser.objects.count()  
        admin_users = CustomUser.objects.filter(role='admin').count()  
        customer_users = CustomUser.objects.filter(role='customer').count()  
        delivery_men = CustomUser.objects.filter(role='delivery_man').count()  

        return Response({
            'total_users': total_users,
            'admin_users': admin_users,
            'customer_users': customer_users,
            'delivery_men': delivery_men
        })