"""
Serializers for user authentication.
"""
from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token


class UserSerializer(serializers.ModelSerializer):
    """Serializer for User objects."""
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'is_staff']
        read_only_fields = ['id', 'is_staff']


class LoginSerializer(serializers.Serializer):
    """Serializer for user login."""
    username = serializers.CharField(max_length=150)
    password = serializers.CharField(max_length=128, write_only=True)
    remember = serializers.BooleanField(default=False)

    def validate(self, data):
        """Validate credentials and return user info."""
        username = data.get('username')
        password = data.get('password')

        if username and password:
            user = authenticate(username=username, password=password)
            if not user:
                raise serializers.ValidationError('Invalid credentials')
            if not user.is_active:
                raise serializers.ValidationError('User account is disabled')
            if not user.is_staff:
                raise serializers.ValidationError('Access denied. Admin privileges required.')

            data['user'] = user
            return data
        else:
            raise serializers.ValidationError('Must include username and password')


class LoginResponseSerializer(serializers.Serializer):
    """Serializer for login response."""
    user = UserSerializer(read_only=True)
    token = serializers.CharField(read_only=True)
    session_id = serializers.CharField(read_only=True)


class LogoutSerializer(serializers.Serializer):
    """Serializer for logout - can be empty."""
    pass