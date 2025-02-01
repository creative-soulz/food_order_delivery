from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Payment, Order
from .serializers import PaymentSerializer
from users.permissions import IsCustomerUser, IsDeliveryManUser, IsAdminUser
from order.models import TrackDelivery
from rest_framework.pagination import PageNumberPagination



from django.utils import timezone
from datetime import timedelta
from django.db.models import Sum
from rest_framework.decorators import action
from rest_framework.response import Response

class PaymentPagination(PageNumberPagination):
    page_size = 10  # Set page size to 10 or any value
    page_size_query_param = 'page_size'
    max_page_size = 100

class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    pagination_class = PaymentPagination
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'update', 'partial_update']:
            self.permission_classes = [IsAuthenticated, IsAdminUser | IsCustomerUser | IsDeliveryManUser]
        elif self.action == 'create':
            self.permission_classes = [IsAuthenticated, IsCustomerUser]  
        return super().get_permissions()

    def get_queryset(self):
        """Show relevant payments to delivery personnel, customers, or admins."""
        user = self.request.user
        if user.role == 'admin':
            # Admin can view all payments
            return Payment.objects.all()
        elif user.role == 'delivery_man':
            # Delivery man can view payments only for orders they are assigned to
            return Payment.objects.filter(
                order__trackdelivery__delivery_man=user, 
                payment_method='COD'
            )
        else:
            # Customers can view all their payments
            return Payment.objects.filter(user=user)

    def perform_create(self, serializer):
        """Create a payment object and add tracking entry for the order."""
        instance = serializer.save()

        # Check if the payment is in 'pending' or 'completed' status
        if instance.payment_status in ['PENDING', 'COMPLETED']:
            # Ensure no existing tracking entry for the order
            if not TrackDelivery.objects.filter(order=instance.order).exists():
                # Create a new TrackDelivery entry with the order and default status
                TrackDelivery.objects.create(
                    order=instance.order,
                    delivery_man=None,  # Initially no delivery man assigned
                    status='pending'  # Default status
                )
    @action(detail=False, methods=['get'], url_path='stats')
    def payment_stat(self, request):
        # Get total payments amount
        total_payments_amount = Payment.objects.aggregate(total_amount=Sum('amount'))['total_amount'] or 0
        
        # Get payments amount received in the last 7 days
        seven_days_ago = timezone.now() - timedelta(days=7)
        payments_last_7_days_amount = Payment.objects.filter(payment_date__gte=seven_days_ago).aggregate(total_amount=Sum('amount'))['total_amount'] or 0

        # Get pending payments amount
        pending_payments_amount = Payment.objects.filter(payment_status='PENDING').aggregate(total_amount=Sum('amount'))['total_amount'] or 0

        # Get completed payments amount
        completed_payments_amount = Payment.objects.filter(payment_status='COMPLETED').aggregate(total_amount=Sum('amount'))['total_amount'] or 0

        # Prepare response dat

        return Response({
            'total_payments_amount': total_payments_amount,
            'payments_last_7_days_amount': payments_last_7_days_amount,
            'pending_payments_amount': pending_payments_amount,
            'completed_payments_amount': completed_payments_amount,
        })