import React, { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { signup } from '../api/auth';
import { useNavigate } from 'react-router-dom';
import ErrorMesaage from './ErrorMesaage';

function SignupForm() {

  const [userData ,setUserData ] = useState({
    username :"",
    password:"",
    mobile_num:"",
    email:""
  })
  const [msg,setErrorMsg] = useState("")
  const navigate = useNavigate()



  const handleUserData =(e)=>{
    setUserData({...userData,[e.target.name]:e.target.value})
  }



  const handleSubmit = async (e)=>{
    e.preventDefault()
    if(!userData.username || !userData.email || !userData.email || !userData.password || !userData.mobile_num){
      setErrorMsg("All fields are required")
      return
    }
    const response = await signup(userData)
    console.log("response:",response)
    if(response.error){
      setErrorMsg(response.message)
    }else{
      navigate("/")
    }
      
  }


  return (
    <div>
      <form action="" onSubmit={handleSubmit} method="post">
            <input type="text" className='form-control' name='username' 
              value={userData.username} placeholder='username' 
              onChange={handleUserData}
            />

            <input type="email" name="email" 
              value={userData.email} 
              id="" placeholder='email'
              onChange={handleUserData}
            />

             <input type='number' name='mobile_num' 
              value={userData.mobile_num}
              placeholder='Mobile'
              onChange={handleUserData}
            />

            <input type="password" className='form-control' name="password" 
              value={userData.password} id="" 
              placeholder='password'
              onChange={handleUserData} 
            />

            <button type="submit" className='btn btn-success login-btn'>Signup</button>
            {msg&&<ErrorMesaage msg={msg}/>}
        </form>
    </div>
  )
}

export default SignupForm