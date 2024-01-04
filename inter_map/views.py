from django.http import HttpResponse
from rest_framework import viewsets
from .models import MapState
from .serializers import MapStateSerializer
from django.shortcuts import render, redirect
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import login
from django.contrib.auth.decorators import login_required
from rest_framework.permissions import IsAuthenticated

# Create your views here.

# ViewSet for MapState
class MapStateViewSet(viewsets.ModelViewSet):
    serializer_class = MapStateSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # This will return map states for the logged-in user
        user = self.request.user
        return MapState.objects.filter(user=user)

    def perform_create(self, serializer):
        # This will save the map state for the logged-in user
        serializer.save(user=self.request.user)

# Simple view for the home page
def home(request):
    return HttpResponse("Welcome to My Interactive Map App!")

def register(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect('home')  # Redirect to home page
    else:
        form = UserCreationForm()
    return render(request, 'registration/register.html', {'form': form})

@login_required
def dashboard(request):
    return render(request, 'dashboard.html')

@login_required
def profile(request):
    return render(request, 'profile.html')

def map_view(request):
    return render(request, 'index.html')