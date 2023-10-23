import React from "react"
import Back from "../common/back/Back"
import CoursesCard from "./CoursesCard"
import OnlineCourses from "./OnlineCourses"
import { useEffect, useState} from "react"
import getCourses from "../../api/courses/GetCourses"

const CourseHome = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const courses = getCourses();
    setCourses(courses);
  }, [])

  return (
    <>
      <Back title='Explore Courses' />
      <CoursesCard data={courses} />
      <OnlineCourses />
    </>
  )
}

export default CourseHome
