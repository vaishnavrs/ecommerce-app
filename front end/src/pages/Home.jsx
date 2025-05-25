import React from 'react'
import Header from '../components/Header'
import '../styles/home.css'
import AllProducts from '../components/AllProducts'
import ProductDetails from './ProductDetails'
import {BrowserRouter, Routes,Route} from 'react-router-dom'
import Auth from '../components/Auth'
import Cart from './Cart'

function Home() {
  return (
    <div>
          <Header/>
            <Routes>
              <Route path="/" element={<AllProducts/>}/>
              <Route path='/product_details/:id' element={<ProductDetails/>}/>
              <Route path='/auth' element={<Auth/>}/>
              <Route path='/cart' element={<Cart/>}/>
            </Routes>
    </div>
  )
}

export default Home