const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });
app.use(express.static('public'));

const users = {}; // id -> {name, room, lat, lng}
const list = room =>
  Object.entries(users).filter(([, u]) => u.room === room).map(([id, u]) => ({ id, ...u }));

io.on('connection', s => {
  s.on('join', ({ name, room }) => {
    name = String(name || 'Anonyme').slice(0, 30);
    room = String(room || 'general').slice(0, 30);
    users[s.id] = { name, room, lat: null, lng: null };
    s.join(room);
    io.to(room).emit('users', list(room));
  });

  s.on('pos', ({ lat, lng }) => {
    const u = users[s.id];
    if (!u || typeof lat !== 'number' || typeof lng !== 'number') return;
    u.lat = lat; u.lng = lng;
    io.to(u.room).emit('users', list(u.room));
  });

  s.on('msg', ({ to, text }) => {
    const u = users[s.id];
    if (!u || !text) return;
    const m = { from: s.id, name: u.name, to, text: String(text).slice(0, 500), t: Date.now() };
    if (to === 'all') io.to(u.room).emit('msg', m);
    else if (users[to] && users[to].room === u.room) { io.to(to).emit('msg', m); s.emit('msg', m); }
  });

  // Signalisation WebRTC (appels audio)
  s.on('signal', ({ to, data }) => {
    const u = users[s.id], t = users[to];
    if (u && t && u.room === t.room) io.to(to).emit('signal', { from: s.id, name: u.name, data });
  });

  s.on('disconnect', () => {
    const u = users[s.id];
    delete users[s.id];
    if (u) io.to(u.room).emit('users', list(u.room));
  });
});

server.listen(process.env.PORT || 3000, () => console.log('OK'));
