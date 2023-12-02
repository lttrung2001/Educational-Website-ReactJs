import helper from "../../utils/Axios"
export default async function getCourses() {
    const response = await helper().get("/courses/student");
    return response.data;
}