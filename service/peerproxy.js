import { WebSocketServer } from 'ws';

export function setupPeerProxy(server) {
    const wss = new WebSocketServer({ server, path: '/ws' });
 
    const chatRooms = new Map(); // Map of chat room IDs to sets of connected clients

    wss.on('connection', (ws, req) => {
        // Parse chatId from query string, e.g. ws://host/ws?chatId=123
        const url = new URL(req.url, `http://${req.headers.host}`);
        const chatId = url.searchParams.get('chatId');
        if (!chatId) {
            ws.close();
            return;
        }

        if (!chatRooms.has(chatId)) chatRooms.set(chatId, []);
        chatRooms.get(chatId).push(ws);

        ws.on('message', (msg) => {
            // Broadcast message to all clients in the same chat room
            for (const client of chatRooms.get(chatId)) {
                if (client !== ws && client.readyState === ws.OPEN) {
                    client.send(msg);
                }
            }
        });

        ws.on('close', () => {
            const room = chatRooms.get(chatId);
            if (room) {
                chatRooms.set(chatId, room.filter(client => client !== ws));
                if (chatRooms.get(chatId).length === 0) chatRooms.delete(chatId);
            }
        });
    });
}
