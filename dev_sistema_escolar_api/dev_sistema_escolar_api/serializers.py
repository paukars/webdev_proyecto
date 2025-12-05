from django.contrib.auth.models import User
from rest_framework import serializers
from dev_sistema_escolar_api.models import *

class UserSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)
    email = serializers.CharField(required=True)

    class Meta:
        model = User
        fields = ('id','first_name','last_name', 'email')

class AdminSerializer(serializers.ModelSerializer):
    user=UserSerializer(read_only=True)
    class Meta:
        model = Administradores
        fields = '__all__'
        
class AlumnoSerializer(serializers.ModelSerializer):
    user=UserSerializer(read_only=True)
    class Meta:
        model = Alumnos
        fields = "__all__"

class MaestroSerializer(serializers.ModelSerializer):
    user=UserSerializer(read_only=True)
    class Meta:
        model = Maestros
        fields = '__all__'

class EventoAcademicoSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventoAcademico
        fields = '__all__'

class EventoRegistroSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    rol = serializers.SerializerMethodField()

    class Meta:
        model = EventoRegistro
        fields = ('id', 'evento', 'user', 'rol', 'confirmado', 'confirmado_en', 'creation')

    def get_rol(self, obj):
        grupos = obj.user.groups.values_list('name', flat=True)
        return grupos[0] if grupos else ''
