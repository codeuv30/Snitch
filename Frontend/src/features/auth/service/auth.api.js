import axios from "axios";

const BASE_API_URL = "http://localhost:3000/api/v1/auth";

const authApiInstance = axios.create({
    baseURL: BASE_API_URL,
    withCredentials: true
});

export const register = ({ email, contact, password, fullName, isSeller }) => {

    const response = await authApiInstance.post("/register", {
        email,
        contact,
        password,
        fullName,
        isSeller
    });

    return response.data;
    
};