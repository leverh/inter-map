from django.contrib import admin
from django.urls import path, include  

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('inter_map.urls')),
    path('', include('inter_map.urls')),
    path('accounts/', include('django.contrib.auth.urls')),
]
