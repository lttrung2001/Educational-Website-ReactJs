import helper from "../../utils/Axios";
export default async function getCourses () {
    const courses = await helper().get("/courses");
    return courses.data;
}