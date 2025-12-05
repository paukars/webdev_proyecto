import json
from datetime import date

from django.contrib.auth.models import Group
from django.db import transaction
from django.db.models import *
from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from dev_sistema_escolar_api.models import *
from dev_sistema_escolar_api.serializers import *
from dev_sistema_escolar_api.serializers import UserSerializer


class AdminAll(generics.ListAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = AdminSerializer

    def get_queryset(self):
        return Administradores.objects.filter(user__is_active=1).order_by("id")


class AdminView(APIView):
    # Permisos por método
    def get_permissions(self):
        if self.request.method in ["GET", "PUT", "DELETE"]:
            return [permissions.IsAuthenticated()]
        return []  # POST no requiere autenticación

    # Obtener usuario por ID
    def get(self, request, *args, **kwargs):
        admin = get_object_or_404(Administradores, id=request.GET.get("id"))
        admin = AdminSerializer(admin, many=False).data
        return Response(admin, 200)

    # Registrar nuevo usuario
    @transaction.atomic
    def post(self, request, *args, **kwargs):
        user = UserSerializer(data=request.data)

        if user.is_valid():
            role = request.data["rol"]
            first_name = request.data["first_name"]
            last_name = request.data["last_name"]
            email = request.data["email"]
            password = request.data["password"]

            existing_user = User.objects.filter(email=email).first()
            if existing_user:
                return Response(
                    {"message": "Username " + email + ", is already taken"}, 400
                )

            user = User.objects.create(
                username=email,
                email=email,
                first_name=first_name,
                last_name=last_name,
                is_active=1,
            )
            user.save()
            user.set_password(password)
            user.save()

            group, created = Group.objects.get_or_create(name=role)
            group.user_set.add(user)
            user.save()

            admin = Administradores.objects.create(
                user=user,
                clave_admin=request.data["clave_admin"],
                telefono=request.data["telefono"],
                rfc=request.data["rfc"].upper(),
                edad=request.data["edad"],
                ocupacion=request.data["ocupacion"],
            )
            admin.save()

            return Response({"admin_created_id": admin.id}, 201)

        return Response(user.errors, status=status.HTTP_400_BAD_REQUEST)

    # Actualizar datos del administrador
    @transaction.atomic
    def put(self, request, *args, **kwargs):
        admin = get_object_or_404(Administradores, id=request.data["id"])
        admin.clave_admin = request.data["clave_admin"]
        admin.telefono = request.data["telefono"]
        admin.rfc = request.data["rfc"]
        admin.edad = request.data["edad"]
        admin.ocupacion = request.data["ocupacion"]
        admin.save()

        user = admin.user
        user.first_name = request.data["first_name"]
        user.last_name = request.data["last_name"]
        user.save()

        return Response(
            {
                "message": "Administrador actualizado correctamente",
                "admin": AdminSerializer(admin).data,
            },
            200,
        )

    # Eliminar administrador
    @transaction.atomic
    def delete(self, request, *args, **kwargs):
        admin = get_object_or_404(Administradores, id=request.GET.get("id"))
        try:
            admin.user.delete()
            return Response({"details": "Administrador eliminado"}, 200)
        except Exception as e:
            return Response({"details": "Algo pasó al eliminar"}, 400)


class TotalUsers(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request, *args, **kwargs):
        # TOTAL ADMINISTRADORES
        admin_qs = Administradores.objects.filter(user__is_active=True)
        total_admins = admin_qs.count()

        # TOTAL MAESTROS
        maestros_qs = Maestros.objects.filter(user__is_active=True)
        total_maestros = maestros_qs.count()

        # TOTAL ALUMNOS
        alumnos_qs = Alumnos.objects.filter(user__is_active=True)
        total_alumnos = alumnos_qs.count()

        promedio_admins = self._promedio_edad(admin_qs, fecha_field=None)
        promedio_maestros = self._promedio_edad(maestros_qs, fecha_field="fecha_nacimiento")
        promedio_alumnos = self._promedio_edad(alumnos_qs, fecha_field="fecha_nacimiento")

        return Response(
            {
                "admins": total_admins,
                "maestros": total_maestros,
                "alumnos": total_alumnos,
                "promedio_admins": promedio_admins,
                "promedio_maestros": promedio_maestros,
                "promedio_alumnos": promedio_alumnos,
            },
            status=200,
        )

    def _promedio_edad(self, queryset, fecha_field="fecha_nacimiento"):
        edades = [
            edad for edad in queryset.values_list("edad", flat=True)
            if edad is not None and edad > 0
        ]

        if not edades and fecha_field:
            for fecha in queryset.values_list(fecha_field, flat=True):
                if fecha:
                    if hasattr(fecha, "date"):
                        fecha = fecha.date()
                    hoy = date.today()
                    edad = hoy.year - fecha.year - (
                        (hoy.month, hoy.day) < (fecha.month, fecha.day)
                    )
                    if edad > 0:
                        edades.append(edad)

        if not edades:
            return 0

        return round(sum(edades) / len(edades), 1)
