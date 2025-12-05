from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('dev_sistema_escolar_api', '0004_alter_administradores_options_alter_alumnos_options_and_more'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='EventoAcademico',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('titulo', models.CharField(max_length=150)),
                ('descripcion', models.TextField(blank=True, null=True)),
                ('sede', models.CharField(max_length=255)),
                ('publico_objetivo', models.CharField(choices=[('alumnos', 'Alumnos'), ('maestros', 'Maestros'), ('administradores', 'Administradores'), ('publico_general', 'Público general')], default='alumnos', max_length=32)),
                ('programa_educativo', models.CharField(max_length=150)),
                ('fecha_evento', models.DateField()),
                ('hora_inicio', models.TimeField()),
                ('hora_fin', models.TimeField()),
                ('cupo_maximo', models.PositiveIntegerField()),
                ('modalidad', models.CharField(choices=[('presencial', 'Presencial'), ('virtual', 'Virtual'), ('hibrido', 'Híbrido')], default='presencial', max_length=20)),
                ('creation', models.DateTimeField(auto_now_add=True, blank=True, null=True)),
                ('update', models.DateTimeField(auto_now=True, blank=True, null=True)),
                ('creado_por', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='eventos_creados', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Evento académico',
                'verbose_name_plural': 'Eventos académicos',
                'ordering': ('fecha_evento', 'hora_inicio'),
            },
        ),
    ]
