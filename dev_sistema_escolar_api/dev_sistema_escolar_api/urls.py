from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path

from dev_sistema_escolar_api.views import alumnos, auth, bootstrap, maestros, users, eventos

from .views.bootstrap import VersionView

urlpatterns = [
    path("django-admin/", admin.site.urls),
    # API Endpoints
    # Create Admin
    path("admin/", users.AdminView.as_view()),
    # Admin Data
    path("lista-admins/", users.AdminAll.as_view()),
    # Total Users
    path("total-usuarios/", users.TotalUsers.as_view()),
    # Create Alumno
    path("alumnos/", alumnos.AlumnosView.as_view()),
    # Alumno Data
    path("lista-alumnos/", alumnos.AlumnosAll.as_view()),
    # Create Maestro
    path("maestros/", maestros.MaestrosView.as_view()),
    # Maestro Data
    path("lista-maestros/", maestros.MaestrosAll.as_view()),
    # Eventos académicos
    path("eventos-academicos/", eventos.EventosView.as_view()),
    path("lista-eventos-academicos/", eventos.EventosAll.as_view()),
    path("eventos-academicos/registro/", eventos.EventoRegistroView.as_view()),
    # Login
    path("login/", auth.CustomAuthToken.as_view()),
    # Logout
    path("logout/", auth.Logout.as_view()),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
