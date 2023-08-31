import React, { useState } from "react";
import { TextField, Button, Container, Typography } from "@mui/material";
import Header from "./Header";
import axios from "axios";

const Feedback = () => {
  const [feedback, setFeedback] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("sending");

    axios
      .post(`${process.env.REACT_APP_FEEDBACK || "http://localhost/publish"}`, {
        message: feedback,
        email,
        topicArn: process.env.REACT_APP_SNS_TOPIC_ARN,
      })
      .then((response) => {
        console.log("Feedback sent successfully:", response.data);
        setFeedback("");
        setEmail("");
      })
      .catch((error) => {
        console.error("Error sending feedback:", error);
        // Handle error here, e.g., show an error message to the user
      });

    console.log("Submitted feedback:", feedback);
    console.log("Submitted email:", email);
    setFeedback("");
    setEmail("");
  };

  return (
    <div>
      <Header />
      <Container sx={{ marginTop: 10 }}>
        <Typography variant="h4">Contact Us</Typography>
        <hr />
        <Typography variant="body1">
          For any inquiries or questions, please feel free to reach out to us
          using the contact information below:
        </Typography>
        <Typography variant="body2">Email: Darshil.Patel@dal.ca</Typography>
        <Typography variant="body2" sx={{ marginBottom: 5 }}>
          Phone: +1 (782) 882 4489
        </Typography>
        <hr />
        <Typography variant="h4" gutterBottom sx={{ marginTop: 5 }}>
          Inquiries / Feedback
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            sx={{ maxWidth: 400 }}
            label="Your Email"
            type="email"
            fullWidth
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <br />
          <br />
          <br />

          <TextField
            label="Your Feedback"
            multiline
            rows={4}
            fullWidth
            variant="outlined"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            required
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            style={{ marginTop: "1rem" }}
          >
            Submit
          </Button>
        </form>
      </Container>
      <Container maxWidth="sm"></Container>
    </div>
  );
};

export default Feedback;
