from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('dev_sistema_escolar_api', '0006_alter_eventoacademico_id'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='EventoRegistro',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('confirmado', models.BooleanField(default=False)),
                ('confirmado_en', models.DateTimeField(blank=True, null=True)),
                ('creation', models.DateTimeField(auto_now_add=True, blank=True, null=True)),
                ('update', models.DateTimeField(auto_now=True, blank=True, null=True)),
                ('evento', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='registros', to='dev_sistema_escolar_api.eventoacademico')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='eventos_registrados', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Registro de evento',
                'verbose_name_plural': 'Registros de evento',
            },
        ),
        migrations.AlterUniqueTogether(
            name='eventoregistro',
            unique_together={('evento', 'user')},
        ),
    ]
