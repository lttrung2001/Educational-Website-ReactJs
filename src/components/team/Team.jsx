import React, { useEffect, useState } from "react"
import Back from "../common/back/Back"
import TeamCard from "./TeamCard"
import "./team.css"
import Awrapper from "../about/Awrapper"
import "../about/about.css"
import getBestTeachers from "../../api/courses/GetBestTeachers"
import TeamCardData from './../../models/TeamCardData';
import Header from "../common/header/Header"
import Footer from "../common/footer/Footer"

const Team = () => {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getBestTeachers();
      setTeams(response);
    };
    fetchData();
  }, []);

  return (
    <>
      <Header />
      <Back title='Team' />
      <section className='team padding'>
        <div className='container grid'>
          <TeamCard {... new TeamCardData(teams)}/>
        </div>
      </section>
      <Awrapper />
      <Footer />
    </>
  )
}

export default Team
