import http from 'http';
import SocketService from './services/socket';

const PORT = process.env.PORT || 8000;

async function startServer() {

    const socketService = new SocketService();

    const server =  http.createServer();

    socketService.io.attach(server);

    server.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
    socketService.initListeners();
}

startServer();