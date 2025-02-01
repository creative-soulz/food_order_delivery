from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *
from .views import CustomTokenObtainPairView



router = DefaultRouter()
router.register(r'users', CustomUserViewSet, basename='user')


urlpatterns = [
    path('', include(router.urls)),
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    # path('stat/',)
]
