import { Calendar } from "fullcalendar";
import { useEffect, useState } from "react";
import Footer from "../common/footer/Footer";
import Header from "../common/header/Header";
import Back from "../common/back/Back";
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import FullCalendar from "@fullcalendar/react";
import apiHelper, { MESSAGE_INVALID_TOKEN, SERVICE_UNAVAILABLE } from "../../utils/Axios";
import dayjs from "dayjs";
import { Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Typography, Button, Switch } from "@mui/material";
import { useNavigate } from "react-router-dom";
import React from "react";
import { DataGrid } from "@mui/x-data-grid";

const Schedule = () => {
    const [selectedEvent, setSelectedEvent] = useState();
    const [schedules, setSchedules] = useState([]);
    const [error, setError] = useState();

    const callGetAllSchedule = () => {
        try {
            apiHelper().get("/timetables").then((response) => {
                const mappedData = Array.from(response.data.schedules).map((item) => {
                    const tmpItem = {
                        title: item.subject.name,
                        date: dayjs(item.date).format("YYYY-MM-DD"),
                        period: item.period,
                        data: item
                    };
                    return tmpItem;
                });
                console.log(mappedData);
                setSchedules(mappedData);
            }, (e) => {
                if (e.message == MESSAGE_INVALID_TOKEN) {
                    localStorage.clear();
                } else {
                    setError(e.response.data.message);
                }
            })
        } catch (e) {
            setError(e.response.data.message);
        }
    }

    const [classrooms, setClassrooms] = useState([]);

    const callGetAllSchedule2 = () => {
        try {
            apiHelper().get("/timetables/student").then((response) => {
                setClassrooms(response.data);
            }, (e) => {
                if (e.message == MESSAGE_INVALID_TOKEN) {
                    localStorage.clear();
                } else {
                    setError(e.response.data.message);
                }
            })
        } catch (e) {
            setError(e.response.data.message);
        }
    }

    const handleCloseErrorDialog = () => {
        setError(null);
    }

    const getPeriodName = (period) => {
        if (period === 0) {
            return "Morning";
        } else {
            return "Afternoon";
        }
    }

    useEffect(() => {
        callGetAllSchedule();
        callGetAllSchedule2();
    }, []);

    const [calendarView, setCalendarView] = useState(true);

    const [paginationModel, setPaginationModel] = useState({
        pageSize: 25,
        page: 0,
    });

    const classroomColumns = [
        { field: "id", headerName: "Classroom ID", flex: 1 },
        { field: "name", headerName: "Classroom Name", flex: 1 },
        { field: "teacher.id", headerName: "Teacher", flex: 1, valueGetter: (params) => params.row?.teacher.fullName },
        { field: "startDate", headerName: "Start date", flex: 1, valueGetter: (params) => dayjs(params.row?.startDate).format("DD/MM/YYYY") },
        { field: "endDate", headerName: "End date", flex: 1, valueGetter: (params) => dayjs(params.row?.endDate).format("DD/MM/YYYY") },
    ]

    const [subjects, setSubjects] = useState();
    const [documents, setDocuments] = useState();

    const handleClassroomClicked = (params) => {
        const c = params.row;
        setSubjects(c.course.subjects)
    }

    const handleSubjectClicked = (params) => {
        const s = params.row;
        setDocuments(s.documents);
    }

    const subjectColumns = [
        { field: "id", headerName: "Subject ID", flex: 1 },
        { field: "name", headerName: "Subject Name", flex: 1 },
        { field: "lessons", headerName: "Number of lessons", flex: 1 },
    ]
    const documentColumns = [
        { field: "id", headerName: "Document ID", flex: 1 },
        { field: "name", headerName: "Document Name", flex: 1 },
        {
            field: "action",
            headerName: "Action",
            sortable: false,
            renderCell: ({ row }) => (
              row.isPaid ? <></> : <Button onClick={() => {
                window.open(row.url, "_blank")
              }}>
                Info
              </Button>
      
            ),
          }
    ]

    return (
        <>
            <Header />
            <Back title='Schedule' />
            <Box mx={20}>
            <Button onClick={() => {
                setCalendarView(true);
            }}>
                Calendar view
            </Button>
            <Button onClick={() => {
                setCalendarView(false);
            }}>
                List view
            </Button>
                {
                    calendarView ? <FullCalendar
                    plugins={[dayGridPlugin]}
                    initialView="dayGridMonth"
                    events={schedules}
                    eventOrder={"extendedProps.period"}
                    eventClick={(info) => {
                        console.log(info.event._def);
                        setSelectedEvent({
                            title: info.event._def.title,
                            date: dayjs(info.event._instance.range.start).format("DD/MM/YYYY"),
                            data: info.event._def.extendedProps.data
                        })
                    }}
                    eventChange={(event) => {
                        console.log(event);
                    }}
                /> : <DataGrid
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                columns={classroomColumns}
                rows={classrooms}
                onRowClick={handleClassroomClicked} {...classrooms}
                getRowId={(row) => {
                    return row.id
                }}
            />
                }
            </Box>
            {
                selectedEvent ? <Dialog
                    fullWidth
                    open={selectedEvent}
                    onClose={() => {
                        setSelectedEvent(null);
                    }}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        {"Schedule details"}
                    </DialogTitle>
                    <DialogContent>
                        <Box>
                            <Typography variant="h6">Course info</Typography>
                            <TextField fullWidth disabled defaultValue={`${selectedEvent.data.classroom.course.id} | ${selectedEvent.data.classroom.course.name}`} />
                        </Box>
                        <Box>
                            <Typography variant="h6">Classroom info</Typography>
                            <TextField fullWidth disabled defaultValue={`${selectedEvent.data.classroom.id} | ${selectedEvent.data.classroom.name}`} />
                        </Box>
                        <Box>
                            <Typography variant="h6">Subject info</Typography>
                            <TextField fullWidth disabled defaultValue={`${selectedEvent.data.subject.id} | ${selectedEvent.data.subject.name}`} />
                        </Box>
                        <Box>
                            <Typography variant="h6">Room info</Typography>
                            <TextField fullWidth disabled defaultValue={`${selectedEvent.data.room.name}`} />
                        </Box>
                        <Box>
                            <Typography variant="h6">Teacher</Typography>
                            <TextField fullWidth disabled defaultValue={`${selectedEvent.data.teacher.fullName}`} />
                        </Box>
                        <Box>
                            <Typography variant="h6">Period</Typography>
                            <TextField fullWidth disabled defaultValue={getPeriodName(selectedEvent.data.period)} />
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => {
                            setSelectedEvent(null);
                        }} autoFocus>
                            Close
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
            {
        subjects ? <Dialog
          open={subjects}
          fullScreen
          // TransitionComponent={Transition}
          keepMounted
          onClose={() => {
            setSubjects(null);
          }}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle>{`Subject list`}</DialogTitle>
          <Box mx={3} my={1}>
          <DataGrid
                  paginationModel={paginationModel}
                  onPaginationModelChange={setPaginationModel}
                  columns={subjectColumns}
                  rows={subjects}
                  onRowClick={handleSubjectClicked} {...subjects}
                />
          </Box>
          <DialogActions>
            <Button onClick={() => {
                setSubjects(null);
            }}>Close</Button>
          </DialogActions>
        </Dialog> : <></>
      }
      {
        documents ? <Dialog
          open={documents}
          fullScreen
          // TransitionComponent={Transition}
          keepMounted
          onClose={() => {
            setSubjects(null);
          }}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle>{`Subject list`}</DialogTitle>
          <Box mx={3} my={1}>
          <DataGrid
                  paginationModel={paginationModel}
                  onPaginationModelChange={setPaginationModel}
                  columns={documentColumns}
                  rows={documents}
                />
          </Box>
          <DialogActions>
            <Button onClick={() => {
                setDocuments(null);
            }}>Close</Button>
          </DialogActions>
        </Dialog> : <></>
      }
            <Footer />
        </>
    )
}

export default Schedule