const http = require("http");
const express = require("express");
const router = require("./src/routes");
const cors = require("cors");
const { Server } = require("socket.io");
const port = 5000;

const app = express();

app.use(express.json());
app.use(cors());
app.use("/api/v1/", router);
app.use("/uploads", express.static("uploads"));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

require("./src/socket")(io);

server.listen(port, () => {
  console.log(`linsten on port ${port}`);
});
