from django.contrib import admin
from django.utils.html import format_html
from dev_sistema_escolar_api.models import *


@admin.register(Administradores)
@admin.register(Alumnos)
@admin.register(Maestros)

class ProfilesAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "creation", "update")
    search_fields = ("user__username", "user__email", "user__first_name", "user__last_name")


@admin.register(EventoAcademico)
class EventoAcademicoAdmin(admin.ModelAdmin):
    list_display = ("id", "titulo", "fecha_evento", "publico_objetivo", "cupo_maximo", "modalidad")
    search_fields = ("titulo", "programa_educativo", "sede")
    list_filter = ("publico_objetivo", "modalidad", "fecha_evento")


@admin.register(EventoRegistro)
class EventoRegistroAdmin(admin.ModelAdmin):
    list_display = ("id", "evento", "user", "confirmado", "creation")
    search_fields = ("evento__titulo", "user__first_name", "user__last_name", "user__email")
    list_filter = ("confirmado", "evento__fecha_evento")
