import { Box, Button, CardMedia, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material";
import React from "react"
import "./courses.css"
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';

const CoursesCard = (props) => {
  const [open, setOpen] = React.useState(false);
  const [selectedCourse, setSelectedCourse] = React.useState();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const courses = props.courses;
  return (
    <>
      <section className='coursesCard'>
        <div className='container grid2'>
          {courses.map((val) => (
            <div className='items' key={val.id}>
              <div className='content flex'>
                <div className='left'>
                  <div className='img'>
                    <img src={val.thumbnail} alt='' />
                  </div>
                </div>
                <div className='text'>
                  <h1>{val.name}</h1>
                  <div className='rate'>
                    <i className='fa fa-star'></i>
                    <i className='fa fa-star'></i>
                    <i className='fa fa-star'></i>
                    <i className='fa fa-star'></i>
                    <i className='fa fa-star'></i>
                    <label htmlFor=''>(5.0)</label>
                  </div>
                  {/* <div className='details'>
                    {val.courTeacher.map((details) => (
                      <>
                        <div className='box'>
                          <div className='dimg'>
                            <img src={details.dcover} alt='' />
                          </div>
                          <div className='para'>
                            <h4>{details.name}</h4>
                          </div>
                        </div>
                        <span>{details.totalTime}</span>
                      </>
                    ))}
                  </div> */}
                </div>
              </div>
              <div className='price'>
                <h3>
                  {val.tuition} VND
                </h3>
              </div>
              <button className='outline-btn' onClick={() => {
                handleClickOpen();
                setSelectedCourse(val);
              }}>ENROLL NOW !</button>
            </div>
          ))}
        </div>
      </section>
      {
        selectedCourse ? <Dialog
          open={open}
          // TransitionComponent={Transition}
          keepMounted
          onClose={handleClose}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle>{`Details of ${selectedCourse.name}`}</DialogTitle>
          <CardMedia
            component="img"
            alt="green iguana"
            height={200}
            image={selectedCourse.thumbnail}
          />
          <Box mx={3} my={1}>
            <TextField
              fullWidth
              label={"Training time"}
              defaultValue={`${selectedCourse.trainingTime} months`}
              inputProps={{
                readOnly: true,
              }}
            />
          </Box>
          <Box mx={3} my={1}>
            <TextField
              fullWidth
              label={"Tuition"}
              defaultValue={`${selectedCourse.tuition} VND`}
              inputProps={{
                readOnly: true,
              }}
            />
          </Box>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              {selectedCourse.desc}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleClose}>Select classroom</Button>
          </DialogActions>
        </Dialog> : <></>
      }
    </>
  )
}

export default CoursesCard
