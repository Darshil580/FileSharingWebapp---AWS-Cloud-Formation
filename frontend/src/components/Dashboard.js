import React, { useState, useEffect } from 'react';
import Upload from './Upload';
import Download from './Download';
import { Container, Card, CardHeader, CardContent, AppBar, Toolbar, Typography, LinearProgress, TextField, Button } from '@mui/material';
import Header from './Header';
import '../assets/css/Dashboard.css'

function Dashboard() {
  const [progress, setProgress] = useState(0);
  const [appBarColor, setAppBarColor] = useState('red'); // Default color, can be any valid MUI color
  const [email, setEmail] = useState('');
  const [isEmailEntered, setIsEmailEntered] = useState(false);

  useEffect(() => {
    const colorOptions = ['red', 'blue', 'green', 'purple', 'orange']; // Add more color options as needed
    const randomColor = colorOptions[Math.floor(Math.random() * colorOptions.length)];
    setAppBarColor(randomColor);
  }, []);

  const handleProgressChange = (percentage) => {
    setProgress(percentage);
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    setIsEmailEntered(true);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const renderContent = () => {
    if (isEmailEntered) {
      return (
        <CardContent>
          <Typography variant="body1">Email: {email}</Typography>
          <Upload onProgressChange={handleProgressChange} barColor={appBarColor} email={email}  />
        </CardContent>
      );
    } else {
      return (
        <CardContent>
          <form onSubmit={handleEmailSubmit}>
            <TextField
              label="Email"
              variant="outlined"
              value={email}
              onChange={handleEmailChange}
              fullWidth
              required
            />
            <Button type="submit" variant="contained" sx={{ marginTop: 2 }}>
              Submit
            </Button>
          </form>
        </CardContent>
      );
    }
  };

  return (
    <div>
      <Header appBarColor={appBarColor} />
      <Container maxWidth="sm" sx={{ marginTop: 20 }}>
        <Card>
          <CardHeader title={isEmailEntered ? "File Upload" : "Enter Email"} />
          {renderContent()}
        </Card>
      </Container>
    </div>
  );
}

export default Dashboard;
