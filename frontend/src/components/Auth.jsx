import React, { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/auth.css'
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';


function Auth() {

    const [ isLogin , setIsLogin ] = useState(true)
    const [active, SetActive] = useState("login")


    function clickHandler(value){
        if(value === 'login'){
            setIsLogin(true)
            SetActive("login")
        }
        else{
            setIsLogin(false)
            SetActive("signup")
        }

    }

  return (
    <div className='container auth'>
        <div className="row">
            <Navbar  data-bs-theme="light" className='navbar'>
                <Container>
                    <Navbar.Brand href="#home" style={{'marginLeft':"130px"}}>Tech Space</Navbar.Brand>
                        <Nav className='me-auto nav-items'>
                            <Nav.Link className='gradient-link' href="#home">Home</Nav.Link>
                            <Nav.Link href="#home">Blog</Nav.Link>
                            <Nav.Link href="#home">Content</Nav.Link>
                            <Nav.Link href="#home">Pages</Nav.Link>
                        </Nav>
                </Container>
            </Navbar>
        </div>
        <div className="row">
            <div className="col-md-6">
                <div className='ls-form'>
                    <button className={`btn log-btn ${active ==='login'?"active":""}`} onClick={()=>{clickHandler("login")}}>Login</button>
                    <button className={`btn  sig-btn  ${active ==='signup'?"active":""}`} onClick={()=>{clickHandler("signup")}}>SignUp</button>
                    {isLogin?<LoginForm/>:<SignupForm/>}
                </div>
            </div>
            <div className="col-md-6">   
            </div>
        </div>
       
    </div>
  )
}

export default Auth