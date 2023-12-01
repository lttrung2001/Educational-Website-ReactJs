import React, { useState } from "react"
import "./courses.css"
import { Autocomplete, Box, Button, CardMedia, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, FormControl, Grid, Input, InputLabel, List, ListItemButton, ListItemIcon, ListItemText, MenuItem, Paper, Select, TextField, Typography, selectClasses } from "@mui/material";
import { DialogTitle } from '@mui/material';
import { CloudUploadRounded } from "@mui/icons-material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import apiHelper, { MESSAGE_INVALID_TOKEN } from "../../utils/Axios.js";
import { DataGrid, GridDeleteIcon, GridViewColumnIcon } from "@mui/x-data-grid";
import { useNavigate, useParams } from "react-router-dom";

const CoursesCard = (props) => {
  const classroomColumns = [
    { field: "id", headerName: "ID" },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "startDate", headerName: "Start date", flex: 1, valueGetter: (params) => dayjs(params.row?.startDate).format("DD/MM/YYYY")},
    {
      field: "action",
      headerName: "Action",
      sortable: false,
      renderCell: ({ row }) => (
        <Button onClick={() => onPayClicked(row)}>
          Register
        </Button>
      ),
    }
  ];

  const callCreatePayment = async (requestData) => {
    try {
      setConfirm(null);
      apiHelper().post("/payments/create", requestData).then((response) => {
        window.location.replace(response.data);
      }, (e) => {
        setError(e.response.data.message);
      });
    } catch (e) {
      setError(e.response.data.message);
    }
  };

  const callRegisterNoPayment = async (requestData) => {
    try {
      setConfirm(null);
      apiHelper().post("/payments/register-no-payment", requestData).then((response) => {
        // callGetClassrooms();
        window.location.replace("/")
      }, (e) => {
        setError(e.response.data.message);
      });
    } catch (e) {
      setError(e.response.data.message);
    }
  };

  const onPayClicked = (row) => {
    setConfirm(row);
    // const requestData = {
    //   classroomId: row.id
    // };
    // callCreatePayment(requestData);
  };
  
  const handleCloseConfirmDialog = () => {
    setConfirm(null);
  }

  const [paginationModel, setPaginationModel] = React.useState({
    pageSize: 25,
    page: 0,
  });
  const [error, setError] = useState();
  const [open, setOpen] = React.useState(false);
  const [selectedCourse, setSelectedCourse] = React.useState();
  const [classrooms, setClassrooms] = useState();
  const [selectedClassroom, setSelectedClassroom] = React.useState();
  const [confirm, setConfirm] = React.useState();
  const navigator = useNavigate();

  const callGetClassrooms = async () => {
    apiHelper().get(`/classrooms/registerable?courseId=${selectedCourse.id}`).then((response) => {
      if (Array.from(response.data).length == 0) {
        setError("There is no classrooms available of this course!");
      } else {
        setClassrooms(response.data);
        handleClose();
      }
    }, (e) => {
      handleClose();
      if (e.message == MESSAGE_INVALID_TOKEN) {
        navigator("/login");
      }
    });
  };

  const handleGetClassrooms = () => {
    callGetClassrooms();
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseClassroomsDialog = () => {
    setClassrooms(null);
  };

  const handleCloseErrorDialog = () => {
    setError(null);
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
            <Button onClick={handleGetClassrooms}>Select classroom</Button>
          </DialogActions>
        </Dialog> : <></>
      }
      {
        classrooms ? <Dialog
          open={classrooms}
          fullScreen
          // TransitionComponent={Transition}
          keepMounted
          onClose={handleCloseClassroomsDialog}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle>{`Choose classroom to begin your study career`}</DialogTitle>
          <Box mx={3} my={1}>
          <DataGrid
                  paginationModel={paginationModel}
                  onPaginationModelChange={setPaginationModel}
                  columns={classroomColumns}
                  rows={classrooms}
                />
          </Box>
          <DialogActions>
            <Button onClick={handleCloseClassroomsDialog}>Cancel</Button>
            <Button onClick={handleGetClassrooms}>Select classroom</Button>
          </DialogActions>
        </Dialog> : <></>
      }
      {
        error ? <Dialog
          open={error}
          onClose={handleCloseErrorDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Notification"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {error}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseErrorDialog} autoFocus>
              Agree
            </Button>
          </DialogActions>
        </Dialog> : <></>
      }
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
              Do you want to pay now?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
          <Button onClick={() => {
            callCreatePayment({
              classroomId: confirm.id
            })
          }} autoFocus>
              Pay now
            </Button>
            <Button onClick={() => {
              callRegisterNoPayment({
                classroomId: confirm.id
              })
            }} autoFocus>
              Pay later
            </Button>
          </DialogActions>
        </Dialog> : <></>
      }
      {
        error ? <Dialog
          open={error}
          onClose={handleCloseErrorDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Notification"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {error}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseErrorDialog} autoFocus>
              Agree
            </Button>
          </DialogActions>
        </Dialog> : <></>
      }
    </>
  )
}

export default CoursesCard
