import json

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


class MaestrosAll(generics.ListAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = MaestroSerializer

    def get_queryset(self):
        return Maestros.objects.filter(user__is_active=1).order_by("id")

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        lista = serializer.data

        for maestro in lista:
            if isinstance(maestro, dict) and "materias_json" in maestro:
                try:
                    maestro["materias_json"] = json.loads(maestro["materias_json"])
                except Exception:
                    maestro["materias_json"] = []

        return Response(lista, 200)


class MaestrosView(APIView):
    def get_permissions(self):
        if self.request.method in ["GET", "PUT", "DELETE"]:
            return [permissions.IsAuthenticated()]
        return []

    # Obtener maestro por ID
    def get(self, request, *args, **kwargs):
        maestro = get_object_or_404(Maestros, id=request.GET.get("id"))
        maestro_data = MaestroSerializer(maestro, many=False).data
        materias = maestro_data.get("materias_json")
        if isinstance(materias, str):
            try:
                maestro_data["materias_json"] = json.loads(materias)
            except Exception:
                maestro_data["materias_json"] = []
        elif materias is None:
            maestro_data["materias_json"] = []
        return Response(maestro_data, 200)

    # Registrar nuevo maestro
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

            maestro = Maestros.objects.create(
                user=user,
                id_trabajador=request.data["id_trabajador"],
                fecha_nacimiento=request.data["fecha_nacimiento"],
                telefono=request.data["telefono"],
                rfc=request.data["rfc"].upper(),
                cubiculo=request.data["cubiculo"],
                area_investigacion=request.data["area_investigacion"],
                materias_json=json.dumps(request.data["materias_json"]),
            )
            maestro.save()
            return Response({"maestro_created_id": maestro.id}, 201)

        return Response(user.errors, status=status.HTTP_400_BAD_REQUEST)

    @transaction.atomic
    def put(self, request, *args, **kwargs):
        maestro = get_object_or_404(Maestros, id=request.data.get("id"))
        maestro.id_trabajador = request.data.get("id_trabajador", maestro.id_trabajador)
        maestro.fecha_nacimiento = request.data.get("fecha_nacimiento", maestro.fecha_nacimiento)
        maestro.telefono = request.data.get("telefono", maestro.telefono)
        maestro.rfc = request.data.get("rfc", maestro.rfc).upper()
        maestro.cubiculo = request.data.get("cubiculo", maestro.cubiculo)
        maestro.area_investigacion = request.data.get("area_investigacion", maestro.area_investigacion)
        materias = request.data.get("materias_json", [])
        if isinstance(materias, str):
            try:
                materias = json.loads(materias)
            except Exception:
                materias = []
        maestro.materias_json = json.dumps(materias)
        maestro.save()

        user = maestro.user
        user.first_name = request.data.get("first_name", user.first_name)
        user.last_name = request.data.get("last_name", user.last_name)
        user.save()

        maestro_data = MaestroSerializer(maestro, many=False).data
        try:
            maestro_data["materias_json"] = json.loads(maestro_data.get("materias_json", "[]"))
        except Exception:
            maestro_data["materias_json"] = []

        return Response(
            {"message": "Maestro actualizado correctamente", "maestro": maestro_data},
            200,
        )

    # Eliminar maestro
    @transaction.atomic
    def delete(self, request, *args, **kwargs):
        maestro = get_object_or_404(Maestros, id=request.GET.get("id"))
        try:
            maestro.user.delete()
            return Response({"details": "Maestro eliminado"}, 200)
        except Exception as e:
            return Response({"details": "Algo pasó al eliminar"}, 400)
