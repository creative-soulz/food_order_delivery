from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

CustomUser = get_user_model()

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims (user details) to the token
        token['username'] = user.username  
        token['address'] = user.address  
        token['phone_number'] = user.phone_number  
        token['email'] = user.email  
        token['id'] = user.id  
        token['role'] = user.role  

        return token

    def validate(self, attrs):
        data = super().validate(attrs)

        # Add user details to the response data after successful validation
        data['username'] = self.user.username  
        data['address'] = self.user.address  
        data['phone_number'] = self.user.phone_number  
        data['email'] = self.user.email  
        data['id'] = self.user.id  
        data['role'] = self.user.role  

        return data

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'phone_number', 'address', 'role', 'password']
        extra_kwargs = {
            'password': {'write_only': True}
        }
        
    def validate_role(self, value):
        request = self.context['request']

       
        if not request.user.is_authenticated:
            if value != 'customer':
                raise serializers.ValidationError("New users can only be registered as 'customer'.")
        
       
        elif request.user.role != 'admin' and value != 'customer':
            raise serializers.ValidationError("Only admins can assign roles other than 'customer'.")

        return value
    def validate_username(self, value):
        if self.instance:
            if CustomUser.objects.filter(username=value).exclude(pk=self.instance.pk).exists():
                raise serializers.ValidationError("Username already exists.")
        else:

            if CustomUser.objects.filter(username=value).exists():
                raise serializers.ValidationError("Username already exists.")
        return value

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            phone_number=validated_data.get('phone_number'),
            address=validated_data.get('address'),
            password=validated_data['password'],
            role=validated_data.get('role')
        )
        return user

    def update(self, instance, validated_data):
        instance.username = validated_data.get('username', instance.username)
        instance.email = validated_data.get('email', instance.email)
        instance.phone_number = validated_data.get('phone_number', instance.phone_number)
        instance.address = validated_data.get('address', instance.address)
        instance.role = validated_data.get('role', instance.role)
        
        password = validated_data.get('password', None)
        if password:
            instance.set_password(password)
        
        instance.save()
        return instance
