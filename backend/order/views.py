from rest_framework import viewsets,serializers
from rest_framework.permissions import IsAuthenticated
from .models import Cart, Order, TrackDelivery, OrderItem
from .serializers import CartSerializer, OrderSerializer, TrackDeliverySerializer
from users.permissions import IsAdminUser, IsCustomerUser, IsDeliveryManUser
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.pagination import PageNumberPagination
from datetime import date,datetime

from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils import timezone
from datetime import timedelta

# Pagination settings for Cart items
class CartPagination(PageNumberPagination):
    page_size = 10  # Items per page
    page_size_query_param = 'page_size'
    max_page_size = 100  # Limit for the maximum page size

class TrackDeliveryPagination(PageNumberPagination):
    page_size = 5  # Adjust this value for custom page size
    page_size_query_param = 'page_size'
    max_page_size = 100


# Cart ViewSet
class CartViewSet(viewsets.ModelViewSet):
    queryset = Cart.objects.all()
    serializer_class = CartSerializer
    permission_classes = [IsAuthenticated]  # Ensure the user is authenticated
    pagination_class = CartPagination
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['user_id']  # Allow filtering by user_id

    def get_queryset(self):
        """Ensure that each user only sees their own cart."""
        queryset = super().get_queryset()
        user_id = self.request.user.id
        return queryset.filter(user_id=user_id)

    def perform_create(self, serializer):
        """Ensure the cart item is associated with the authenticated user."""
        serializer.save(user=self.request.user)


# Order ViewSet
class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        """Set different permissions based on action and user role."""
        if self.action in ['list', 'retrieve','delete']:
            if self.request.user.role == 'admin':
                self.permission_classes = [IsAuthenticated, IsAdminUser | IsDeliveryManUser]
            else:
                self.permission_classes = [IsAuthenticated, IsCustomerUser]
        elif self.action == 'create':
            self.permission_classes = [IsAuthenticated, IsCustomerUser]  # Only customers can create orders
        return super().get_permissions()

    def get_queryset(self):
        """Admin can see all orders, while customers can only see their own."""
        if self.request.user.role == 'admin':
            return Order.objects.all()  # Admin can view all orders
        return Order.objects.filter(user=self.request.user)  # Customers can view only their own orders

def perform_create(self, serializer):
    """Handle cart items transfer to OrderItem, clear cart, and calculate total cost."""
    user = self.request.user
    cart_items = Cart.objects.filter(user=user)
    
    if not cart_items.exists():
        raise serializers.ValidationError("Cart is empty. Please add items to your cart before placing an order.")
    
    # Calculate the total cost for the entire order
    total_order_cost = 0
    
    # Create the order without committing to the database yet
    order = serializer.save(user=user)  # Saves the order instance, but doesn't commit total_cost yet
    
    # Create OrderItems from Cart and calculate the total cost
    for cart_item in cart_items:
        # Calculate the total cost for each cart item
        item_total_cost = cart_item.food_item.price * cart_item.quantity
        total_order_cost += item_total_cost  # Accumulate the total order cost
        
        # Create OrderItem linked to the order
        OrderItem.objects.create(
            order=order,
            food_item=cart_item.food_item,
            quantity=cart_item.quantity,
            total_cost=item_total_cost  # Save calculated cost to each OrderItem
        )
    
    # Set the total cost for the order and save the order again
    order.total_cost = total_order_cost
    order.save()

    # Clear the cart after placing the order
    cart_items.delete()


# TrackDelivery ViewSet
class TrackDeliveryViewSet(viewsets.ModelViewSet):
    queryset = TrackDelivery.objects.all()
    serializer_class = TrackDeliverySerializer
    permission_classes = [IsAuthenticated]
    pagination_class = TrackDeliveryPagination

    def get_permissions(self):
        """Set different permissions based on action and user role."""
        if self.action in ['list', 'retrieve']:
            self.permission_classes = [IsAuthenticated, IsDeliveryManUser | IsCustomerUser | IsAdminUser]
        elif self.action in ['update', 'partial_update']:
            # Only delivery men or customers can update the status
            self.permission_classes = [IsAuthenticated, IsDeliveryManUser | IsCustomerUser | IsAdminUser]
        return super().get_permissions()

    def get_queryset(self):
        """Define queryset based on user roles: admin, customer, and delivery man."""
        user = self.request.user

        if user.role == 'admin':
            # Admin can view all delivery tracking entries
            return TrackDelivery.objects.all()
        
        elif user.role == 'delivery_man':
            # Delivery man can view only their assigned deliveries
            return TrackDelivery.objects.filter(delivery_man=user)

        # Customers can only view their own order tracking
        return TrackDelivery.objects.filter(order__user=user)
    def perform_update(self, serializer):
        """Override perform_update to update delivery_date if status is delivered."""
        instance = serializer.instance
        new_status = serializer.validated_data.get('status', None)

        # Check if status is updated to 'delivered'
        if new_status == 'delivered' and instance.status != 'delivered':
            # Set delivery_date to today if it's being marked as delivered
            serializer.validated_data['delivery_date'] =  datetime.combine(date.today(), datetime.min.time())

        serializer.save()
    @action(detail=False, methods=['get'], url_path='stats')
    def get_order_stat(self, request, *args, **kwargs):
        # Get today's date and calculate the date 7 days ago
        today = timezone.now()
        seven_days_ago = today - timedelta(days=7)

        # Total orders in the last 7 days
        total_orders_last_7_days = Order.objects.filter(ordered_at__gte=seven_days_ago).count()
        
        # Total orders
        total_orders = Order.objects.count()
        
        # Total pending orders
        pending_orders = TrackDelivery.objects.filter(status='pending').count()
        
        # Total canceled orders
        canceled_orders = TrackDelivery.objects.filter(status='cancelled').count()

        # Total delivered orders
        delivered_orders = TrackDelivery.objects.filter(status='delivered').count()

        # Return the statistics
        data = {
            'total_orders': total_orders,
            'total_orders_last_7_days': total_orders_last_7_days,
            'pending_orders': pending_orders,
            'canceled_orders': canceled_orders,
            'delivered_orders': delivered_orders,
        }
        return Response(data)