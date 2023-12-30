const http=require("http");
const express =require("express");
const cors = require("cors");
const socketIO = require("socket.io");

const app=express();
const port= process.env.PORT||3001 ;


const users=[{}];

app.use(cors());
app.get("/",(req,res)=>{
    res.send("HELL ITS WORKING");
})

const server=http.createServer(app);

const io=socketIO(server);

io.on("connection",(socket)=>{
    console.log("New Connection");

    socket.on('joined',({user,id})=>{
          users[socket.id]=user;
          console.log(`${user} has joined `);
          socket.broadcast.emit('userJoined',{user:"Admin",data:` ${users[socket.id]} has joined`,id:id});
          socket.emit('welcome',{user:"Admin",data:`Welcome to the chat`,id:id})
    })
    socket.on('stream', (stream) => {
        // Broadcast the stream to other connected users
        socket.broadcast.emit('stream', stream);
      });
     socket.on('msg',({data,id,time,seen, image})=>{
        io.emit('sendMessage',{user:users[id],data,id,time:time,seen:seen,image:image});
    })

    socket.on('disconnect',()=>{
          socket.broadcast.emit('leave',{user:"Admin",data:`${users[socket.id]}  has left`});
        console.log(`user left`);
    })
});


app.listen(port,()=>{
    console.log(`Working`);
})
