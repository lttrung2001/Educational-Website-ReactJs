import { Card, CardContent, Typography, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";
import apiHelper, { MESSAGE_INVALID_TOKEN, apiHelperPublic } from "../../utils/Axios";
import React, { useEffect } from "react";

const SuccessScreen = () => {
  const [error, setError] = React.useState();
  const callPaymentSuccess = async (requestData) => {
    try {
        apiHelper().get(`/payments/success?paymentId=${requestData.paymentId}&PayerID=${requestData.PayerID}`).then((response) => {

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
  window.location.replace("/");
}

useEffect(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const requestData = {
    paymentId: urlParams.get("paymentId"),
    PayerID: urlParams.get("PayerID")
  }
  console.log(requestData);
  callPaymentSuccess(requestData);
}, [])
  
    return <>
        <Card>
      <CardContent>
        <Typography variant="h5" component="div">
          Payment Successful
        </Typography>
        <Typography color="text.secondary">
          Thank you for your purchase!
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Your payment has been successfully processed.
        </Typography>
        <Button variant="contained" color="primary" onClick={() => {
          window.location.replace("/")
        }}>
          Go to home
        </Button>
      </CardContent>
    </Card>
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
};

export default SuccessScreen;