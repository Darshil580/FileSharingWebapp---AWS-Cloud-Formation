import React, { useState } from "react";
import axios from "axios";
import {
  Button,
  LinearProgress,
  Snackbar,
  Alert,
  Box,
  Typography,
} from "@mui/material";
import { FileCopyOutlined } from "@mui/icons-material";
import { CopyToClipboard } from "react-copy-to-clipboard";

const Upload = ({ onProgressChange, barColor, email }) => {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const [responseJSON, setResponseJSON] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("email", email);

    try {
      const response = await axios.post(
        `${
          process.env.REACT_APP_EC2 ||
          process.env.REACT_APP_API ||
          "http://localhost/upload"
        }`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const percentage = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress(percentage);
            onProgressChange(percentage); // Notify the Dashboard component about progress change
          },
        }
      );

      // Add a small delay to make the progress bar animate smoothly
      await new Promise((resolve) => setTimeout(resolve, 500));

      setFile(null);
      setProgress(0);
      setSnackbarMessage("File uploaded successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setResponseJSON(response.data);
    } catch (error) {
      console.error("Error uploading file:", error);
      setSnackbarMessage("Error uploading file!");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <div style={{ margin: "50px auto", width: "300px" }}>
      <input type="file" onChange={handleFileChange} />
      <Button
        variant="contained"
        color="primary"
        onClick={handleUpload}
        disabled={!file}
        style={{ marginTop: "10px" }}
      >
        Upload File
      </Button>
      {responseJSON && (
        <Box
          sx={{
            mt: 3,
            p: 2,
            bgcolor: "rgba(0, 0, 0, 0.1)",
            borderRadius: 4,
            width: 300,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Access Code
          </Typography>
          <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
            {JSON.stringify(responseJSON.response.accessCode, null, 2).replace(
              /"/g,
              ""
            )}
          </Typography>
          <CopyToClipboard
            text={JSON.stringify(
              responseJSON.response.accessCode,
              null,
              2
            ).replace(/"/g, "")}
            onCopy={() => setCopied(true)}
          >
            <Button
              startIcon={<FileCopyOutlined />}
              variant="outlined"
              size="small"
              sx={{ mt: 1 }}
            >
              {copied ? "Copied!" : "Copy to Clipboard"}
            </Button>
          </CopyToClipboard>
        </Box>
      )}
      {progress > 0 && (
        <>
          {/* <LinearProgress
            variant="determinate"
            value={progress}
            color="secondary"
            style={{
              marginTop: '10px',
              borderRadius: '10px',
              background: '#f0f0f0',
              height: '10px',
            }}
          /> */}
          <LinearProgress
            variant="indeterminate"
            color="primary"
            style={{
              marginTop: "5px",
              height: "2px",
            }}
          />
        </>
      )}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Upload;
