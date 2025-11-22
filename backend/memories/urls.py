"""
URL configuration for memories app.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# Create a router and register our viewsets
router = DefaultRouter()
router.register(r'memories', views.MemoryViewSet, basename='memory')
router.register(r'settings', views.SiteSettingsViewSet, basename='sitesettings')

# Wire up our API using automatic URL routing.
urlpatterns = [
    path('', include(router.urls)),
]