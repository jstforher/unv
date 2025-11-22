"""
Custom permissions for the memories app.
"""
from rest_framework import permissions


class IsAdminUserOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow admin users to write.
    Read access is allowed for any request.
    """

    def has_permission(self, request, view):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True

        # Write permissions are only allowed to admin users.
        return request.user and request.user.is_authenticated and request.user.is_staff


class CanAccessSecretMemories(permissions.BasePermission):
    """
    Custom permission for accessing secret memories.
    Requires either admin status or valid reveal token.
    """

    def has_permission(self, request, view):
        # Admin users can always access secrets
        if request.user and request.user.is_authenticated and request.user.is_staff:
            return True

        # Check for valid reveal token in the request
        reveal_token = request.data.get('reveal_token') or request.query_params.get('reveal_token')
        if not reveal_token:
            return False

        try:
            from .models import SiteSettings
            settings = SiteSettings.get_settings()
            return (
                settings.secret_reveal_token and
                str(settings.secret_reveal_token) == str(reveal_token) and
                not settings.secret_reveal_used
            )
        except:
            return False

    def has_object_permission(self, request, view, obj):
        """
        Return True if the given memory is not secret or user has access.
        """
        # If memory is not secret, allow access
        if not obj.is_secret:
            return True

        # For secret memories, use the same logic as has_permission
        return self.has_permission(request, view)