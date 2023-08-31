import React from "react";
import { Container, Typography } from "@mui/material";
import Header from "./Header";

const About = () => {
  return (
    <div>
      <Header />
      <Container sx={{ marginTop: 5 }}>
        <Typography variant="h4">About Us</Typography>
        <br />

        <Typography variant="h6">
          Darshil Patel - Student (Cloud Technologies)
          <br />
          Education: Master of Applied Computer Science, [Dalhousie
          University],[Expected Graduation: April 2024]
        </Typography>
        <br />
        <Typography variant="body1">
          This wensit is simply is a demonstration of Usage of cloud
          technologies used.
          <br />
          <Typography variant="h6">Compute Service</Typography>
          <ul>
            <li>EC2 : Backend Node ExpressJS</li>
            <li>ElasticL Frontend ReactJS Beanstalk</li>
            <li>Lambda: Cronjob to check file status Every minute.</li>
          </ul>
          <Typography variant="h6">Storage</Typography>
          <ul>
            <li>S3: File Storing</li>
            <li>DynamoDB: File MetaData Storage</li>
          </ul>
          <Typography variant="h6">Network</Typography>
          <ul>
            <li>API Gateway: Communication Frontend and Backend</li>
          </ul>
          <Typography variant="h6">General</Typography>
          <ul>
            <li>SNS: Feedback/Indquiry Form to send email to owner.</li>
            <li>Event Bridge: Triggering Lambda Every 1 minute.</li>
            <li>Cloud Formation: For Provisioning Resource.</li>
          </ul>
        </Typography>
        <Typography variant="body1">
          If you have any questions or would like to learn more about our
          company, feel free to contact us using the information provided on our
          "Contact Us" page.
        </Typography>
      </Container>
    </div>
  );
};

export default About;
