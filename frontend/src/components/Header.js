import React, { useN } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar as MuiAppBar,
  Toolbar,
  Typography,
  Button,
} from "@mui/material";

const Header = ({ appBarColor }) => {
  const navigate = useNavigate();

  const handleAbout = () => {
    navigate("/about");
  };

  const handleContact = () => {
    navigate("/contact");
  };

  const handleHome = () => {
    navigate("/");
  };

  const handleFileStatus = () => {
    navigate("/status");
  };

  return (
    <MuiAppBar position="static" sx={{ backgroundColor: appBarColor }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Temporary File Sharing Portal
        </Typography>
        <Button color="inherit" onClick={() => handleHome()}>
          Home
        </Button>
        <Button color="inherit" onClick={() => handleFileStatus()}>
          Download File
        </Button>
        {/* Add your buttons here */}
        <Button color="inherit" onClick={() => handleAbout()}>
          About Us
        </Button>
        <Button color="inherit" onClick={() => handleContact()}>
          Contact Us
        </Button>
        {/* Add more buttons as needed */}
      </Toolbar>
    </MuiAppBar>
  );
};

export default Header;
