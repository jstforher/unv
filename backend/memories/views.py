"""
API views for the memories app.
"""
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
from django.shortcuts import get_object_or_404

from .models import Memory, SiteSettings
from .serializers import (
    MemorySerializer, MemoryCreateUpdateSerializer,
    SiteSettingsSerializer, SecretRevealSerializer
)
from .permissions import IsAdminUserOrReadOnly


class MemoryViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Memory objects with different access levels.
    - Public: List and retrieve non-secret memories
    - Admin: Full CRUD operations
    """
    queryset = Memory.objects.all()
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['category', 'is_featured', 'date']
    parser_classes = [MultiPartParser, FormParser]

    def get_serializer_class(self):
        """Return appropriate serializer based on action."""
        if self.action in ['create', 'update', 'partial_update']:
            return MemoryCreateUpdateSerializer
        return MemorySerializer

    def get_permissions(self):
        """Return appropriate permissions based on action."""
        if self.action in ['create', 'update', 'partial_update', 'destroy', 'upload']:
            permission_classes = [permissions.IsAuthenticated, IsAdminUserOrReadOnly]
        else:
            permission_classes = [IsAdminUserOrReadOnly]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        """Filter queryset based on user access level."""
        request = self.request
        queryset = Memory.objects.all()

        # Public users can only see non-secret memories
        if not request.user.is_authenticated or not request.user.is_staff:
            queryset = queryset.filter(is_secret=False)

        # Handle ordering
        order_by = self.request.query_params.get('order_by', '-created_at')
        if order_by in ['created_at', '-created_at', 'date', '-date', 'order', '-order']:
            queryset = queryset.order_by(order_by)

        return queryset.select_related()

    @action(detail=False, methods=['post'], url_path='upload')
    def upload(self, request):
        """
        Handle file uploads for memory media.
        This endpoint is admin-only and handles large file uploads.
        """
        if 'file' not in request.FILES:
            return Response(
                {'error': 'No file provided'},
                status=status.HTTP_400_BAD_REQUEST
            )

        file = request.FILES['file']
        media_type = request.data.get('media_type', 'image')

        # Validate file type
        allowed_extensions = {
            'image': ['jpg', 'jpeg', 'png', 'gif'],
            'video': ['mp4', 'mov'],
            'audio': ['mp3', 'wav']
        }

        if media_type not in allowed_extensions:
            return Response(
                {'error': f'Invalid media type: {media_type}'},
                status=status.HTTP_400_BAD_REQUEST
            )

        file_ext = file.name.split('.')[-1].lower()
        if file_ext not in allowed_extensions[media_type]:
            return Response(
                {'error': f'File extension .{file_ext} not allowed for {media_type} files'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Validate file size (10MB limit)
        if file.size > 10 * 1024 * 1024:
            return Response(
                {'error': 'File size cannot exceed 10MB'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Here you would typically save the file and return the URL
        # For now, we'll return a mock response
        return Response({
            'message': 'File uploaded successfully',
            'media_type': media_type,
            'filename': file.name,
            'size': file.size,
            'media_url': f'/media/temp/{file.name}'  # Temporary URL
        })

    @action(detail=False, methods=['post'], url_path='secret-reveal')
    def secret_reveal(self, request):
        """
        Reveal secret memories using a one-time token.
        This is the special endpoint for accessing hidden memories.
        """
        serializer = SecretRevealSerializer(data=request.data)
        if serializer.is_valid():
            token = serializer.validated_data['token']

            try:
                settings = SiteSettings.get_settings()
                if str(settings.secret_reveal_token) != str(token):
                    return Response(
                        {'error': 'Invalid token'},
                        status=status.HTTP_403_FORBIDDEN
                    )

                if settings.secret_reveal_used:
                    return Response(
                        {'error': 'Token already used'},
                        status=status.HTTP_403_FORBIDDEN
                    )

                # Mark token as used
                settings.secret_reveal_used = True
                settings.save()

                # Get secret memories
                secret_memories = Memory.objects.filter(is_secret=True)
                serializer = MemorySerializer(
                    secret_memories,
                    many=True,
                    context={'request': request, 'reveal_access': True}
                )

                return Response({
                    'message': 'Secret memories revealed',
                    'memories': serializer.data
                })

            except SiteSettings.DoesNotExist:
                return Response(
                    {'error': 'Settings not configured'},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'], url_path='featured')
    def featured(self, request):
        """Get featured memories for highlighting in the universe."""
        featured_memories = self.get_queryset().filter(is_featured=True)
        if not featured_memories.exists():
            # If no featured memories, return the 5 most recent
            featured_memories = self.get_queryset().order_by('-created_at')[:5]

        serializer = self.get_serializer(featured_memories, many=True)
        return Response(serializer.data)


class SiteSettingsViewSet(viewsets.ModelViewSet):
    """
    ViewSet for SiteSettings.
    - Public: Read-only access to basic settings
    - Admin: Full CRUD access
    """
    serializer_class = SiteSettingsSerializer
    queryset = SiteSettings.objects.all()

    def get_permissions(self):
        """Return appropriate permissions based on action."""
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
        else:
            permission_classes = [permissions.AllowAny]
        return [permission() for permission in permission_classes]

    def list(self, request):
        """Get current site settings (singleton pattern)."""
        settings = SiteSettings.get_settings()
        serializer = self.get_serializer(settings)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        """Retrieve is not applicable for singleton settings."""
        return self.list(request)