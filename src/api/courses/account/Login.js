import helper from "../../../utils/Axios"
export default async function login(username, password) {
    const body = {
        username: username,
        password: password
    };
    const response = await helper().post("/auth/login", body);
    return response.data;
}