import helper, { apiHelperPublic } from "../../utils/Axios"
export default async function login(loginData) {
    const response = await apiHelperPublic().post("/auth/login", loginData);
    return response.data;
}