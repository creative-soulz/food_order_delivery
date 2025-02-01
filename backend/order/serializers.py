from rest_framework import serializers
from .models import *
from food.models import *

class CartSerializer(serializers.ModelSerializer):
    total_cost = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    food_item_name = serializers.CharField(source='food_item.name', read_only=True)

    class Meta:
        model = Cart
        fields = ['id', 'user', 'food_item', 'quantity', 'total_cost', 'food_item_name']

    def validate_quantity(self, value):
        """Ensure the quantity is greater than 0."""
        if value <= 0:
            raise serializers.ValidationError("Quantity must be greater than 0.")
        return value

    def validate_food_item(self, value):
        """Ensure the food item exists and is available."""
        if not value.available:  # Assuming you have a flag like `is_available` in your `Food` model
            raise serializers.ValidationError("This food item is currently not available.")
        return value

    def create(self, validated_data):
        user = validated_data['user']
        food_item = validated_data['food_item']
        quantity = validated_data.get('quantity', 1)  # Default to 1 if quantity is not provided

        # Check if the cart item already exists
        existing_cart_item = Cart.objects.filter(user=user, food_item=food_item).first()
        
        if existing_cart_item:
            # If the item already exists in the cart, increase the quantity
            existing_cart_item.quantity += quantity
            existing_cart_item.total_cost = existing_cart_item.quantity * existing_cart_item.food_item.price
            existing_cart_item.save()

            # Return the updated cart item
            return existing_cart_item
        else:
            # Calculate total cost for the new item
            validated_data['total_cost'] = quantity * food_item.price
            return super().create(validated_data)

    # def validate(self, data):
        
    #     if Cart.objects.filter(user=data['user'], food_item=data['food_item']).exists():
    #         raise serializers.ValidationError("This item is already in the cart.")
    #     return data
    
class OrderItemSerializer(serializers.ModelSerializer):
    food_item_name = serializers.CharField(source='food_item.name', read_only=True)

    class Meta:
        model = OrderItem
        fields = ['food_item_name', 'quantity', 'total_cost']


class OrderSerializer(serializers.ModelSerializer):
    order_items = OrderItemSerializer(many=True, read_only=True)
    total_cost = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'user', 'order_items', 'total_cost', 'ordered_at']
    
    def validate(self, data):
        """Ensure that the cart is not empty before placing an order."""
        user = self.context['request'].user
        cart_items = Cart.objects.filter(user=user)
        if not cart_items.exists():
            raise serializers.ValidationError("You cannot place an order with an empty cart.")
        return data

    def create(self, validated_data):
        user = validated_data['user']
        cart_items = Cart.objects.filter(user=user)
        if not cart_items.exists():
            raise serializers.ValidationError("Cart is empty.")

        order = Order.objects.create(user=user)

        # Create OrderItem for each cart item
        for cart_item in cart_items:
            OrderItem.objects.create(
                order=order,
                food_item=cart_item.food_item,
                quantity=cart_item.quantity,
                total_cost=cart_item.total_cost,
            )

        # Calculate total cost for the order
        order.calculate_total()

        # Clear the cart after placing the order
        cart_items.delete()

        return order


class TrackDeliverySerializer(serializers.ModelSerializer):
    status = serializers.ChoiceField(choices=TrackDelivery.STATUS_CHOICES)
    delivery_man = serializers.PrimaryKeyRelatedField(queryset=get_user_model().objects.filter(role='delivery_man'))
    customer_username = serializers.CharField(source='order.user.username', read_only=True)
    customer_address = serializers.CharField(source='order.user.address', read_only=True)
   
    class Meta:
        model = TrackDelivery
        fields = ['id', 'order', 'delivery_man', 'status', 'delivery_date', "customer_username","customer_address"]

    def validate_status(self, value):
   
        if value not in ['pending', 'delivered', 'cancelled']:
            raise serializers.ValidationError("Invalid status. Choose either 'pending', 'delivered', or 'cancelled'.")
        return value

    # def validate(self, attrs):
    
    #     request_user = self.context['request'].user
    #     if request_user.role != 'delivery_man':
    #         raise serializers.ValidationError("Only delivery men can update the delivery status.")
    #     return attrs
