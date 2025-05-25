from django.shortcuts import render
from rest_framework.views import APIView
from .serializers import SignUpSer,LoginSer
from rest_framework import status
from rest_framework.response import Response
from rest_framework import authentication
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
# Create your views here.


class SignUPView(APIView):
    def post(self, request):
        serializer = SignUpSer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message":"user created"}, status=status.HTTP_201_CREATED)
        return Response({"errors":serializer.errors}, status=status.HTTP_400_BAD_REQUEST)




class LoginView(APIView):
    def post(self,request):
        serializer = LoginSer(data = request.data)
        if serializer.is_valid():
            username = serializer.validated_data["username"]
            password = serializer.validated_data["password"]
            user = authenticate(username=username,password=password)
            if user:
                token,_ = Token.objects.get_or_create(user=user)
                return Response({"message":"Login successful","token":token.key},status=201) 
            return Response({"message":"Invalid Credentials"},status=status.HTTP_401_UNAUTHORIZED)
        return Response({"message":"validation failed","errors":serializer.errors},status=status.HTTP_400_BAD_REQUEST)

