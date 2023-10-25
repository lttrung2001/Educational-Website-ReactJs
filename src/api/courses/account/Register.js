import helper from "../../../utils/Axios"
export default async function register() {
    const response = await helper().post("/auth/register");
    return response.data;
}