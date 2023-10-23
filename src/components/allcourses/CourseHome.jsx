import React from "react"
import Back from "../common/back/Back"
import CoursesCard from "./CoursesCard"
import OnlineCourses from "./OnlineCourses"
import { useEffect, useState} from "react"

const CourseHome = () => {
  return (
    <>
      <Back title='Explore Courses' />
      <CoursesCard data={{}} />
      <OnlineCourses />
    </>
  )
}

export default CourseHome
