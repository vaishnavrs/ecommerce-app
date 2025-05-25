from rest_framework import serializers
from accounts.models import Customer



class SignUpSer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = ['username','email','password','mobile_num']
        
    def create(self, validated_data):
        return Customer.objects.create_user(**validated_data)
    

class LoginSer(serializers.Serializer):
    username = serializers.CharField(max_length=255)
    password = serializers.CharField(max_length=255) 


