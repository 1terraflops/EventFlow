# Generated by Django 5.1.6 on 2025-03-01 15:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api_sigma', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='event',
            name='processed',
            field=models.BooleanField(default=False),
        ),
    ]
