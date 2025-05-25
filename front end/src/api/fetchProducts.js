import axios from "axios"


export const fetchProduct = async(page)=>{
    const API_URL = `http://localhost:8000/customer/products/?page=${page}`
    const response = await axios.get(API_URL)
    return response.data
}




export const fetchCategory = async () => {
    const API_URL = "http://localhost:8000/customer/category/"
    const response = await axios.get(API_URL)
    return response.data
    
}


export const addToCart = async (id,token)=>{
    const API_URL = "http://localhost:8000/customer/addtocart"
    try {
        const response = await axios.post(`${API_URL}/${id}/`,null,{
        headers :{
                "Authorization":`Token ${token}`
        }
    })
    return response.data
    } catch (error) {
        if(error.response){
            return{
                error:true,
                status:error.response.status,
                message:error.response.data.errors 
            }
        }
        
    }
}



export const fetchCart = async(token)=>{
    const API_URL = "http://localhost:8000/customer/cart/"
    try{
        const response = await axios.get(`${API_URL}`,{
            headers :{
                "Authorization":`Token ${token}`
            }
        })
        return response.data
    }
    catch(error){
        if(error.response){
            return{
                error:true,
                status:error.response.status,
                message:error.response.data.errors
            }
        }
    }

}


export const removeCart = async(cart_id)=>{
    const API_URL = "http://localhost:8000/customer/remove-cart/"
    try {
        const response = await axios.post(`${API_URL}`,{cart_id},{
            headers:{
                'Authorization':`Token ${localStorage.getItem('token')}`
            }
        })
        return response.data
    } catch (error) {
        
    }
}