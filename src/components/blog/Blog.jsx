import React from "react"
import Back from "../common/back/Back"
import BlogCard from "./BlogCard"
import "./blog.css"
import Header from './../common/header/Header';
import Footer from './../common/footer/Footer';

const Blog = () => {
  return (
    <>
      <Header />
      <Back title='Blog Posts' />
      <section className='blog padding'>
        <div className='container grid2'>
          <BlogCard />
        </div>
      </section>
      <Footer />
    </>
  )
}

export default Blog
