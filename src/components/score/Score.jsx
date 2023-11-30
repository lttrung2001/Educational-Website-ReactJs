import { Calendar } from "fullcalendar";
import { useEffect, useState } from "react";
import Footer from "../common/footer/Footer";
import Header from "../common/header/Header";
import Back from "../common/back/Back";
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import FullCalendar from "@fullcalendar/react";
import apiHelper, { MESSAGE_INVALID_TOKEN, SERVICE_UNAVAILABLE } from "../../utils/Axios";
import dayjs from "dayjs";
import { Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Typography, Button, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import React from 'react';

const Score = () => {
    const [paginationModel, setPaginationModel] = React.useState({
        pageSize: 25,
        page: 0,
    });

    const [error, setError] = useState();
    const [scores, setScores] = React.useState([]);
    const [classroomName, setClassroomName] = React.useState('')

    const callGetScores = async (requestData) => {
        apiHelper().post("/scores/student", requestData).then((response) => {
            setScores(response.data);
        }, (e) => {
            if (e.message == MESSAGE_INVALID_TOKEN) {
                localStorage.clear();
            } else {
                setError(SERVICE_UNAVAILABLE);
            }
        });
    };

    const callGetClassrooms = async () => {
        apiHelper().get("/scores/student/classrooms").then((response) => {
            setClassrooms(response.data);
            if (Array.from(response.data).length > 0) {
                setClassroom(response.data[0]);
                const requestData = {
                    classroomId: response.data[0].id
                }
                callGetScores(requestData);
            }
        }, (e) => {
            if (e.message == MESSAGE_INVALID_TOKEN) {
                localStorage.clear();
            } else {
                setError(SERVICE_UNAVAILABLE);
            }
        });
    };

    useEffect(() => {
        callGetClassrooms();
    }, []);

    const handleCloseErrorDialog = () => {
        setError(null);
    }

    const scoreColumns = [
        { field: "subject.id", headerName: "Subject ID", flex: 1, valueGetter: (params) => params.row?.subject.id },
        { field: "subject.name", headerName: "Subject Name", flex: 1, valueGetter: (params) => params.row?.subject.name },
        { field: "score1", headerName: "Score 1", flex: 1, valueGetter: (params) => params.row?.score1 },
        { field: "score2", headerName: "Score 2", flex: 1, valueGetter: (params) => params.row?.score2 },
        { field: "score3", headerName: "Score 3", flex: 1, valueGetter: (params) => params.row?.score3 },
        { field: "avg", headerName: "Avg", flex: 1, valueGetter: (params) => getAvg(params.row) }
    ]

    const getAvg = (row) => {
        return (row.score1 * row.classroom.rate1 + row.score2 * row.classroom.rate2 + row.score3 * row.classroom.rate3) / 100
    }

    const [classroom, setClassroom] = React.useState();
    const [classrooms, setClassrooms] = React.useState([]);

    const handleChange = (event) => {
        const selected = event.target.value;
        setClassroom(selected);
        console.log("SELECTED", selected);
        const requestData = {
            classroomId: selected.id
        }
        console.log("DATA::", requestData);
        callGetScores(requestData);
    };

    return (
        <>
            <Header />
            <Back title='Score' />
            <Box mx={20}>
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Classroom</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={classroom}
                        label="Classroom"
                        onChange={handleChange}
                    >
                        {
                            Array.from(classrooms).map((c) => {
                                return <MenuItem value={c}>{c.name}</MenuItem>
                            })
                        }
                    </Select>
                </FormControl>
                <div style={{ height: 400, width: '100%' }}>
                    <DataGrid
                        paginationModel={paginationModel}
                        onPaginationModelChange={setPaginationModel}
                        columns={scoreColumns}
                        rows={scores}
                        getRowId={(row) => {
                            return row.subject.id
                        }}
                    />
                </div>
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
            <Footer />
        </>
    )
}

export default Score