import { Calendar } from "fullcalendar";
import { useEffect, useState } from "react";
import Footer from "../common/footer/Footer";
import Header from "../common/header/Header";
import Back from "../common/back/Back";
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import FullCalendar from "@fullcalendar/react";
import apiHelper, { MESSAGE_INVALID_TOKEN, SERVICE_UNAVAILABLE } from "../../utils/Axios";
import dayjs from "dayjs";
import { Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

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
                    setError(SERVICE_UNAVAILABLE);
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
    }, []);

    return (
        <>
            <Header />
            <Back title='Schedule' />
            <Box mx={20}>
                <FullCalendar
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
                />
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
            <Footer />
        </>
    )
}

export default Schedule