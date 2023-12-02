import React from "react"
import { Link, useNavigate } from "react-router-dom"
import Head from "./Head"
import "./header.css"
import apiHelper, { ACCESS_TOKEN, MESSAGE_INVALID_TOKEN, SERVICE_UNAVAILABLE } from "../../../utils/Axios"
import { Button, Box, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Typography, TextField } from "@mui/material"

const Header = () => {
  const [click, setClick] = React.useState(false)
  const [token, setToken] = React.useState(localStorage.getItem(ACCESS_TOKEN));
  const [confirm, setConfirm] = React.useState();
  const [openChangePasswordDialog, setOpenChangePasswordDialog] = React.useState();
  const [error, setError] = React.useState();
  const navigator = useNavigate();

  const callChangePassword = async (requestData) => {
    try {
      apiHelper().post("/auth/change-password", requestData).then((response) => {
        setOpenChangePasswordDialog(false);
        setConfirm("Change password successfully!");
      }, (e) => {
        if (e.message == MESSAGE_INVALID_TOKEN) {
          localStorage.clear();
          navigator(0);
      } else {
          setError(e.response.data.message);
      }
      });
    } catch (e) {
      setError(e.response.data.message);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setToken(null);
  }

  const handleChangePassword = (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    const requestData = {
      oldPassword: data.get("oldPassword"),
      newPassword: data.get("newPassword")
    };
    console.log("DATA::");
    console.log(requestData);

    callChangePassword(requestData);
  }

  const handleCloseConfirmDialog = () => {
    setConfirm(null);
  }

  const handleCloseChangePasswordDialog = () => {
    setOpenChangePasswordDialog(false);
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
              <Link to='/registrations'>Registered classrooms</Link>
            </li>
            <li>
              <Link to='/schedule'>Schedule</Link>
            </li>
            <li>
              <Link to='/score'>Score</Link>
            </li>
            <li>
              <Link to='/contact'>Contact</Link>
            </li>
          </ul>
          <div className='start'>
            {/* <div className='button'>GET CERTIFICATE</div> */}
            {token ? <div ><Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            <Button
                onClick={() => {
                  setOpenChangePasswordDialog(true);
                }}
                key={"ChangePassword"}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                Change password
              </Button>
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
      {
        confirm ? <Dialog
          open={confirm}
          onClose={handleCloseConfirmDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Notification"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {confirm}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseConfirmDialog} autoFocus>
              Agree
            </Button>
          </DialogActions>
        </Dialog> : <></>
      }
      {
        // Create room dialog
        openChangePasswordDialog ? <Dialog
          fullWidth
          open={openChangePasswordDialog}
          // TransitionComponent={Transition}
          keepMounted
          onClose={handleCloseChangePasswordDialog}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle>{"Change your password"}</DialogTitle>
          <Box component="form" onSubmit={handleChangePassword}>
            <Box mx={2} my={1}>
              <Typography>Current password</Typography>
              <TextField id="oldPassword" name="oldPassword" fullWidth type="password" />
            </Box>
            <Box mx={2} my={1}>
              <Typography>New password</Typography>
              <TextField id="newPassword" name="newPassword" fullWidth type="password" />
            </Box>
            <DialogActions>
              <Button onClick={handleCloseChangePasswordDialog}>Cancel</Button>
              <Button type="submit">Submit</Button>
            </DialogActions>
          </Box>
        </Dialog> : <></>
      }
    </>
  )
}

export default Header
