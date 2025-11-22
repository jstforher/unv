"""
Django management command to load seed data for Her Beautiful Universe.
"""
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.core.files.uploadedfile import SimpleUploadedFile
from django.utils.text import slugify
import json
import os


class Command(BaseCommand):
    help = 'Load seed data for Her Beautiful Universe'

    def handle(self, *args, **options):
        self.stdout.write('Loading seed data...')

        # Create admin user if it doesn't exist
        if not User.objects.filter(username='admin').exists():
            User.objects.create_superuser(
                username='admin',
                email='admin@herbeautifuluniverse.com',
                password='admin123'
            )
            self.stdout.write(self.style.SUCCESS('Created admin user'))

        # Load memories from JSON fixture
        fixtures_path = os.path.join(
            os.path.dirname(os.path.dirname(os.path.dirname(__file__))),
            'fixtures',
            'seed.json'
        )

        try:
            with open(fixtures_path, 'r') as f:
                seed_data = json.load(f)

            # Create sample media files (placeholder)
            self._create_sample_media_files()

            # Process seed data
            for item in seed_data:
                model_name = item.get('model')
                pk = item.get('pk')
                fields = item.get('fields', {})

                if model_name == 'memories.sitesettings':
                    from memories.models import SiteSettings
                    settings, created = SiteSettings.objects.update_or_create(
                        id=pk,
                        defaults=fields
                    )
                    if created:
                        self.stdout.write(f'Created SiteSettings: {pk}')

                elif model_name == 'memories.memory':
                    from memories.models import Memory

                    # Handle media_url as placeholder
                    media_filename = f"memory_{fields.get('title', 'untitled').lower().replace(' ', '_')}.jpg"
                    fields['media_url'] = f'memories/sample/{media_filename}'

                    memory, created = Memory.objects.update_or_create(
                        id=pk,
                        defaults=fields
                    )
                    if created:
                        self.stdout.write(f'Created Memory: {fields.get("title")}')

        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error loading seed data: {e}'))

        self.stdout.write(self.style.SUCCESS('Seed data loaded successfully!'))
        self.stdout.write('Admin login: username=admin, password=admin123')

    def _create_sample_media_files(self):
        """Create placeholder media files and directories."""
        media_dir = os.path.join(
            os.path.dirname(os.path.dirname(os.path.dirname(__file__))),
            'media',
            'memories',
            'sample'
        )
        os.makedirs(media_dir, exist_ok=True)

        # Create placeholder text files for demonstration
        # In production, these would be actual image/video files
        sample_files = [
            'our_first_date.jpg',
            'midnight_stargazing.jpg',
            'the_rainy_day_we_got_lost.jpg',
            'surprise_birthday_party.jpg',
            'morning_coffee_ritual.jpg',
            'our_first_apartment.jpg',
            'that_perfect_sunset.jpg',
            'dancing_in_the_kitchen.jpg',
            'the_beach_trip.jpg',
            'our_secret_message.jpg'
        ]

        for filename in sample_files:
            file_path = os.path.join(media_dir, filename)
            if not os.path.exists(file_path):
                # Create a placeholder file with metadata
                with open(file_path, 'w') as f:
                    f.write(f'Placeholder for {filename}')

        self.stdout.write(f'Created placeholder media files in {media_dir}')