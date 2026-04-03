import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import '../styles/productdetails.css'
import { addToCart } from '../api/fetchProducts'
function ProductDetails() {


    const location = useLocation()
    const state = location.state
    const [product,setProducts] = useState(state)
    const navigate = useNavigate()

      const HandleAddToCart= async(id)=>{
        const token = localStorage.getItem("token")
        if(!token){
          navigate('/auth')
        }
        const response = await addToCart(id,token)
        if(response.error){
          console.log(response.message)
        }else{
          navigate('/cart')
        }
      }
   


  return (
    <div className="row">
        <div className="col-md-6">
          <div className='product-details'>
            <img src={product.product_image} alt="" srcset="" />
          </div>
          
        </div>
        <div className="col-md-6 position-relative" style={{"height":"1000px"}}>
          <hr className='vertical-line' />
          <div className='p-name'>
            <h4>{product.product_name}</h4>
          </div>
            <div className='p-desc'>
              <p>{product.product_description}</p>
            </div>
            <div className='p-price'>
              <h5>&#8377; {product.product_price}</h5>
            </div>
            <div className='p-button'>
              <button type="submit">Buy Now</button>
              <button type='submit' onClick={()=>HandleAddToCart(product.id)}>Add to cart</button>
            </div>
        </div>
    </div>
  )
}

export default ProductDetails