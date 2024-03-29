from rest_framework import serializers
from .models import MapState

class MapStateSerializer(serializers.ModelSerializer):
    class Meta:
        model = MapState
        fields = ['id', 'name', 'data', 'user']
        read_only_fields = ('user',)