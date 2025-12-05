import re
from datetime import date, datetime, time

from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import generics, permissions, status
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.views import APIView

from dev_sistema_escolar_api.models import EventoAcademico, EventoRegistro
from dev_sistema_escolar_api.serializers import (
    EventoAcademicoSerializer,
    EventoRegistroSerializer,
)


class EventosAll(generics.ListAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = EventoAcademicoSerializer

    def get_queryset(self):
        return EventoAcademico.objects.all().order_by("fecha_evento", "hora_inicio")

    def list(self, request, *args, **kwargs):
        queryset = list(
            self.get_queryset().prefetch_related("registros", "registros__user")
        )
        serializer = self.get_serializer(queryset, many=True)
        data = serializer.data
        user = request.user if request.user.is_authenticated else None

        for item, evento in zip(data, queryset):
            total = evento.registros.count()
            item["total_asistentes"] = total
            item["cupos_disponibles"] = max(evento.cupo_maximo - total, 0)
            if user:
                registro = evento.registros.filter(user=user).first()
                item["inscrito"] = registro is not None
                item["confirmado"] = registro.confirmado if registro else False
                item["registro_id"] = registro.id if registro else None
            else:
                item["inscrito"] = False
                item["confirmado"] = False
                item["registro_id"] = None

        return Response(data, status=status.HTTP_200_OK)


class EventosView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    TEXT_PATTERN = re.compile(r"^[0-9A-Za-zÁÉÍÓÚáéíóúñÑüÜ ,.()#/-]+$")

    PROGRAMAS_EDUCATIVOS = {
        "alumnos": [
            "Ingeniería en Ciencias de la Computación",
            "Matemáticas Aplicadas",
            "Física Educativa",
            "Ingeniería en Electrónica",
        ],
        "maestros": [
            "Maestría en Docencia Universitaria",
            "Maestría en Tecnologías de la Información",
            "Doctorado en Ciencias",
        ],
        "administradores": [
            "Gestión Educativa",
            "Administración Pública",
            "Transformación Digital",
        ],
        "publico_general": [
            "Educación Continua",
            "Divulgación Científica",
            "Actualización Profesional",
        ],
    }

    MODALIDADES_PERMITIDAS = {"presencial", "virtual", "hibrido"}

    def get(self, request, *args, **kwargs):
        evento_id = request.GET.get("id")
        evento = get_object_or_404(EventoAcademico, id=evento_id)
        serializer = EventoAcademicoSerializer(evento, many=False)
        data = serializer.data
        registros = evento.registros.select_related("user")
        data["total_asistentes"] = registros.count()
        data["cupos_disponibles"] = max(
            evento.cupo_maximo - data["total_asistentes"], 0
        )
        if request.user.is_authenticated:
            registro = registros.filter(user=request.user).first()
            data["inscrito"] = registro is not None
            data["confirmado"] = registro.confirmado if registro else False
            data["registro_id"] = registro.id if registro else None
        else:
            data["inscrito"] = False
            data["confirmado"] = False
            data["registro_id"] = None
        return Response(data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        data = self._validate_payload(request.data)
        evento = EventoAcademico.objects.create(
            **data,
            creado_por=request.user if request.user.is_authenticated else None,
        )
        serializer = EventoAcademicoSerializer(evento, many=False)
        return Response(
            {"message": "Evento creado correctamente", "evento": serializer.data},
            status=status.HTTP_201_CREATED,
        )

    def put(self, request, *args, **kwargs):
        evento_id = request.data.get("id")
        evento = get_object_or_404(EventoAcademico, id=evento_id)
        data = self._validate_payload(request.data, instance=evento)

        for field, value in data.items():
            setattr(evento, field, value)
        evento.save()

        serializer = EventoAcademicoSerializer(evento, many=False)
        return Response(
            {"message": "Evento actualizado correctamente", "evento": serializer.data},
            status=status.HTTP_200_OK,
        )

    def delete(self, request, *args, **kwargs):
        evento_id = request.GET.get("id")
        evento = get_object_or_404(EventoAcademico, id=evento_id)
        evento.delete()
        return Response({"message": "Evento eliminado correctamente"}, status=200)

    def _validate_payload(self, data, instance=None):
        errors = {}
        validated = {}

        titulo = (data.get("titulo") or "").strip()
        if not titulo:
            errors["titulo"] = "El título es requerido."
        elif len(titulo) > 150:
            errors["titulo"] = "El título debe tener máximo 150 caracteres."
        elif not self.TEXT_PATTERN.match(titulo):
            errors["titulo"] = "El título solo puede contener letras, números y .,-/#"
        else:
            validated["titulo"] = titulo

        descripcion = (data.get("descripcion") or "").strip()
        if descripcion and len(descripcion) > 600:
            errors["descripcion"] = "La descripción debe ser menor a 600 caracteres."
        else:
            validated["descripcion"] = descripcion

        sede = (data.get("sede") or "").strip()
        if not sede:
            errors["sede"] = "La sede es requerida."
        elif len(sede) > 255:
            errors["sede"] = "La sede debe tener máximo 255 caracteres."
        elif not self.TEXT_PATTERN.match(sede):
            errors["sede"] = "La sede solo puede contener letras, números y .,-/#"
        else:
            validated["sede"] = sede

        publico = (data.get("publico_objetivo") or "").strip()
        if publico not in self.PROGRAMAS_EDUCATIVOS:
            errors["publico_objetivo"] = "El público objetivo no es válido."
        else:
            validated["publico_objetivo"] = publico

        programa = (data.get("programa_educativo") or "").strip()
        if not programa:
            errors["programa_educativo"] = "Selecciona un programa educativo."
        elif publico and programa not in self.PROGRAMAS_EDUCATIVOS.get(publico, []):
            errors["programa_educativo"] = (
                "El programa educativo no coincide con el público objetivo seleccionado."
            )
        else:
            validated["programa_educativo"] = programa

        fecha_evento = self._parse_date(
            data.get("fecha_evento") or getattr(instance, "fecha_evento", None),
            errors,
        )
        if fecha_evento:
            if fecha_evento < date.today():
                errors["fecha_evento"] = "La fecha del evento no puede ser pasada."
            else:
                validated["fecha_evento"] = fecha_evento

        hora_inicio = self._parse_time(
            data.get("hora_inicio") or getattr(instance, "hora_inicio", None),
            "hora_inicio",
            errors,
        )
        hora_fin = self._parse_time(
            data.get("hora_fin") or getattr(instance, "hora_fin", None),
            "hora_fin",
            errors,
        )
        if hora_inicio and hora_fin:
            inicio_dt = datetime.combine(date.today(), hora_inicio)
            fin_dt = datetime.combine(date.today(), hora_fin)
            if inicio_dt >= fin_dt:
                errors["hora_fin"] = "La hora de fin debe ser mayor a la de inicio."
            else:
                validated["hora_inicio"] = hora_inicio
                validated["hora_fin"] = hora_fin

        cupo = data.get("cupo_maximo")
        cupo = cupo if cupo is not None else getattr(instance, "cupo_maximo", None)
        try:
            cupo = int(cupo)
            if cupo <= 0:
                errors["cupo_maximo"] = "El cupo debe ser mayor a cero."
            elif cupo > 10000:
                errors["cupo_maximo"] = "El cupo máximo permitido es 10000."
            else:
                validated["cupo_maximo"] = cupo
        except (TypeError, ValueError):
            errors["cupo_maximo"] = "Ingresa un cupo válido."

        modalidad = (data.get("modalidad") or "").strip().lower()
        if modalidad not in self.MODALIDADES_PERMITIDAS:
            errors["modalidad"] = "La modalidad proporcionada no es válida."
        else:
            validated["modalidad"] = modalidad

        if errors:
            raise ValidationError(errors)

        return validated

    def _parse_date(self, value, errors):
        if value in [None, ""]:
            errors["fecha_evento"] = "La fecha del evento es obligatoria."
            return None

        if isinstance(value, date):
            return value

        try:
            return datetime.strptime(str(value)[0:10], "%Y-%m-%d").date()
        except (ValueError, TypeError):
            errors["fecha_evento"] = "Formato de fecha inválido. Usa AAAA-MM-DD."
            return None

    def _parse_time(self, value, field_name, errors):
        if value in [None, ""]:
            errors[field_name] = "La hora es obligatoria."
            return None

        if isinstance(value, time):
            return value

        str_value = str(value)
        for fmt in ("%H:%M", "%H:%M:%S"):
            try:
                return datetime.strptime(str_value, fmt).time()
            except ValueError:
                continue

        errors[field_name] = "Formato de hora inválido. Usa HH:MM."
        return None


class EventoRegistroView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request, *args, **kwargs):
        if not self._is_admin(request.user):
            return Response(
                {"detail": "Solo los administradores pueden consultar asistentes."},
                status=status.HTTP_403_FORBIDDEN,
            )
        evento_id = request.GET.get("evento_id")
        evento = get_object_or_404(EventoAcademico, id=evento_id)
        registros = (
            EventoRegistro.objects.filter(evento=evento)
            .select_related("user")
            .order_by("user__first_name", "user__last_name")
        )
        serializer = EventoRegistroSerializer(registros, many=True)
        return Response(
            {"evento": evento.titulo, "registros": serializer.data}, status=200
        )

    def post(self, request, *args, **kwargs):
        evento_id = request.data.get("evento_id")
        evento = get_object_or_404(EventoAcademico, id=evento_id)

        if not self._user_puede_registrarse(request.user):
            return Response(
                {"detail": "Solo alumnos y maestros pueden registrar asistencia."},
                status=status.HTTP_403_FORBIDDEN,
            )

        if evento.registros.count() >= evento.cupo_maximo:
            return Response(
                {"detail": "El cupo del evento ya está completo."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        registro, created = EventoRegistro.objects.get_or_create(
            evento=evento, user=request.user
        )
        if not created:
            return Response(
                {"detail": "Ya estás registrado en este evento."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = EventoRegistroSerializer(registro, many=False)
        return Response(
            {"message": "Registro exitoso", "registro": serializer.data},
            status=status.HTTP_201_CREATED,
        )

    def delete(self, request, *args, **kwargs):
        evento_id = request.GET.get("evento_id")
        evento = get_object_or_404(EventoAcademico, id=evento_id)
        registro = EventoRegistro.objects.filter(
            evento=evento, user=request.user
        ).first()
        if not registro:
            return Response(
                {"detail": "No estás registrado en este evento."},
                status=status.HTTP_404_NOT_FOUND,
            )
        registro.delete()
        return Response({"message": "Registro cancelado correctamente"}, status=200)

    def patch(self, request, *args, **kwargs):
        if not self._is_admin(request.user):
            return Response(
                {"detail": "Solo los administradores pueden confirmar asistencia."},
                status=status.HTTP_403_FORBIDDEN,
            )

        registro_id = request.data.get("registro_id")
        confirmado = request.data.get("confirmado")
        if registro_id is None or confirmado is None:
            return Response(
                {"detail": "registro_id y confirmado son requeridos."}, status=400
            )

        registro = get_object_or_404(EventoRegistro, id=registro_id)
        registro.confirmado = self._to_bool(confirmado)
        registro.confirmado_en = timezone.now() if registro.confirmado else None
        registro.save()
        serializer = EventoRegistroSerializer(registro, many=False)
        return Response(
            {"message": "Asistencia actualizada", "registro": serializer.data}, status=200
        )

    def _is_admin(self, user):
        return user.groups.filter(name="administrador").exists()

    def _user_puede_registrarse(self, user):
        return user.groups.filter(name__in=["alumno", "maestro"]).exists()

    def _to_bool(self, value):
        if isinstance(value, bool):
            return value
        if isinstance(value, str):
            return value.strip().lower() in ["true", "1", "si", "yes"]
        return bool(value)
