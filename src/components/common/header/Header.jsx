import React from "react"
import { Link, useNavigate } from "react-router-dom"
import Head from "./Head"
import "./header.css"
import { ACCESS_TOKEN } from "../../../utils/Axios"
import { Button, Box } from "@mui/material"

const Header = () => {
  const [click, setClick] = React.useState(false)
  const [token, setToken] = React.useState(localStorage.getItem(ACCESS_TOKEN));
  const navigator = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    setToken(null);
  }

  return (
    <>
      <Head />
      <header>
        <nav className='flexSB'>
          <ul className={click ? "mobile-nav" : "flexSB "} onClick={() => setClick(false)}>
            <li>
              <Link to='/'>Home</Link>
            </li>
            <li>
              <Link to='/courses'>All Courses</Link>
            </li>
            <li>
              <Link to='/about'>About</Link>
            </li>
            <li>
              <Link to='/team'>Team</Link>
            </li>
            <li>
              <Link to='/pricing'>Pricing</Link>
            </li>
            <li>
              <Link to='/journal'>Journal</Link>
            </li>
            <li>
              <Link to='/contact'>Contact</Link>
            </li>
          </ul>
          <div className='start'>
            {/* <div className='button'>GET CERTIFICATE</div> */}
            {token ? <div ><Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              <Button
                onClick={handleLogout}
                key={"Logout"}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                Logout
              </Button>
            </Box>
            </div> :
              <div style={{
                display: 'flex', flexDirection: 'row'
              }}>
                <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                  <Button
                    onClick={() => navigator("/login")}
                    key={"Login"}
                    sx={{ my: 2, color: 'white', display: 'block' }}
                  >
                    Login
                  </Button>
                </Box>
                <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                  <Button
                    onClick={() => navigator("/register")}
                    key={"Register"}
                    sx={{ my: 2, color: 'white', display: 'block' }}
                  >
                    Register
                  </Button>
                </Box>
              </div>
            }

          </div>
          <button className='toggle' onClick={() => setClick(!click)}>
            {click ? <i className='fa fa-times'> </i> : <i className='fa fa-bars'></i>}
          </button>
        </nav>
      </header>
    </>
  )
}

export default Header
