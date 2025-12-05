#!/usr/bin/env python
"""
Script para poblar la base de datos con usuarios de prueba
Ejecutar desde la raíz del proyecto: python poblar_base_datos.py
"""
import json
import os
import random
import sys
from datetime import datetime, timedelta

import django

# Configurar Django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "dev_sistema_escolar_api.settings")
django.setup()

from django.contrib.auth.models import Group, User
from django.db import transaction

from dev_sistema_escolar_api.models import Administradores, Alumnos, Maestros

# Datos de prueba
NOMBRES = [
    "Juan",
    "María",
    "José",
    "Ana",
    "Luis",
    "Carmen",
    "Miguel",
    "Rosa",
    "Pedro",
    "Laura",
    "Carlos",
    "Elena",
    "Jorge",
    "Patricia",
    "Francisco",
    "Isabel",
    "Antonio",
    "Teresa",
    "Manuel",
    "Sofía",
    "Roberto",
    "Gabriela",
    "Fernando",
    "Valentina",
    "Ricardo",
    "Andrea",
    "Javier",
    "Diana",
    "Alejandro",
    "Mónica",
    "Daniel",
    "Lucía",
    "Raúl",
    "Carolina",
    "Sergio",
    "Martha",
    "Alberto",
    "Claudia",
    "Héctor",
    "Sandra",
    "Eduardo",
    "Verónica",
    "Pablo",
    "Beatriz",
    "Guillermo",
    "Natalia",
    "Arturo",
    "Julia",
    "Enrique",
    "Paola",
    "Rodrigo",
    "Adriana",
]

APELLIDOS = [
    "García",
    "Martínez",
    "López",
    "Hernández",
    "González",
    "Pérez",
    "Sánchez",
    "Ramírez",
    "Torres",
    "Flores",
    "Rivera",
    "Gómez",
    "Díaz",
    "Cruz",
    "Morales",
    "Reyes",
    "Jiménez",
    "Ruiz",
    "Álvarez",
    "Mendoza",
    "Castillo",
    "Ortiz",
    "Vargas",
    "Romero",
    "Silva",
]

AREAS_INVESTIGACION = [
    "Inteligencia Artificial",
    "Desarrollo Web",
    "Bases de Datos",
    "Redes de Computadoras",
    "Ciberseguridad",
    "Ingeniería de Software",
    "Desarrollo Móvil",
    "Computación en la Nube",
    "Machine Learning",
    "Análisis de Datos",
]

MATERIAS = [
    "Programación I",
    "Programación II",
    "Estructuras de Datos",
    "Algoritmos",
    "Bases de Datos I",
    "Bases de Datos II",
    "Aplicaciones Web",
    "Desarrollo Móvil",
    "Redes I",
    "Redes II",
    "Seguridad Informática",
    "Inteligencia Artificial",
    "Minería de Datos",
    "Ingeniería de Software",
    "Sistemas Operativos",
]

OCUPACIONES_ADMIN = [
    "Director",
    "Subdirector Académico",
    "Jefe de Departamento",
    "Coordinador de Servicios Escolares",
    "Coordinador Administrativo",
]

CUBICULOS = [
    "A-101",
    "A-102",
    "A-103",
    "A-104",
    "A-105",
    "B-201",
    "B-202",
    "B-203",
    "B-204",
    "B-205",
    "C-301",
    "C-302",
    "C-303",
    "C-304",
    "C-305",
]


def generar_fecha_nacimiento(edad_min, edad_max):
    """Genera una fecha de nacimiento basada en un rango de edad"""
    edad = random.randint(edad_min, edad_max)
    hoy = datetime.now()
    fecha_nac = hoy - timedelta(days=edad * 365)
    return fecha_nac.strftime("%Y-%m-%d")


def generar_telefono():
    """Genera un número de teléfono mexicano"""
    return f"(222) {random.randint(100, 999)}-{random.randint(1000, 9999)}"


def generar_rfc(nombre, apellido, fecha_nac):
    """Genera un RFC básico (no completamente válido, solo para pruebas)"""
    fecha = datetime.strptime(fecha_nac, "%Y-%m-%d")
    return f"{apellido[:4].upper()}{nombre[:2].upper()}{fecha.strftime('%y%m%d')}{''.join(random.choices('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', k=3))}"


