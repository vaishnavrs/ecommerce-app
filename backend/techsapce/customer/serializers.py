from rest_framework import serializers
from accounts.models import Products,Cart,Category,Order
from accounts.serializers import SignUpSer

class CategorySer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class ProductSer(serializers.ModelSerializer):
    class Meta:
        category = CategorySer()
        model = Products
        fields = '__all__'
        

class AddtoCartSer(serializers.ModelSerializer):
    class Meta:
        model = Cart
        fields = ['product','quantity']



class CartViewSer(serializers.ModelSerializer):
    product = ProductSer()
    class Meta:
        model = Cart
        fields = '__all__'

class OrderSer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ['address','phone']

class CartRemoveSerializer(serializers.Serializer):
    cart_id = serializers.IntegerField()
    