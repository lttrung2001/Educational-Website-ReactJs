import "./App.css"
import Header from "./components/common/header/Header"
import About from "./components/about/About"
import CourseHome from "./components/allcourses/CourseHome"
import Team from "./components/team/Team"
import Pricing from "./components/pricing/Pricing"
import Blog from "./components/blog/Blog"
import Contact from "./components/contact/Contact"
import Home from "./components/home/Home"
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import SignIn from "./components/login/login"
import SignUp from './components/signup/signup';
import SuccessScreen from './components/payments/success';
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
    {
      path: "/login",
      element: <SignIn />,
    },
    {
      path: "/register",
      element: <SignUp />,
    },
    {
      path: "/payments/success",
      element: <SuccessScreen />,
    }
  ]);
  return (
    <>
    <RouterProvider router={router} />
    </>
  );
}

export default App
