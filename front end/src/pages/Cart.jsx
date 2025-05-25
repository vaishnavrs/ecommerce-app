import React, { useState } from 'react'
import { useEffect } from 'react'
import { fetchCart } from '../api/fetchProducts'
import { useNavigate } from 'react-router-dom'
import '../styles/cart.css'
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import axios from 'axios'
import { removeCart } from '../api/fetchProducts'

function Cart() {

    const navigate = useNavigate()
    const [cartItems,setCartItems] = useState([])
    const [total,setTotal] = useState(0)
    const [proceed,setProceed] = useState('false')
    const [delivery,setDelivery] = useState({
        address:"",
        phone:""

    })


    const calculateTotal =(item)=>{
        let amount = 0
        item.forEach(element => { 
            amount = amount + element.quantity *element.product.product_price
            console.log("amount",amount)
            
        });
        setTotal(amount)
    }

    function handleDeliveryData(e){
    setDelivery({...delivery, [e.target.name]: e.target.value});
}

    const proceedHandler=()=>{
        if(proceed === false){
            console.log("set procedd is set true")
            setProceed(true)
        }
        setProceed(true)
    }


const handleCartRemove = async(cart_id)=>{
    const response = await removeCart(cart_id)
    console.log(response)
}



const handlePayment = async () => {
    if (!delivery.address || !delivery.phone) {
        alert("Please enter delivery address and phone number.");
        return;
    }
    const API_URL = "http://localhost:8000/customer/start-payment/";

    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(API_URL,delivery
        , {
            headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const { razorpay_order_id, razorpay_merchant_key, amount, currency } = response.data;

        const options = {
            key: razorpay_merchant_key,
            amount: amount,
            currency: currency,
            name: "Your Shop Name",
            description: "Order Payment",
            order_id:razorpay_order_id,
            handler: async function (response) {
                try {
                    await axios.post("http://localhost:8000/customer/verify-payment/", {
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature,
                        cartItems
                    }, {
                        headers: {
                            'Authorization': `Token ${token}`,
                            'Content-Type': 'application/json'
                        }
                    });

                    alert("Payment successful!");
                    navigate("/")
                } catch (err) {
                    console.error("Payment verification failed", err);
                    alert("Payment verification failed");
                }
            },
            prefill: {
                name: "Your Customer Name",
                contact: delivery.phone,
                email: "customer@example.com"
            },
            theme: {
                color: "#3399cc"
            }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();

    } catch (error) {
        console.error("Payment Error:", error);
        alert("Error initiating payment");
    }
};






    useEffect(()=>{
        const cartData =async()=>{
            const token = localStorage.getItem("token")
            if(!token){
                navigate("/auth")
            }
            try{
                const data = await fetchCart(token)
                setCartItems(data)
                calculateTotal(data)

            }catch(error){
                if(error.reponse){
                    console.log(error.reponse.data.message)
                }

            }
        }
        cartData()
    },[cartItems])

    console.log("cartitems:",cartItems)
  return (
    <div className='conatiner'>
        <div className="row" style={{'marginBottom':"100px"}}>
            <h1 className='cart-head'>Your Cart</h1>
        </div>
        <div className="row">
            <div className="d-flex cart-heads">
                <p>Product</p>
                <p>Price</p>
                <p>Quantity</p>
                <p>Total</p>
            </div>
        </div>
        <div className="row">
            <div className="col-9">
                {   
                    cartItems.map((item)=>(
                    <Card key={item.id} className='cart-card'>
                        <Card.Body  className='row'>
                            <div className="col-6">
                                <div className='d-flex'>
                                    <img src={`http://localhost:8000${item.product.product_image}`} alt=""/>
                                    <p className='p-name'>{item.product.product_name}</p>
                                </div>
                            </div>
                            <div className="col-2">
                                <p>{item.product.product_price}</p>
                            </div>
                            <div className="col-2">{item.quantity}</div>
                            <div className="col-1" >
                                <p>{item.quantity*item.product.product_price}</p>
                            </div>
                            <div className="col-1">
                                <button className='delete-btn' onClick={()=>handleCartRemove(item.id)}>
                                    <span class="material-symbols-outlined">close</span>
                                </button>
                            </div>

                        </Card.Body>
                    </Card>
                    ))
                }
            </div>
            <div className="col-3">
                <Card className={`checkout-card ${proceed === true?"disabled":""}`}>
                        <ListGroup  variant="flush">
                            <ListGroup.Item className='order-sum' >Order Summary</ListGroup.Item>
                        </ListGroup>
                    <Card.Body>
                        <div className='d-flex justify-content-between'>
                            <p className='checkout-card-p'>Subtotal</p>
                            <p>&#8377; {total}</p>
                        </div>
                        <div className='d-flex justify-content-between'>
                            <p className='checkout-card-p'>Shipping</p>
                            <p>Free</p>
                        </div>
                    </Card.Body>
                        <ListGroup variant="flush">
                            <ListGroup.Item className='d-flex justify-content-between total'>
                                <span>Total</span>
                                <span>&#8377; {total}</span>
                            </ListGroup.Item>
                        </ListGroup>
                    </Card>
                    <div>
                        <button className={`btn btn-success checkout-btn ${proceed=== true?"disabled":""}`} onClick={proceedHandler}>Proceed</button>
                    </div>
                
                <Card className={`address-card ${proceed === true?"active":""}`}>
                    <ListGroup  variant="flush" className='address'>
                            <ListGroup.Item className='order-sum' >Order Summary</ListGroup.Item>
                    </ListGroup>
                    <Card.Body>
                        <div className="form-group mt-3">
                            <textarea 
                                className='form-control' 
                                name="address"
                                placeholder='Enter delivery address'
                                value={delivery.address}
                                onChange={handleDeliveryData}
                            />               

                            <input  
                                className='form-control mt-2'
                                type="number" 
                                name="phone" 
                                placeholder='Mobile number'
                                value={delivery.phone}
                                onChange={handleDeliveryData}
                            />

                            <button 
                                type='submit' 
                                className='btn btn-success mt-3' 
                                onClick={handlePayment}>
                                Checkout
                            </button>
                        </div>  
                    </Card.Body>
                </Card>

            </div>
        </div>
    </div>
  )
}

export default Cart