# Sistema Escolar (Django + Angular)

Aplicación full-stack que gestiona usuarios (administradores, maestros, alumnos) y eventos académicos. Incluye autenticación, inscripciones a eventos con cupos y confirmación de asistencia, así como paneles de edición y gráficas informativas.

## Arquitectura
- **Backend:** Django + Django REST Framework. Provee CRUD para usuarios y eventos, manejo de tokens y validaciones de datos.
- **Base de datos:** MySQL (local y PythonAnywhere).
- **Frontend:** Angular 16, Angular Material, Bootstrap y Chart.js.
- **Infraestructura:** Servicios desplegados en PythonAnywhere (API/DB) y SPA servida como estático (`/frontend/`).

## Estructura del repositorio
```
proyecto_final/
├── dev_sistema_escolar_api/        # Código Django
│   ├── dev_sistema_escolar_api/    # settings, urls, views, serializers, models
│   ├── static/                     # recursos admin/DRF
│   ├── manage.py
│   └── requirements.txt
├── dev-sistema-escolar-webapp/     # Código Angular
│   ├── src/
│   ├── angular.json
│   └── package.json
└── README.md
```

## Backend Django
1. Crear virtualenv e instalar dependencias:
   ```bash
   cd dev_sistema_escolar_api
   python3 -m venv .venv
   source .venv/bin/activate
   pip install -r requirements.txt
   ```
2. Configurar `DATABASES` en `dev_sistema_escolar_api/settings.py` (SQLite o MySQL). Se usan campos como:
   ```python
   DATABASES = {
       'default': {
           'ENGINE': 'django.db.backends.mysql',
           'NAME': 'paukars$sistema_escolar',
           'USER': 'paukars',
           'PASSWORD': '***',
           'HOST': 'paukars.mysql.pythonanywhere-services.com',
           'PORT': '3306',
           'OPTIONS': {'charset': 'utf8mb4'}
       }
   }
   STATIC_URL = '/static/'
   STATIC_ROOT = BASE_DIR / 'staticfiles'
   STATICFILES_DIRS = [BASE_DIR / 'static']
   ALLOWED_HOSTS = ["localhost", "127.0.0.1", "paukars.pythonanywhere.com"]
   ```
3. Migraciones y superusuario:
   ```bash
   python manage.py migrate
   python manage.py createsuperuser
   python manage.py collectstatic
   ```
4. Ejecución local:
   ```bash
   python manage.py runserver
   ```

## API principal (resumen)
- `/login/`, `/logout/`: autenticación y cierre de sesión.
- `/lista-admins/`, `/lista-maestros/`, `/lista-alumnos/`: listados.
- `/admin/`, `/maestros/`, `/alumnos/`: creación/actualización/eliminación según rol.
- `/total-usuarios/`: conteo y promedio de edad por rol.
- `/lista-eventos-academicos/`: devuelve eventos, cupos, asistentes y estado de inscripción.
- `/eventos-academicos/`: CRUD de eventos (con validaciones de fechas, horarios, cupos).
- `/eventos-academicos/registro/`: registro/cancelación de asistencia; admins confirman asistencia vía `PATCH`.

## Frontend Angular
1. Instalación y compilación:
   ```bash
   cd dev-sistema-escolar-webapp
   npm install
   npm run build -- --base-href /frontend/
   ```
2. Estructura destacada:
   - `src/app/screens/login-screen`: inicio de sesión.
   - `src/app/screens/maestros-screen`, `alumnos-screen`, `admin-screen`: listados y CRUD.
   - `src/app/screens/eventos-academicos-screen`: tabla de eventos, registro/cancelación y modal de asistentes.
   - `src/app/screens/graficas-screen`: gráficas de usuarios y eventos.
   - `src/app/partials/registro-*`: formularios reutilizables para admins, maestros, alumnos, eventos.
   - `src/app/services/*.ts`: capa de servicios (HTTP) contra la API Django.
3. Variables de entorno (`src/environments/*.ts`):
   ```ts
   export const environment = {
     production: true,
     url_api: 'https://paukars.pythonanywhere.com'
   };
   ```

## Flujo principal
1. Usuario accede a `/frontend/`, inicia sesión y se guardan cookies/token.
2. El menú lateral muestra opciones según rol (admin, maestro, alumno).
3. Módulos de usuarios permiten registrar/editar/eliminar registros.
4. Eventos académicos:
   - Listado con cupo disponible.
   - Alumnos/Maestros se inscriben o cancelan.
   - Admin crea/edita eventos y confirma asistencia vía modal.
5. Pantalla de gráficas consulta `/total-usuarios/` y `/lista-eventos-academicos/` para mostrar estadísticas (usuarios por rol, eventos por público, asistentes por evento, edad promedio).

## Despliegue en PythonAnywhere
1. Subir `dev_sistema_backend.zip` y `dev_sistema_frontend.zip`.
2. Descomprimir backend en `/home/paukars/dev_sistema_escolar_api` y frontend en `/home/paukars/dev-sistema-escolar-webapp`.
3. Crear virtualenv `~/.virtualenvs/devsistema`, instalar dependencias, migrar y collectstatic.
4. Configurar web app (Python 3.10):
   - Código: `/home/paukars/dev_sistema_escolar_api`
   - Virtualenv: `/home/paukars/.virtualenvs/devsistema`
   - WSGI: apuntar a `dev_sistema_escolar_api.wsgi`
   - Static entries:
     - `/static/` → `/home/paukars/dev_sistema_escolar_api/staticfiles`
     - `/frontend/` → `/home/paukars/dev-sistema-escolar-webapp`
     - `/assets/` → `/home/paukars/assets` (subcarpeta con fuentes e imágenes)
5. Importar base de datos (opcional):
   ```bash
   mysqldump -u root -p dev_sistema_escolar_db > dev_sistema_dump.sql
   scp dev_sistema_dump.sql paukars@ssh.pythonanywhere.com:/home/paukars/
   mysql -u paukars -p -h paukars.mysql.pythonanywhere-services.com 'paukars$sistema_escolar' < dev_sistema_dump.sql
   ```
6. Click “Reload” en la pestaña Web.

## Documentación adicional
- `DOCUMENTACION_PROYECTO.txt` en la raíz resume arquitectura, servicios y flujos.
- Capturas recomendadas: login, listados, formulario de eventos, modal de asistentes, panel de gráficas.

## Créditos
- Equipo responsable del curso de Desarrollo Web.
- Tecnologías: Django 5, DRF, Angular 16, Bootstrap, Chart.js, MySQL.

