import React from "react"
import Back from "../common/back/Back"
import CoursesCard from "./CoursesCard"
import OnlineCourses from "./OnlineCourses"
import { useEffect, useState} from "react"
import getCourses from "../../api/courses/GetCourses"
import CourseCardData from './../../models/CoursesCardData';
import Footer from "../common/footer/Footer"
import Header from "../common/header/Header"

const CourseHome = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const callGetCourses = async () => {
      const response = await getCourses();
      setCourses(response);
    };
    callGetCourses();
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
