# Generated by Django 5.1.7 on 2025-04-24 06:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('mod_iamyukino', '0003_alter_ask_table'),
    ]

    operations = [
        migrations.AddField(
            model_name='ask',
            name='authorip',
            field=models.CharField(default='0.0.0.0', max_length=16),
        ),
    ]
