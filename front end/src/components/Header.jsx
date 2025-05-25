import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import '../styles/header.css'
import { NavLink, useLocation, useNavigate } from 'react-router-dom';

function Header() {
    const location = useLocation()
    const navigate = useNavigate()
    const  isProductDetailsPage = location.pathname.startsWith('/product_details') || location.pathname.startsWith('/cart')
    const  isLoginPage = location.pathname.startsWith('/auth') 
    const hideItems = ['/cart','/product_details']

    if(isLoginPage){
        return null
    }
    return (
        <div className={isProductDetailsPage?"":'hero-section'}>
            <div className="row justify-content-center">
                <div className="col-md-8 ">
                    <Navbar  data-bs-theme="light" className='navbar'>
                        <Container>
                            <Navbar.Brand className='tech-space'>Tech Space</Navbar.Brand>
                            <Nav className='me-auto nav-items'>
                                <Nav.Link onClick={()=>navigate('/')}>Home</Nav.Link>
                                <Nav.Link href="#home">Blog</Nav.Link>
                                <Nav.Link href="#home">Content</Nav.Link>
                                <Nav.Link href="#home">Pages</Nav.Link>
                                <Nav.Link href="#features">About</Nav.Link>
                            </Nav>
                            <Nav className='justify-content-end'>
                                {!hideItems.includes(location.pathname)?
                                    <Nav.Link className='cart-symbol' onClick={()=>navigate('/cart')} >
                                        <span className="material-symbols-outlined">
                                            garden_cart
                                        </span>
                                    </Nav.Link>:""
                                }
                                <Nav.Link >User</Nav.Link>
                            </Nav>
                        </Container>
                    </Navbar>
                </div>
            </div>
        </div>
      );

}

export default Header