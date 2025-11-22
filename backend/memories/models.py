"""
Models for the memories app.
"""
import uuid
import os
from django.db import models
from django.core.validators import FileExtensionValidator
from django.utils import timezone


def memory_media_path(instance, filename):
    """Generate path for memory media files."""
    ext = filename.split('.')[-1]
    filename = f'{uuid.uuid4()}.{ext}'
    return os.path.join('memories', str(instance.id), filename)


class Memory(models.Model):
    """Represents a romantic memory in the universe."""

    CATEGORY_CHOICES = [
        ('trip', 'Trip'),
        ('party', 'Party'),
        ('random', 'Random'),
        ('milestone', 'Milestone'),
    ]

    MEDIA_TYPE_CHOICES = [
        ('image', 'Image'),
        ('video', 'Video'),
        ('audio', 'Audio'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=120)
    caption = models.TextField(help_text="Describe this special memory")

    # Media fields
    media_url = models.FileField(
        upload_to=memory_media_path,
        validators=[FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png', 'gif', 'mp4', 'mov', 'mp3', 'wav'])],
        help_text="Upload an image, video, or audio file"
    )
    media_type = models.CharField(
        max_length=10,
        choices=MEDIA_TYPE_CHOICES,
        default='image'
    )

    # 3D positioning for universe
    position_x = models.FloatField(
        default=0.0,
        help_text="X coordinate in 3D space"
    )
    position_y = models.FloatField(
        default=0.0,
        help_text="Y coordinate in 3D space"
    )
    position_z = models.FloatField(
        default=0.0,
        help_text="Z coordinate in 3D space"
    )
    orbit_radius = models.FloatField(
        null=True,
        blank=True,
        help_text="Optional orbital radius for movement"
    )

    # Memory classification
    is_secret = models.BooleanField(
        default=False,
        help_text="Hidden from public view, requires special access"
    )
    is_featured = models.BooleanField(
        default=False,
        help_text="Show prominently in the universe"
    )
    category = models.CharField(
        max_length=20,
        choices=CATEGORY_CHOICES,
        default='random'
    )

    # Metadata
    date = models.DateField(
        null=True,
        blank=True,
        help_text="When this memory occurred"
    )
    order = models.PositiveIntegerField(
        default=0,
        help_text="Order for featured memories display"
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['category', 'is_featured']),
            models.Index(fields=['date']),
            models.Index(fields=['order']),
            models.Index(fields=['is_secret']),
        ]

    def __str__(self):
        return f"{self.title} ({self.get_category_display()})"

    @property
    def thumbnail_url(self):
        """Return thumbnail URL for the memory."""
        if self.media_type == 'image':
            return self.media_url.url
        # For video/audio, return a placeholder or default thumbnail
        return '/static/images/default-thumbnail.png'

    @property
    def is_accessible_publicly(self):
        """Check if memory can be accessed without special permissions."""
        return not self.is_secret


class SiteSettings(models.Model):
    """Global site configuration."""

    id = models.PositiveIntegerField(primary_key=True)

    # Background music
    music_url = models.URLField(
        blank=True,
        help_text="URL for background music file"
    )

    # Universe settings
    rotation_speed = models.FloatField(
        default=3.0,
        help_text="Camera auto-rotation speed (degrees per second)"
    )
    show_particles = models.BooleanField(
        default=True,
        help_text="Show particle effects in the universe"
    )

    # Theme colors (JSON field for flexibility)
    theme_colors = models.JSONField(
        default=dict,
        blank=True,
        help_text="Theme color configuration"
    )

    # Secret reveal settings
    secret_reveal_token = models.UUIDField(
        null=True,
        blank=True,
        help_text="One-time token for secret memory access"
    )
    secret_reveal_used = models.BooleanField(
        default=False,
        help_text="Whether the secret reveal token has been used"
    )

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'site_settings'
        verbose_name_plural = 'Site Settings'

    def __str__(self):
        return "Site Settings"

    @classmethod
    def get_settings(cls):
        """Get or create the singleton settings instance."""
        settings, created = cls.objects.get_or_create(id=1, defaults={
            'theme_colors': {
                'bg_primary': '#0b1020',
                'bg_secondary': '#1a1f3a',
                'accent_primary': '#9b6cff',
                'accent_secondary': '#ff6b8a',
                'accent_star': '#f6f7ff',
                'glass_bg': 'rgba(255, 255, 255, 0.06)',
                'text_primary': '#ffffff',
                'text_secondary': '#b8b8d1',
            }
        })
        return settings