from rest_framework.response import Response
from accounts.models import Products,Cart,Category,Order
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from .serializers import ProductSer,AddtoCartSer,CartViewSer,CategorySer,OrderSer,CartRemoveSerializer
from rest_framework import permissions,authentication,status
import razorpay
from django.conf import settings
from razorpay.errors import SignatureVerificationError




class ProductView(ListAPIView):
        queryset = Products.objects.all().order_by('id')
        serializer_class = ProductSer



class CategoryView(APIView):
    def get(self, request):
        categories =  Category.objects.all()
        desr = CategorySer(categories,many=True)
        return Response(desr.data)




class AddToCartView(APIView):

    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [authentication.TokenAuthentication]

    def post(self, request, id):
        try:
            product = Products.objects.get(id=id)

        except Products.DoesNotExist:
             return Response({"message":"Product does not exist"},status=404)
        try:
             cart = Cart.objects.get(customer=request.user,product=product)
             cart.quantity += 1
             cart.save()
             return Response({"message":"product quantity updated"})
        except Cart.DoesNotExist:
             quantity = request.data.get('quantity',1)
             Cart.objects.create(customer = request.user,product=product,quantity=quantity)
             return Response({"message":"Added to cart"})
             


class CartView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [authentication.TokenAuthentication]

    def get(self, request):
        customer = request.user
        cart = Cart.objects.filter(customer=customer)
        ser = CartViewSer(cart,many=True)
        return Response(ser.data)



client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

class StartPayment(APIView):
     
     permission_classes = [permissions.IsAuthenticated]
     authentication_classes = [authentication.TokenAuthentication]
     
     def post(self,request):
        c_id = request.user
        cart_items = Cart.objects.filter(customer=c_id)

        if not cart_items:
            return Response({"error":"cart is empty"},status=400)
          
        total_amount = 0
        for item in cart_items:
            total_amount += item.quantity * item.product.product_price
        
        amount_in_paisa = int(total_amount * 100)
        
        razorpay_order = client.order.create({
            "amount" : amount_in_paisa,
            "currency" : "INR",
            "payment_capture" :"1"
        })
        
        ser = OrderSer(data=request.data)
        if ser.is_valid():
            for item in cart_items:
                Order.objects.create(
                    cart=item,
                    address=ser.validated_data['address'],
                    phone=ser.validated_data['phone'],
                    payment_status='pending',
                    payment_id=razorpay_order['id'],
                )
        else:
            return Response({"error": "Invalid data", "details": ser.errors}, status=400)


        return Response({
            "razorpay_order_id": razorpay_order['id'],
            "razorpay_merchant_key": settings.RAZORPAY_KEY_ID,
            "amount": amount_in_paisa,
            "currency": "INR"
        })
          
          
class VerifyPayment(APIView):
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [authentication.TokenAuthentication]

    def post(self,request):
        razorpay_order_id = request.data.get("razorpay_order_id")
        razorpay_payment_id = request.data.get("razorpay_payment_id")
        razorpay_signature = request.data.get("razorpay_signature")
        try:
            client.utility.verify_payment_signature({
                'razorpay_order_id': razorpay_order_id,
                'razorpay_payment_id': razorpay_payment_id,
                'razorpay_signature': razorpay_signature
            })        
            cart_items = request.data.get("cartItems",[])
            for item in cart_items:
                try:
                    order = Order.objects.get(cart_id = item.get("id"))
                    order.payment_status = 'Completed'
                    order.save()
                except Order.DoesNotExist:
                    continue
            return Response({"Msg":"Payment Successful"},status=status.HTTP_200_OK)        
        except SignatureVerificationError:
            return Response({"Msg":"Payment failed"},status=status.HTTP_400_BAD_REQUEST)
        


class RemoveFromCart(APIView):
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [authentication.TokenAuthentication]

    def post(self,request):
        desr = CartRemoveSerializer(data = request.data)
        print("serdata",desr)
        customer = request.user
        if desr.is_valid():
            cart_id = desr.validated_data["cart_id"]
            print("cart_id",cart_id)
            try:
                Cart.objects.get(customer=customer,id=cart_id).delete()
                return Response({"Msg":"Deleted"},status=status.HTTP_200_OK)
            except Cart.DoesNotExist:
                return Response({"Msg":"Item not found"},status=status.HTTP_400_BAD_REQUEST)
        else:
        
            return Response(desr.errors, status=status.HTTP_400_BAD_REQUEST)

        