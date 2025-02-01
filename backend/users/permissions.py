from rest_framework.permissions import BasePermission

class IsAdminUser(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'admin'


class IsDeliveryManUser(BasePermission):
 
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'delivery_man'


class IsCustomerUser(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'customer'
