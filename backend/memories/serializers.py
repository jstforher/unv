"""
Serializers for the memories app API.
"""
from rest_framework import serializers
from .models import Memory, SiteSettings


class MemorySerializer(serializers.ModelSerializer):
    """Serializer for Memory objects."""
    thumbnail_url = serializers.ReadOnlyField()
    is_accessible_publicly = serializers.ReadOnlyField()

    class Meta:
        model = Memory
        fields = [
            'id', 'title', 'caption', 'media_url', 'media_type',
            'position_x', 'position_y', 'position_z', 'orbit_radius',
            'is_secret', 'is_featured', 'category', 'date', 'order',
            'thumbnail_url', 'is_accessible_publicly', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'thumbnail_url', 'is_accessible_publicly']

    def validate_media_url(self, value):
        """Validate media file size and type."""
        if value.size > 10 * 1024 * 1024:  # 10MB limit
            raise serializers.ValidationError("File size cannot exceed 10MB.")
        return value

    def to_representation(self, instance):
        """Custom representation to hide secret memory data from public access."""
        data = super().to_representation(instance)

        # If this is a secret memory and user doesn't have admin access, hide sensitive data
        if instance.is_secret and not self._is_admin_access():
            return {
                'id': instance.id,
                'title': "Secret Memory",
                'caption': "This memory is hidden and requires special access to view.",
                'is_secret': True,
                'thumbnail_url': '/static/images/secret-thumbnail.png',
                'is_accessible_publicly': False
            }

        return data

    def _is_admin_access(self):
        """Check if current request has admin access."""
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return False
        return request.user.is_staff or request.user.is_superuser


class MemoryCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer for creating and updating memories (admin only)."""

    class Meta:
        model = Memory
        fields = [
            'title', 'caption', 'media_url', 'media_type',
            'position_x', 'position_y', 'position_z', 'orbit_radius',
            'is_secret', 'is_featured', 'category', 'date', 'order'
        ]

    def validate_media_url(self, value):
        """Validate media file size and type."""
        if value.size > 10 * 1024 * 1024:  # 10MB limit
            raise serializers.ValidationError("File size cannot exceed 10MB.")
        return value

    def validate(self, data):
        """Validate the complete memory data."""
        # Ensure position coordinates are reasonable
        for coord in ['position_x', 'position_y', 'position_z']:
            if coord in data and abs(data[coord]) > 100:
                raise serializers.ValidationError(f"{coord} must be between -100 and 100.")

        return data


class SiteSettingsSerializer(serializers.ModelSerializer):
    """Serializer for SiteSettings."""

    class Meta:
        model = SiteSettings
        fields = [
            'music_url', 'rotation_speed', 'show_particles',
            'theme_colors', 'updated_at'
        ]
        read_only_fields = ['updated_at']

    def to_representation(self, instance):
        """Custom representation for public API."""
        data = super().to_representation(instance)
        # Don't expose secret reveal token in public API
        if 'secret_reveal_token' in data:
            del data['secret_reveal_token']
        return data


class SecretRevealSerializer(serializers.Serializer):
    """Serializer for secret reveal requests."""
    token = serializers.UUIDField(required=True)

    def validate_token(self, value):
        """Validate the secret reveal token."""
        try:
            settings = SiteSettings.get_settings()
            if not settings.secret_reveal_token or str(settings.secret_reveal_token) != str(value):
                raise serializers.ValidationError("Invalid or expired token.")

            if settings.secret_reveal_used:
                raise serializers.ValidationError("This token has already been used.")

            return value
        except SiteSettings.DoesNotExist:
            raise serializers.ValidationError("Settings not configured.")