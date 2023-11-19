import helper, { apiHelperPublic } from "../../utils/Axios"
export default async function register(registerData) {
    const response = await apiHelperPublic().post("/auth/register", registerData);
    return response.data;
}