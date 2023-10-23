import "./App.css"
import Header from "./components/common/header/Header"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import About from "./components/about/About"
import CourseHome from "./components/allcourses/CourseHome"
import Team from "./components/team/Team"
import Pricing from "./components/pricing/Pricing"
import Blog from "./components/blog/Blog"
import Contact from "./components/contact/Contact"
import Footer from "./components/common/footer/Footer"
import Home from "./components/home/Home"
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/about",
      element: <About />,
    },
    {
      path: "/courses",
      element: <CourseHome />,
    },
    {
      path: "/team",
      element: <Team />,
    },
    {
      path: "/pricing",
      element: <Pricing />,
    },
    {
      path: "/contact",
      element: <Contact />,
    },
  ]);
  return (
    <>
    <RouterProvider router={router} />
    </>
  );
}

export default App
