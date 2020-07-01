const express = require("express");
const bodyParser = require("body-parser");
const http = require("http");
const socketIO = require("socket.io");
const fs = require("fs");
const mongoose = require("mongoose");

const cors = require("cors");

const PORT = process.env.PORT || 5000;

const events = require("./routes/eventRoutes");
const numImgs = require("./routes/numImgsRoutes");

const app = express();

const server = app
  .use(express.static("public"))
  .listen(PORT, () => console.log(`Server started on port ${PORT}`));

app.use(bodyParser.json());
app.use(cors());

app.use("/api/events", events);
app.use("/api/numImgs", numImgs);

let io = socketIO(server);

const mongoURI =
  "mongodb+srv://AdamPodoxin:PodGaming1107@cluster-main-ycagi.mongodb.net/Podoxin-Four-Website?retryWrites=true&w=majority";

mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

io.on("connection", (socket) => {
  socket.on("get gallery images", (data) => {
    fs.readdir("public/img/gallery/", (err, files) => {
      socket.emit("return gallery images", files);
    });
  });

  socket.on("upload events json", (eventsData) => {
    var postData = JSON.stringify({
      data: JSON.stringify(JSON.parse(eventsData)),
      item: "events",
    });

    var options = {
      hostname: "",
      port: PORT,
      path: "/api/events",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    };

    var req = http.request(options);

    req.on("error", (e) => {
      console.error(e);
    });

    req.write(postData);
    req.end();

    socket.emit("data sent successfully");
  });

  socket.on("get events json", () => {
    var options = {
      host: "",
      path: "/api/events",
      port: PORT,
    };

    let callback = (response) => {
      let strResponse = "";

      response.on("data", (chunk) => {
        strResponse += chunk;
      });

      response.on("end", () => {
        const returnData = JSON.parse(strResponse);
        socket.emit("return events json", returnData);
      });
    };

    http.request(options, callback).end();
  });

  socket.on("get numImgs", () => {
    var options = {
      host: "",
      path: "/api/numImgs",
      port: PORT,
    };

    let callback = (response) => {
      let strResponse = "";

      response.on("data", (chunk) => {
        strResponse += chunk;
      });

      response.on("end", () => {
        const returnData = parseInt(strResponse);
        socket.emit("return numImgs", returnData);
      });
    };

    http.request(options, callback).end();
  });

  socket.on("upload numImgs", (numImgs) => {
    var postData = JSON.stringify({
      numImgs,
      item: "numImgs",
    });

    var options = {
      hostname: "",
      port: PORT,
      path: "/api/numImgs",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    };

    var req = http.request(options);

    req.on("error", (e) => {
      console.error(e);
    });

    req.write(postData);
    req.end();

    socket.emit("data sent successfully");
  });
});
