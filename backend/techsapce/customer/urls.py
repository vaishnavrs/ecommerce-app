from django.urls import path
from .views import ProductView,AddToCartView,CartView,CategoryView,StartPayment,VerifyPayment,RemoveFromCart

urlpatterns=[
    path('products/',ProductView.as_view()),
    path('addtocart/<int:id>/',AddToCartView.as_view()),
    path('cart/',CartView.as_view()),
    path('category/',CategoryView.as_view()),
    path('start-payment/',StartPayment.as_view()),
    path('verify-payment/',VerifyPayment.as_view()),
    path('remove-cart/',RemoveFromCart().as_view())

]

