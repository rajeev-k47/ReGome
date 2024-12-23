const express = require('express');
const { ExpressPeerServer } = require('peer');
const app = express();
const rooms = {}
const roommembers = {}

const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer, {
  cors: {
    origin: '*',
  },
});
app.set('view engine', 'ejs');
app.use(express.static('public'));
const peerServer = ExpressPeerServer(httpServer, {
  debug: true,
});
app.use('/peerjs', peerServer);
app.get('/', (req, res) => {
  return res.render('index');
});

io.on('connection', (socket) => {
  socket.on('roomid',(userid)=>{
    rooms[userid] = userid
	 io.emit('rooms',rooms)
  })
  socket.on('roommember',({roomid,userid})=>{
    if(!roommembers[roomid]){
      roommembers[roomid]= []
    }
    roommembers[roomid].push(userid)
	  io.emit('roommembers',roommembers)
  })
  socket.on('messagebyuser', ({message,sender,mroom_id})=>{
    io.emit('messageemit', ({message,sender,mroom_id}))
  })
  socket.on('videolink',({vlink,room_id})=>{
      io.emit('video-link',{vlink:vlink,room_id:room_id})
  })
  socket.on('videoState',(currentTime)=>{
      io.emit('back_videoState',currentTime)
  })
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => console.log(`App is listening on ${PORT}`));
