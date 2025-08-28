from django.db import models

class Service(models.Model):
    ROLE_CHOICES = [
        ('boarding', 'Pet Boarding Facility'),
        ('sitter', 'Pet Sitter'),
    ]
    name = models.CharField(max_length=200)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    latitude = models.FloatField()
    longitude = models.FloatField()

    def __str__(self):
        return f"{self.name} ({self.role})"
