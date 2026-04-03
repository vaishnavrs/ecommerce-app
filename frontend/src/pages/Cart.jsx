import React, { useState, useEffect } from 'react'
import { fetchCart, removeCart } from '../api/fetchProducts'
import { useNavigate } from 'react-router-dom'
import '../styles/cart.css'
import Card from 'react-bootstrap/Card'
import ListGroup from 'react-bootstrap/ListGroup'
import axios from 'axios'

const API_BASE = process.env.REACT_APP_API_URL || "http://3.27.82.44:8000"

function Cart() {
    const navigate = useNavigate()

    const [cartItems, setCartItems] = useState([])
    const [total, setTotal] = useState(0)
    const [proceed, setProceed] = useState(false)
    const [loading, setLoading] = useState(true)

    const [delivery, setDelivery] = useState({
        address: "",
        phone: ""
    })

    // ✅ Calculate total
    const calculateTotal = (items) => {
        const amount = items.reduce((acc, item) => {
            return acc + item.quantity * item.product.product_price
        }, 0)
        setTotal(amount)
    }

    // ✅ Fetch cart only once
    useEffect(() => {
        const loadCart = async () => {
            const token = localStorage.getItem("token")

            if (!token) {
                navigate("/auth")
                return
            }

            try {
                const data = await fetchCart(token)
                setCartItems(data)
                calculateTotal(data)
            } catch (error) {
                console.error("Cart fetch error:", error?.response?.data || error.message)
            } finally {
                setLoading(false)
            }
        }

        loadCart()
    }, [navigate])

    // ✅ Handle input
    const handleDeliveryData = (e) => {
        setDelivery({ ...delivery, [e.target.name]: e.target.value })
    }

    // ✅ Remove item
    const handleCartRemove = async (cart_id) => {
        try {
            await removeCart(cart_id)
            const updated = cartItems.filter(item => item.id !== cart_id)
            setCartItems(updated)
            calculateTotal(updated)
        } catch (err) {
            console.error("Remove failed:", err)
        }
    }

    // ✅ Payment
    const handlePayment = async () => {
        if (!delivery.address || !delivery.phone) {
            alert("Please enter delivery address and phone number.")
            return
        }

        try {
            const token = localStorage.getItem('token')

            const response = await axios.post(
                `${API_BASE}/customer/start-payment/`,
                delivery,
                {
                    headers: {
                        Authorization: `Token ${token}`
                    }
                }
            )

            const { razorpay_order_id, razorpay_merchant_key, amount, currency } = response.data

            const options = {
                key: razorpay_merchant_key,
                amount,
                currency,
                name: "TechSpace Store",
                description: "Order Payment",
                order_id: razorpay_order_id,

                handler: async function (res) {
                    try {
                        await axios.post(
                            `${API_BASE}/customer/verify-payment/`,
                            {
                                ...res,
                                cartItems
                            },
                            {
                                headers: {
                                    Authorization: `Token ${token}`
                                }
                            }
                        )

                        alert("Payment successful 🎉")
                        navigate("/")
                    } catch (err) {
                        console.error(err)
                        alert("Payment verification failed")
                    }
                },

                prefill: {
                    contact: delivery.phone
                },

                theme: {
                    color: "#3399cc"
                }
            }

            const rzp = new window.Razorpay(options)
            rzp.open()

        } catch (error) {
            console.error("Payment error:", error)
            alert("Payment failed")
        }
    }

    if (loading) return <h3>Loading cart...</h3>

    return (
        <div className='container'>
            <h1 className='cart-head'>Your Cart</h1>

            <div className="row">
                <div className="col-9">
                    {cartItems.length === 0 ? (
                        <p>Your cart is empty</p>
                    ) : (
                        cartItems.map(item => (
                            <Card key={item.id} className='cart-card'>
                                <Card.Body className='row'>
                                    <div className="col-6 d-flex">
                                        <img
                                            src={`${API_BASE}${item.product.product_image}`}
                                            alt=""
                                        />
                                        <p className='p-name'>{item.product.product_name}</p>
                                    </div>

                                    <div className="col-2">{item.product.product_price}</div>
                                    <div className="col-2">{item.quantity}</div>

                                    <div className="col-1">
                                        {item.quantity * item.product.product_price}
                                    </div>

                                    <div className="col-1">
                                        <button
                                            className='delete-btn'
                                            onClick={() => handleCartRemove(item.id)}
                                        >
                                            <span className="material-symbols-outlined">close</span>
                                        </button>
                                    </div>
                                </Card.Body>
                            </Card>
                        ))
                    )}
                </div>

                <div className="col-3">
                    {/* Summary */}
                    <Card>
                        <ListGroup>
                            <ListGroup.Item>Order Summary</ListGroup.Item>
                        </ListGroup>

                        <Card.Body>
                            <div className='d-flex justify-content-between'>
                                <p>Subtotal</p>
                                <p>₹ {total}</p>
                            </div>

                            <div className='d-flex justify-content-between'>
                                <p>Shipping</p>
                                <p>Free</p>
                            </div>
                        </Card.Body>

                        <ListGroup>
                            <ListGroup.Item className='d-flex justify-content-between'>
                                <strong>Total</strong>
                                <strong>₹ {total}</strong>
                            </ListGroup.Item>
                        </ListGroup>
                    </Card>

                    {/* Proceed */}
                    {!proceed && (
                        <button
                            className='btn btn-success mt-3'
                            onClick={() => setProceed(true)}
                        >
                            Proceed
                        </button>
                    )}

                    {/* Address */}
                    {proceed && (
                        <Card className='mt-3'>
                            <Card.Body>
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
                                    className='btn btn-success mt-3'
                                    onClick={handlePayment}
                                >
                                    Checkout
                                </button>
                            </Card.Body>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Cart