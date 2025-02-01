from rest_framework import serializers
from .models import Payment

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ['id', 'user', 'order','amount', 'payment_method', 'payment_status', 'transaction_id', 'payment_date', 'updated_at']

    # def validate(self, data):
    #     if data['payment_method'] == 'ONLINE' and not data.get('transaction_id'):
    #         raise serializers.ValidationError("Transaction ID is required for online payment.")
    #     return data
