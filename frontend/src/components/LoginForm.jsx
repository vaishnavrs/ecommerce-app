import React, { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/login.css'
import { login } from '../api/auth';
import { useNavigate } from 'react-router-dom';
import ErrorMesaage from './ErrorMesaage';
function LoginForm() {

  const [username,setUsername] = useState("")
  const [password,setPassword] = useState("")
  const [errormsg,setErrorMsg] = useState("")
  const navigate = useNavigate()




  const loginHandler = async (e) => {

    e.preventDefault();
    if(!username || !password){
      setErrorMsg("Enter username and password")
      return
    }
    const data = await login(username, password);

    if (data.error) {
        setErrorMsg(data.message)

    }else {
      navigate("/");  
    }
  };
  

  return (
    <div>
      
        <form action="" onSubmit={loginHandler} method="post">
              <input type="text"  className='form-control username' 
                value={username}
                onChange={(e)=>setUsername(e.target.value)} 
                placeholder='username' 
              />
            <input type="password" className='form-control'
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              placeholder='password' />
            <button type='submit' className='btn btn-success login-btn'>Login</button>
            {errormsg&&<ErrorMesaage msg={errormsg}/>}
            
        </form>
    </div>
  )
}

export default LoginForm