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

const Registrations = () => {
    const [error, setError] = useState();
    const [registrations, setRegistrations] = useState([]);

    const callGetAllSchedule2 = () => {
        try {
            apiHelper().get("/timetables/student").then((response) => {
                setRegistrations(response.data);
            }, (e) => {
                if (e.message == MESSAGE_INVALID_TOKEN) {
                    localStorage.clear();
                    window.location.replace("/login");
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

    useEffect(() => {
        callGetAllSchedule2();
    }, []);

    const [paginationModel, setPaginationModel] = useState({
        pageSize: 25,
        page: 0,
    });

    const classroomColumns = [
        { field: "classroom.id", headerName: "Classroom ID", flex: 1, valueGetter: (params) => params.row?.classroom.id },
        { field: "classroom.name", headerName: "Classroom Name", flex: 1, valueGetter: (params) => params.row?.classroom.name },
        { field: "classroom.teacher.id", headerName: "Teacher", flex: 1, valueGetter: (params) => params.row?.classroom.teacher.fullName },
        { field: "classroom.startDate", headerName: "Start date", flex: 1, valueGetter: (params) => dayjs(params.row?.classroom.startDate).format("DD/MM/YYYY") },
        { field: "classroom.endDate", headerName: "End date", flex: 1, valueGetter: (params) => dayjs(params.row?.classroom.endDate).format("DD/MM/YYYY") },
        { field: "isPaid", headerName: "Status", flex: 1, valueGetter: (params) => getPaymentStatus(params.row?.isPaid) },
    ]

    const getPaymentStatus = (flag) => {
        return flag ? "PAID" : "UNPAID";
    };

    const [subjects, setSubjects] = useState();

    const handleClassroomClicked = (params) => {
        const c = params.row.classroom;
        setSubjects(c.course.subjects)
    }

    const subjectColumns = [
        { field: "id", headerName: "Subject ID", flex: 1 },
        { field: "name", headerName: "Subject Name", flex: 1 },
        { field: "lessons", headerName: "Number of lessons", flex: 1 },
    ]

    return (
        <>
            <Header />
            <Back title='Registered classrooms' />
            <Box mx={20}>
                <DataGrid
                    paginationModel={paginationModel}
                    onPaginationModelChange={setPaginationModel}
                    columns={classroomColumns}
                    rows={registrations}
                    onRowClick={handleClassroomClicked} {...registrations}
                    getRowId={(row) => {
                        return `${row.classroom.id} | ${row.student.id}`;
                    }}
                />
            </Box>
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
                        />
                    </Box>
                    <DialogActions>
                        <Button onClick={() => {
                            setSubjects(null);
                        }}>Close</Button>
                    </DialogActions>
                </Dialog> : <></>
            }
            <Footer />
        </>
    )
}

export default Registrations