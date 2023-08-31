var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const { v4: uuidv4 } = require("uuid");
const bodyParser = require("body-parser");
const axios = require("axios");

const cors = require("cors");
const multer = require("multer");
const AWS = require("aws-sdk");
const multerS3 = require("multer-s3");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

var indexRouter = require("./routes/index");

var app = express();
require("dotenv").config();

app.use(cors({ origin: "*" }));
app.use(logger("dev"));
app.use(express.json());
// app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);

AWS.config.credentials = new AWS.SharedIniFileCredentials();

const s3Client = new AWS.S3();
const dynamodb = new AWS.DynamoDB.DocumentClient({ region: "us-east-1" });
const sns = new AWS.SNS({ region: "us-east-1" });

const HOST = process.env.LOCALHOST;
const PORT = process.env.PORT;

const BUCKET_NAME = "term-project-storage";

const upload = multer({
  storage: multer.memoryStorage(),
});

app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const { email } = req.body;
    const file = req.file;
    const timestamp = Date.now();
    const accessCode = uuidv4();

    const params = {
      Bucket: BUCKET_NAME,
      Key: `${accessCode}_${file.originalname}`,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    const data = await s3Client.upload(params).promise();
    console.log(data.Location);

    const response = await axios.post(`${HOST}:${PORT}/store`, {
      accessCode,
      timestamp,
      email: email,
      fileName: data.Key,
      fileUrl: data.Location,
    });

    // You can send the S3 file URL or any other relevant data back to the frontend if needed
    res
      .status(200)
      .json({ message: "File uploaded successfully", response: response.data });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ error: "Failed to upload file" });
  }
});

app.post("/store", (req, res) => {
  const { email, fileUrl, accessCode, timestamp, fileName } = req.body;

  const item = {
    accessCode,
    timestamp,
    email,
    fileName,
    fileUrl,
    status: "active",
  };

  // DynamoDB Put operation to store the item
  const params = {
    TableName: "files_metadata", // Update with your DynamoDB table name
    Item: item,
  };

  dynamodb.put(params, (err) => {
    if (err) {
      console.error("Error storing data in DynamoDB:", err);
      return res.status(500).json({ error: "Error storing data" });
    }

    console.log("Data stored successfully in DynamoDB");
    return res
      .status(200)
      .json({ message: "Data stored successfully", accessCode });
  });
});

app.post("/filecheck", (req, res) => {
  const accessCode = req.body.accessCode;
  console.log(accessCode);
  // DynamoDB Get operation to retrieve the fileUrl and status based on the accessCode
  const item = {
    accessCode: accessCode,
  };

  const params = {
    TableName: "files_metadata", // Update with your DynamoDB table name
    Key: {
      accessCode: accessCode,
    },
    Item: item,
  };

  dynamodb.get(params, (err, data) => {
    if (err) {
      console.error("Error fetching data from DynamoDB:", err);
      return res.status(500).json({ error: "Error fetching data" });
    }

    if (!data.Item) {
      return res.status(404).json({ error: "File not found" });
    }

    const { fileUrl, status, timestamp } = data.Item;
    console.log(data.Item);

    if (status === "expired") {
      // Status is expired, delete the file from S3
      const deleteParams = {
        Bucket: BUCKET_NAME,
        Key: `${accessCode}_${data.Item.fileName}`,
      };

      s3Client.deleteObject(deleteParams, (deleteErr) => {
        if (deleteErr) {
          console.error("Error deleting file from S3:", deleteErr);
        }
      });

      return res
        .status(400)
        .json({ error: "Link is expired and file is deleted" });
    }

    // Return the fileUrl in the response
    return res.status(200).json({ fileUrl, timestamp });
  });
});

app.post("/publish", (req, res) => {
  let { topicArn, message, email } = req.body;

  if (!topicArn || !message) {
    return res
      .status(400)
      .json({ error: "Missing topicArn or message in the request body." });
  }

  message = `Email: ${email}\nFeedback: ${message}\n`;

  const params = {
    TopicArn: topicArn,
    Message: message,
  };

  sns.publish(params, (err, data) => {
    if (err) {
      console.error("Error publishing to SNS:", err);
      return res.status(500).json({ error: "Error publishing to SNS." });
    }

    console.log("Message published:", data.MessageId);
    return res.status(200).json({ message: "Message published successfully." });
  });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send(err);

  // res.render('error');
});

app.listen(process.env.PORT, () => {
  console.log(`${HOST}:${PORT}`);
});
