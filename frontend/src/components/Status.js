import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import {
  Box,
  Button,
  TextField,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import Header from "./Header";

const Status = () => {
  const [accessCode, setAccessCode] = useState("");
  const [timestamp, setTimestamp] = useState(null);
  const [downloadLink, setDownloadLink] = useState("");
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [expired, setExpired] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const handleSnackbarOpen = (message) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleGetAnotherFile = () => {
    setTimestamp(null);
    setDownloadLink("");
    setTimeRemaining(0);
    setExpired(false);
  };

  useEffect(() => {
    if (timestamp && !expired) {
      const timer = setInterval(() => {
        const currentTime = moment();
        const expirationTime = moment(timestamp).add(24, "hours");
        const remainingTime = Math.max(0, expirationTime.diff(currentTime));
        setTimeRemaining(remainingTime);

        if (remainingTime === 0) {
          setExpired(true);
          clearInterval(timer);
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timestamp, expired]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_STATUS || "http://localhost/filecheck"}`,
        { accessCode }
      );

      setTimestamp(response.data.timestamp);
      setDownloadLink(response.data.fileUrl);
      setExpired(false);

      handleSnackbarOpen("Resource available. You can now download the file.");
      setSnackbarSeverity("Success");
    } catch (error) {
      // Handle error
      handleSnackbarOpen("Resource not available. Please try again later.");
      setSnackbarSeverity("error");

      console.error(error);
    }
  };

  const formatTimeRemaining = (time) => {
    const duration = moment.duration(time);
    const hours = Math.floor(duration.asHours());
    const minutes = duration.minutes();
    const seconds = duration.seconds();

    return `${hours} hrs ${minutes} mins ${seconds} secs`;
  };

  return (
    <div>
      <Header />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: "2rem",
        }}
      >
        {expired ? (
          <Typography variant="h5">Resource Expired</Typography>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {timeRemaining > 0 ? (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Typography variant="h5">
                  File Status:Resource Available
                </Typography>
                <Typography variant="h6" sx={{ marginBottom: "1rem" }}>
                  Time:{formatTimeRemaining(timeRemaining)}
                </Typography>
                <Button
                  href={downloadLink}
                  download
                  variant="contained"
                  color="primary"
                >
                  Download Resource
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleGetAnotherFile}
                  sx={{ marginTop: "1rem" }}
                >
                  Get another File
                </Button>
              </Box>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Typography variant="h5">Resource Not Available</Typography>
                <form onSubmit={handleSubmit}>
                  <TextField
                    type="text"
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value)}
                    label="Enter Access Code"
                    variant="outlined"
                    sx={{ marginTop: "1rem" }}
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{ marginTop: "1rem", marginLeft: 2 }}
                  >
                    Submit
                  </Button>
                </form>
              </Box>
            )}
          </Box>
        )}
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity == "error" ? "error" : "success"}
          variant="filled"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Status;
