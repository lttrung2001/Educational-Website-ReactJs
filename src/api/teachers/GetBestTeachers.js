import helper from "../../utils/Axios"
export default async function getBestTeachers() {
    const response = await helper().get("/teachers");
    return response.data;
}