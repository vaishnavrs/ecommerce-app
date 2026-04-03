import axios from "axios";

const API_URL = "http://127.0.0.1:8000/";

export const login = async (username, password) => {
    try {
        const response = await axios.post(`${API_URL}accounts/login`,{ username, password });
        if (response.data.token) {
            localStorage.setItem("token", response.data.token);
        }
        return response.data;
    } catch (error) {
        if (error.response) {
            return {
                error: true,
                status: error.response.status,
                message: error.response.data.message || "Login failed",
            };
        } else {
            return {
                error: true,
                message: "Network error. Please try again.",
            };
        }
    }
};
 


export const signup = async (userData)=>{
    try {
        const response = await axios.post(`${API_URL}accounts/signup`,userData)
        return response.data

    } catch (error) {
        if(error.response){
            console.log("erros",error.response)
            return{
                error:true,
                status:error.response.status,
                message:error.response.data.errors || "Not a valid data"
            }
        }
        
    }
}