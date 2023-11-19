import React, { useState } from "react"
import "./courses.css"
import { Autocomplete, Box, Button, CardMedia, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, FormControl, Grid, Input, InputLabel, List, ListItemButton, ListItemIcon, ListItemText, MenuItem, Paper, Select, TextField, Typography, selectClasses } from "@mui/material";
import { DialogTitle } from '@mui/material';
import { CloudUploadRounded } from "@mui/icons-material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import apiHelper from "../../utils/Axios.js";
import { DataGrid, GridDeleteIcon, GridViewColumnIcon } from "@mui/x-data-grid";

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
          Pay
        </Button>
      ),
    }
  ];

  const callCreatePayment = async (requestData) => {
    try {
      const response = await apiHelper().post("/payments/create", requestData);
      window.location.replace(response.data);
    } catch (e) {
      setError(e.response.data.message);
    }
  };

  const onPayClicked = (row) => {
    const requestData = {
      price: selectedCourse.tuition
    };
    callCreatePayment(requestData);
  };

  const [paginationModel, setPaginationModel] = React.useState({
    pageSize: 25,
    page: 0,
  });
  const [error, setError] = useState();
  const [open, setOpen] = React.useState(false);
  const [selectedCourse, setSelectedCourse] = React.useState();
  const [classrooms, setClassrooms] = useState();

  const callGetClassrooms = async () => {
    try {
      const response = await apiHelper().get(`/classrooms/registerable?courseId=${selectedCourse.id}`);
      setClassrooms(response.data);
    } catch(e) {
      setError(e.response.data.message);
    } finally {
      handleClose();
    }
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
                  // onRowClick={handleStudentClicked} {...students}
                />
          </Box>
          <DialogActions>
            <Button onClick={handleCloseClassroomsDialog}>Cancel</Button>
            <Button onClick={handleGetClassrooms}>Select classroom</Button>
          </DialogActions>
        </Dialog> : <></>
      }
    </>
  )
}

export default CoursesCard
