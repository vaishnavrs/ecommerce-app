from django.db import models
from django.contrib.auth.models import AbstractUser
# Create your models here.



class Customer(AbstractUser):
    email = models.EmailField(max_length=255, unique=True)
    mobile_num = models.CharField(max_length=10,unique=True)



class Category(models.Model):
    name = models.CharField(max_length=255, unique=True)
    icon = models.ImageField(upload_to='category_image')
    description = models.TextField()

    def __str__(self):
        return self.name


class Products(models.Model):
    product_name = models.CharField(max_length=255)
    product_price = models.DecimalField(max_digits=10, decimal_places=2)
    product_description = models.TextField()
    product_image = models.ImageField(upload_to='product_image')
    quantity = models.IntegerField(default=1)
    category = models.ForeignKey(Category,on_delete=models.CASCADE)

    def __str__(self):
        return self.product_name


class Cart(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    product = models.ForeignKey(Products, on_delete=models.CASCADE)
    quantity = models.IntegerField()



class Order(models.Model):
    cart =  models.OneToOneField(Cart,on_delete=models.CASCADE)
    address = models.CharField(max_length=500)
    date = models.DateField(auto_now_add=True)
    PAYMENT_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('failed', 'Failed')
    ]
    payment_status = models.CharField(max_length=10, choices=PAYMENT_STATUS_CHOICES, default='pending')
    payment_id = models.CharField(max_length=100, blank=True, null=True)
    phone = models.CharField(max_length=15)



