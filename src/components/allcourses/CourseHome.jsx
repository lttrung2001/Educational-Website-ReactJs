import React from "react"
import Back from "../common/back/Back"
import CoursesCard from "./CoursesCard"
import OnlineCourses from "./OnlineCourses"
import { useEffect, useState} from "react"
import getCourses from "../../api/courses/GetCourses"
import CourseCardData from './../../models/CoursesCardData';
import Footer from "../common/footer/Footer"
import Header from "../common/header/Header"
import { MESSAGE_INVALID_TOKEN } from "../../utils/Axios";
import { useNavigate } from "react-router-dom"

const CourseHome = () => {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState();
  const navigator = useNavigate();

  useEffect(() => {
    const callGetCourses = async () => {
      const response = await getCourses();
      setCourses(response);
    };
      callGetCourses().catch((e) => {
        console.log(e);
        if (e.message == MESSAGE_INVALID_TOKEN) {
          navigator("/login");
        }
      });
    }, [])

  return (
    <>
      <Header />
      <Back title='Explore Courses' />
      <CoursesCard {... new CourseCardData(courses)} />
      <OnlineCourses />
      <Footer />
    </>
  )
}

export default CourseHome
