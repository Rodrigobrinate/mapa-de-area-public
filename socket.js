const server = require("./express")

const { Server } = require("socket.io");
const io = new Server(server,{
  cors: {
    origin: "*",
    // or with an array of origins
    // origin: ["https://my-frontend.com", "https://my-other-frontend.com", "http://localhost:3000"],
    //credentials: true
  }
});

module.exports = io