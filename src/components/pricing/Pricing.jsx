import React from "react"
import Back from "../common/back/Back"
import PriceCard from "./PriceCard"
import "./price.css"
import Faq from "./Faq"
import Header from "../common/header/Header"
import Footer from "../common/footer/Footer"

const Pricing = () => {
  return (
    <>
      <Header />
      <Back title='Choose The Right Plan' />
      <section className='price padding'>
        <div className='container grid'>
          <PriceCard />
        </div>
      </section>
      <Faq />
      <Footer />
    </>
  )
}

export default Pricing
