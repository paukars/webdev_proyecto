from django.conf import settings
from django.contrib.auth.models import AbstractUser, User
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authentication import TokenAuthentication


class BearerTokenAuthentication(TokenAuthentication):
    keyword = "Bearer"


class Administradores(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, null=False, blank=False, default=None
    )
    clave_admin = models.CharField(max_length=255, null=True, blank=True)
    telefono = models.CharField(max_length=255, null=True, blank=True)
    rfc = models.CharField(max_length=255, null=True, blank=True)
    edad = models.IntegerField(null=True, blank=True)
    ocupacion = models.CharField(max_length=255, null=True, blank=True)
    creation = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    update = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return (
            f"Admin: {self.user.first_name} {self.user.last_name} ({self.clave_admin})"
        )

    class Meta:
        verbose_name = "Administrador"
        verbose_name_plural = "Administradores"


class Alumnos(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, null=False, blank=False, default=None
    )
    matricula = models.CharField(max_length=255, null=True, blank=True)
    curp = models.CharField(max_length=255, null=True, blank=True)
    rfc = models.CharField(max_length=255, null=True, blank=True)
    fecha_nacimiento = models.DateTimeField(auto_now_add=False, null=True, blank=True)
    edad = models.IntegerField(null=True, blank=True)
    telefono = models.CharField(max_length=255, null=True, blank=True)
    ocupacion = models.CharField(max_length=255, null=True, blank=True)
    creation = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    update = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return (
            f"Alumno: {self.user.first_name} {self.user.last_name} ({self.matricula})"
        )

    class Meta:
        verbose_name = "Alumno"
        verbose_name_plural = "Alumnos"


class Maestros(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, null=False, blank=False, default=None
    )
    id_trabajador = models.CharField(max_length=255, null=True, blank=True)
    fecha_nacimiento = models.DateTimeField(auto_now_add=False, null=True, blank=True)
    telefono = models.CharField(max_length=255, null=True, blank=True)
    rfc = models.CharField(max_length=255, null=True, blank=True)
    cubiculo = models.CharField(max_length=255, null=True, blank=True)
    edad = models.IntegerField(null=True, blank=True)
    area_investigacion = models.CharField(max_length=255, null=True, blank=True)
    materias_json = models.TextField(null=True, blank=True)
    creation = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    update = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Maestro: {self.user.first_name} {self.user.last_name} ({self.id_trabajador})"

    class Meta:
        verbose_name = "Maestro"
        verbose_name_plural = "Maestros"


class EventoAcademico(models.Model):
    PUBLICO_OBJETIVO = (
        ("alumnos", "Alumnos"),
        ("maestros", "Maestros"),
        ("administradores", "Administradores"),
        ("publico_general", "Público general"),
    )

    MODALIDADES = (
        ("presencial", "Presencial"),
        ("virtual", "Virtual"),
        ("hibrido", "Híbrido"),
    )

    id = models.BigAutoField(primary_key=True)
    titulo = models.CharField(max_length=150, null=False, blank=False)
    descripcion = models.TextField(null=True, blank=True)
    sede = models.CharField(max_length=255, null=False, blank=False)
    publico_objetivo = models.CharField(
        max_length=32, choices=PUBLICO_OBJETIVO, default="alumnos"
    )
    programa_educativo = models.CharField(max_length=150, null=False, blank=False)
    fecha_evento = models.DateField(null=False, blank=False)
    hora_inicio = models.TimeField(null=False, blank=False)
    hora_fin = models.TimeField(null=False, blank=False)
    cupo_maximo = models.PositiveIntegerField(null=False, blank=False)
    modalidad = models.CharField(
        max_length=20, choices=MODALIDADES, default="presencial"
    )
    creado_por = models.ForeignKey(
        User,
        related_name="eventos_creados",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
    )
    creation = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    update = models.DateTimeField(auto_now=True, null=True, blank=True)

    def __str__(self):
        return f"Evento: {self.titulo} ({self.fecha_evento})"

    class Meta:
        verbose_name = "Evento académico"
        verbose_name_plural = "Eventos académicos"
        ordering = ("fecha_evento", "hora_inicio")


class EventoRegistro(models.Model):
    id = models.BigAutoField(primary_key=True)
    evento = models.ForeignKey(
        EventoAcademico,
        on_delete=models.CASCADE,
        related_name="registros",
        null=False,
        blank=False,
    )
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="eventos_registrados",
        null=False,
        blank=False,
    )
    confirmado = models.BooleanField(default=False)
    confirmado_en = models.DateTimeField(null=True, blank=True)
    creation = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    update = models.DateTimeField(auto_now=True, null=True, blank=True)

    class Meta:
        unique_together = ("evento", "user")
        verbose_name = "Registro de evento"
        verbose_name_plural = "Registros de evento"

    def __str__(self):
        return f"{self.user.get_full_name()} - {self.evento.titulo}"
