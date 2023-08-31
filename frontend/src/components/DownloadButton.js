import React from "react";
import Button from "@mui/material/Button";

const DownloadButton = () => {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = downloadLink;
    link.download = "your_file_name.extension"; // Set the desired file name
    link.target = "_blank"; // To open the download link in a new tab
    link.click();
  };

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={handleDownload}
      sx={{ marginTop: "1rem" }}
    >
      Download Resource
    </Button>
  );
};

export default DownloadButton;
