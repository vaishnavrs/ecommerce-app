from django.core.management.base import BaseCommand
from accounts.models import Products, Category
from faker import Faker
import random

fake = Faker()

class Command(BaseCommand):
    help = 'Seed the database with dummy products'

    def handle(self, *args, **kwargs):
        categories = Category.objects.all()  # Get all categories
        if not categories:
            self.stdout.write(self.style.ERROR('No categories found. Please create categories first.'))
            return
        for _ in range(50):  
            category = random.choice(categories)  
            Products.objects.create(
                product_name=fake.word().capitalize(),
                product_description=fake.sentence(),
                product_image='product_image/sample.webp',  
                product_price=random.randint(100, 1000),
                category=category  
            )
        self.stdout.write(self.style.SUCCESS('✅ 50 dummy products created!'))
