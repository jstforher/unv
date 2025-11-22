"""
Admin configuration for memories app.
"""
from django.contrib import admin
from .models import Memory, SiteSettings


@admin.register(Memory)
class MemoryAdmin(admin.ModelAdmin):
    list_display = [
        'title', 'category', 'media_type', 'is_featured',
        'is_secret', 'date', 'created_at'
    ]
    list_filter = [
        'category', 'media_type', 'is_featured', 'is_secret', 'date'
    ]
    search_fields = ['title', 'caption']
    readonly_fields = ['id', 'created_at', 'updated_at']

    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'caption', 'category')
        }),
        ('Media', {
            'fields': ('media_url', 'media_type')
        }),
        ('3D Positioning', {
            'fields': ('position_x', 'position_y', 'position_z', 'orbit_radius'),
            'classes': ('collapse',)
        }),
        ('Classification', {
            'fields': ('is_featured', 'is_secret', 'date', 'order')
        }),
        ('Metadata', {
            'fields': ('id', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def get_queryset(self, request):
        return super().get_queryset(request).select_related()


@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    list_display = ['updated_at']
    readonly_fields = ['id', 'updated_at']

    fieldsets = (
        ('Music', {
            'fields': ('music_url',)
        }),
        ('Universe Settings', {
            'fields': ('rotation_speed', 'show_particles')
        }),
        ('Theme Colors', {
            'fields': ('theme_colors',),
            'description': 'JSON object with theme color values'
        }),
        ('Secret Reveal', {
            'fields': ('secret_reveal_token', 'secret_reveal_used'),
            'classes': ('collapse',)
        }),
        ('Metadata', {
            'fields': ('id', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def has_add_permission(self, request):
        # Only allow one instance of SiteSettings
        return not SiteSettings.objects.exists()

    def has_delete_permission(self, request, obj=None):
        # Prevent deletion of the settings object
        return False