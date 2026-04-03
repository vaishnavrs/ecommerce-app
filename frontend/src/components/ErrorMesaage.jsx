import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import "../styles/login.css"

function ErrorMesaage({msg}) {
  return (
    <div>
        <p className='msg'>{msg}!</p>
    </div>
  )
}

export default ErrorMesaage