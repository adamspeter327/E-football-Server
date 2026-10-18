const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 8080;
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
const rooms = new Map();
function generateRoomCode() {
    const part1 = Math.floor(1000 + Math.random() * 9000);
    const part2 = Math.floor(1000 + Math.random() * 9000);
    return `${part1}-${part2}`;
}
app.get('/health', (req, res) => {
    res.status(200).json({ ok: true, service: 'football-room-server' });
});
app.get('/api/rooms', (req, res) => {
    const activeRooms = Array.from(rooms.values());
    res.status(200).json({ ok: true, count: activeRooms.length, rooms: activeRooms });
});
app.post('/api/rooms', (req, res) => {
    const { name } = req.body || {};
    const roomName = (name && name.trim()) ? name.trim() : 'Untitled Room';
    const code = generateRoomCode();
    const newRoom = { code, name: roomName, createdAt: new Date().toISOString() };
    rooms.set(code, newRoom);
    res.status(201).json({ ok: true, room: newRoom });
});
app.post('/api/rooms/join', (req, res) => {
    const { code } = req.body || {};
    if (!code || !rooms.has(code.trim())) {
        return res.status(404).json({ ok: false, error: 'Room not found or expired' });
    }
    res.status(200).json({ ok: true, room: rooms.get(code.trim()) });
});
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${PORT}`);
});