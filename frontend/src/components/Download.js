import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';

const AccessCodeForm = ({ onAccessCodeSubmit }) => {
  const [accessCode, setAccessCode] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onAccessCodeSubmit(accessCode);
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        label="Access Code"
        value={accessCode}
        onChange={(e) => setAccessCode(e.target.value)}
        required
      />
      <Button variant="contained" type="submit">Submit</Button>
    </form>
  );
};

const Download = () => {
    
  const [accessCodeStatus, setAccessCodeStatus] = useState('');
  const [fileDownloaded, setFileDownloaded] = useState(false);

  const handleAccessCodeSubmit = (accessCode) => {

    const status = accessCode === '1234' ? 'Valid' : 'Invalid';
    setAccessCodeStatus(status);
  };

  const handleDownloadFile = () => {

    setFileDownloaded(true);
  };

  return (
    <div>
      <h1>Access Code App</h1>
      <AccessCodeForm onAccessCodeSubmit={handleAccessCodeSubmit} />
      <p>Status: {accessCodeStatus}</p>
      <Button variant="contained" onClick={handleDownloadFile}>Download File</Button>
      {fileDownloaded && <p>File downloaded successfully!</p>}
    </div>
  );
};

export default Download;
