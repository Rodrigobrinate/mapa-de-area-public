const express = require('express')
const app = express()
const port = 3000
const router = require('./routes')
const bodyParser = require('body-parser')
const cors = require('cors')
const Socket = require('socket.io');
var http = require('http');
//const io = require("./socket")
const server = http.createServer(app);

//const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server,{
  cors: {
    origin: "*",
    // or witzh an array of origins
    // origin: ["https://my-frontend.com", "https://my-other-frontend.com", "http://localhost:3000"],
    //credentials: true
  }
});

io.on('connection', (socket) => {

    console.log('a user connected');
   
    socket.on("selectRoom", (data)=>{
      socket.join(data.room);
      console.log("selecionou a sala")
      
      socket.on("new", (datanew)=> {
        console.log("emititu novo", datanew)
        io.emit("new")
      })
      
    });
  
  
 // console.log('selectromm:', data);

  });


  

 
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())
app.use(router)





server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