def generar_curp(nombre, apellido, fecha_nac):
    """Genera un CURP básico (no completamente válido, solo para pruebas)"""
    fecha = datetime.strptime(fecha_nac, "%Y-%m-%d")
    sexo = random.choice(["H", "M"])
    return f"{apellido[:4].upper()}{nombre[:2].upper()}{fecha.strftime('%y%m%d')}{sexo}PL{''.join(random.choices('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', k=5))}"


def crear_usuario_base(nombre, apellido, email, password, rol):
    """Crea un usuario base en Django"""
    user = User.objects.create(
        username=email, email=email, first_name=nombre, last_name=apellido, is_active=1
    )
    user.set_password(password)
    user.save()

    # Asignar grupo/rol
    group, created = Group.objects.get_or_create(name=rol)
    group.user_set.add(user)
    user.save()

    return user


@transaction.atomic
def crear_administradores(cantidad=11):
    """Crea administradores de prueba"""
    print(f"\n{'='*60}")
    print(f"🔧 CREANDO {cantidad} ADMINISTRADORES")
    print(f"{'='*60}")

    nombres_usados = set()

    for i in range(cantidad):
        # Generar datos únicos
        while True:
            nombre = random.choice(NOMBRES)
            apellido = f"{random.choice(APELLIDOS)} {random.choice(APELLIDOS)}"
            nombre_completo = f"{nombre} {apellido}"
            if nombre_completo not in nombres_usados:
                nombres_usados.add(nombre_completo)
                break

        email = f"admin{i+1}@escuela.edu.mx"
        password = f"admin{i+1}123"
        edad = random.randint(30, 60)
        fecha_nac = generar_fecha_nacimiento(edad, edad)

        try:
            # Crear usuario
            user = crear_usuario_base(
                nombre, apellido, email, password, "administrador"
            )

            # Crear perfil de administrador
            admin = Administradores.objects.create(
                user=user,
                clave_admin=f"ADM{str(i+1).zfill(3)}",
                telefono=generar_telefono(),
                rfc=generar_rfc(nombre, apellido.split()[0], fecha_nac),
                edad=edad,
                ocupacion=random.choice(OCUPACIONES_ADMIN),
            )

            print(
                f"✅ Admin {i+1}: {nombre} {apellido} | {email} | Clave: ADM{str(i+1).zfill(3)}"
            )

        except Exception as e:
            print(f"❌ Error creando admin {i+1}: {str(e)}")

    print(f"\n✨ {cantidad} administradores creados exitosamente")


@transaction.atomic
def crear_maestros(cantidad=15):
    """Crea maestros de prueba"""
    print(f"\n{'='*60}")
    print(f"📚 CREANDO {cantidad} MAESTROS")
    print(f"{'='*60}")

    nombres_usados = set()

    for i in range(cantidad):
        # Generar datos únicos
        while True:
            nombre = random.choice(NOMBRES)
            apellido = f"{random.choice(APELLIDOS)} {random.choice(APELLIDOS)}"
            nombre_completo = f"{nombre} {apellido}"
            if nombre_completo not in nombres_usados:
                nombres_usados.add(nombre_completo)
                break

        email = f"maestro{i+1}@escuela.edu.mx"
        password = f"maestro{i+1}123"
        edad = random.randint(28, 65)
        fecha_nac = generar_fecha_nacimiento(edad, edad)

        # Seleccionar 2-4 materias aleatorias
        num_materias = random.randint(2, 4)
        materias_asignadas = random.sample(MATERIAS, num_materias)

        try:
            # Crear usuario
            user = crear_usuario_base(nombre, apellido, email, password, "maestro")

            # Crear perfil de maestro
            maestro = Maestros.objects.create(
                user=user,
                id_trabajador=f"MAE{str(i+1).zfill(3)}",
                fecha_nacimiento=fecha_nac,
                telefono=generar_telefono(),
                rfc=generar_rfc(nombre, apellido.split()[0], fecha_nac),
                cubiculo=random.choice(CUBICULOS),
                area_investigacion=random.choice(AREAS_INVESTIGACION),
                materias_json=json.dumps(materias_asignadas),
            )

            print(
                f"✅ Maestro {i+1}: {nombre} {apellido} | {email} | ID: MAE{str(i+1).zfill(3)}"
            )
            print(f"   📖 Materias: {', '.join(materias_asignadas)}")

        except Exception as e:
            print(f"❌ Error creando maestro {i+1}: {str(e)}")

    print(f"\n✨ {cantidad} maestros creados exitosamente")


