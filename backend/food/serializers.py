from rest_framework import serializers
from .models import Food

class FoodSerializer(serializers.ModelSerializer):
    class Meta:
        model = Food
        fields = ['id', 'name','url', 'description', 'price', 'available', 'category']


    def validate_name(self, value):
        if len(value) < 3:
            raise serializers.ValidationError("The name must be at least 3 characters long.")
        return value

    
    def validate_price(self, value):
        if value <= 0:
            raise serializers.ValidationError("The price must be greater than 0.")
        return value


    def validate(self, data):
        if data['available'] and data['price'] <= 0:
            raise serializers.ValidationError("Available food must have a positive price.")
        return data