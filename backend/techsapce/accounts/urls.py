from django.urls import path
from rest_framework.authtoken import views
from rest_framework.routers import DefaultRouter
from .views import SignUPView,LoginView



urlpatterns = [
    path('token',views.obtain_auth_token),
    path('signup',SignUPView.as_view(),name='signup'),
    path('login',LoginView.as_view(),name='login')
]