@transaction.atomic
def crear_alumnos(cantidad=25):
    """Crea alumnos de prueba"""
    print(f"\n{'='*60}")
    print(f"🎓 CREANDO {cantidad} ALUMNOS")
    print(f"{'='*60}")

    nombres_usados = set()
    año_actual = datetime.now().year

    for i in range(cantidad):
        # Generar datos únicos
        while True:
            nombre = random.choice(NOMBRES)
            apellido = f"{random.choice(APELLIDOS)} {random.choice(APELLIDOS)}"
            nombre_completo = f"{nombre} {apellido}"
            if nombre_completo not in nombres_usados:
                nombres_usados.add(nombre_completo)
                break

        email = f"alumno{i+1}@escuela.edu.mx"
        password = f"alumno{i+1}123"
        edad = random.randint(18, 28)
        fecha_nac = generar_fecha_nacimiento(edad, edad)

        # Generar matrícula (año de ingreso + número consecutivo)
        año_ingreso = random.randint(año_actual - 4, año_actual)
        matricula = f"{año_ingreso}{str(random.randint(10000, 99999))}"

        try:
            # Crear usuario
            user = crear_usuario_base(nombre, apellido, email, password, "alumno")

            # Crear perfil de alumno
            alumno = Alumnos.objects.create(
                user=user,
                matricula=matricula,
                curp=generar_curp(nombre, apellido.split()[0], fecha_nac),
                rfc=generar_rfc(nombre, apellido.split()[0], fecha_nac),
                fecha_nacimiento=fecha_nac,
                edad=edad,
                telefono=generar_telefono(),
                ocupacion="Estudiante",
            )

            print(
                f"✅ Alumno {i+1}: {nombre} {apellido} | {email} | Matrícula: {matricula}"
            )

        except Exception as e:
            print(f"❌ Error creando alumno {i+1}: {str(e)}")

    print(f"\n✨ {cantidad} alumnos creados exitosamente")


def mostrar_resumen():
    """Muestra un resumen de los usuarios creados"""
    print(f"\n{'='*60}")
    print(f"📊 RESUMEN FINAL")
    print(f"{'='*60}")

    total_admins = Administradores.objects.filter(user__is_active=1).count()
    total_maestros = Maestros.objects.filter(user__is_active=1).count()
    total_alumnos = Alumnos.objects.filter(user__is_active=1).count()
    total_users = User.objects.filter(is_active=1).count()

    print(f"👥 Total de usuarios activos: {total_users}")
    print(f"   🔧 Administradores: {total_admins}")
    print(f"   📚 Maestros: {total_maestros}")
    print(f"   🎓 Alumnos: {total_alumnos}")

    print(f"\n{'='*60}")
    print(f"📝 CREDENCIALES DE ACCESO")
    print(f"{'='*60}")
    print(f"\n🔧 ADMINISTRADORES:")
    print(f"   Email: admin1@escuela.edu.mx")
    print(f"   Password: admin1123")
    print(f"   (admin2, admin3... hasta admin11 con mismo formato)")

    print(f"\n📚 MAESTROS:")
    print(f"   Email: maestro1@escuela.edu.mx")
    print(f"   Password: maestro1123")
    print(f"   (maestro2, maestro3... hasta maestro15 con mismo formato)")

    print(f"\n🎓 ALUMNOS:")
    print(f"   Email: alumno1@escuela.edu.mx")
    print(f"   Password: alumno1123")
    print(f"   (alumno2, alumno3... hasta alumno25 con mismo formato)")

    print(f"\n{'='*60}")


def main():
    """Función principal"""
    print(f"\n{'#'*60}")
    print(f"#  🚀 SCRIPT DE POBLACIÓN DE BASE DE DATOS")
    print(f"#  Sistema Escolar - Datos de Prueba")
    print(f"{'#'*60}")

    try:
        # Verificar que los grupos existan
        print("\n🔍 Verificando grupos de usuarios...")
        Group.objects.get_or_create(name="administrador")
        Group.objects.get_or_create(name="maestro")
        Group.objects.get_or_create(name="alumno")
        print("✅ Grupos verificados")

        # Crear usuarios
        crear_administradores(11)
        crear_maestros(15)
        crear_alumnos(25)

        # Mostrar resumen
        mostrar_resumen()

        print(f"\n{'='*60}")
        print(f"✨ PROCESO COMPLETADO EXITOSAMENTE ✨")
        print(f"{'='*60}\n")

    except Exception as e:
        print(f"\n❌ ERROR FATAL: {str(e)}")
        import traceback

        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()
