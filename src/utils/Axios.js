import axios, { AxiosInstance } from "axios";
import jwtDecode from "jwt-decode";

const apiHelper = axios.create({
    baseURL: "http://localhost:8080/",
    headers: {
        "Content-Type": "application/json"
    },
});

export const apiHelperPublic = () => {
    return axios.create({
        baseURL: "http://localhost:8080/",
        headers: {
            "Content-Type": "application/json"
        },
    })
}

export default () => {
    apiHelper.interceptors.request.use((config) => {
        config.baseURL = "http://localhost:8080/"
        const accessToken = localStorage.getItem(ACCESS_TOKEN);
        console.log(accessToken);
        if (accessToken != null) {
            const decoded = jwtDecode(accessToken)
            if (decoded.exp && decoded.exp < Date.now() / 1000) {
                throw Error(MESSAGE_INVALID_TOKEN)
            }
            config.headers.Authorization = `Bearer ${accessToken}`
            console.log(`$ADD TOKEN: ${config.headers.Authorization}`)
            return config
        }
        throw Error(MESSAGE_INVALID_TOKEN)
    }, (error) => {
        console.log(`$INTERCEPTOR ERROR: ${error}`)
        localStorage.clear()
        throw Error(MESSAGE_INVALID_TOKEN)
    })
    
    apiHelper.interceptors.response.use((response) => {
        console.log(response);
        return response;
    })
    return apiHelper;
}

export const MESSAGE_INVALID_TOKEN = "Token was expired or invalid!";
export const ACCESS_TOKEN = "ACCESS_TOKEN";