"""
Authentication views for admin access.
"""
from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import login, logout
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

from .serializers import LoginSerializer, LoginResponseSerializer, LogoutSerializer


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
@method_decorator(csrf_exempt, name='dispatch')
def login_view(request):
    """
    Admin login endpoint.
    Returns authentication token and user info.
    """
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data['user']

        # Create or get auth token
        token, created = Token.objects.get_or_create(user=user)

        # Log the user in (session auth)
        login(request, user)

        # Prepare response
        response_data = {
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'is_staff': user.is_staff
            },
            'token': token.key,
            'session_id': request.session.session_key
        }

        response_serializer = LoginResponseSerializer(response_data)

        return Response(response_serializer.data, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def logout_view(request):
    """
    Admin logout endpoint.
    Invalidates both token and session.
    """
    try:
        # Delete the auth token
        Token.objects.filter(user=request.user).delete()

        # Logout the session
        logout(request)

        return Response(
            {'message': 'Successfully logged out'},
            status=status.HTTP_200_OK
        )
    except Exception as e:
        return Response(
            {'error': 'Error during logout'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def profile_view(request):
    """
    Get current user profile information.
    """
    user = request.user
    return Response({
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'is_staff': user.is_staff,
        'is_active': user.is_active,
        'date_joined': user.date_joined,
        'last_login': user.last_login
    })