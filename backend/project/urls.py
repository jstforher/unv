"""
URL configuration for her_beautiful_universe project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse

def health_check(request):
    """Health check endpoint for load balancers."""
    return JsonResponse({'status': 'healthy'})

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('users.urls')),
    path('api/', include('memories.urls')),
    path('health/', health_check, name='health_check'),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)