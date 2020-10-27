import WebSocket from "ws";
import {websocketWelcome} from "./services/event-types";

export default app => {
    const wss = new WebSocket.Server({noServer: true});

    wss.on("connection", (ws, request, client) => {
        console.info("Total connected clients:", wss.clients.size);

        ws.send(websocketWelcome());
    });

    app.context.ws = {
        server: wss,
        broadcast: data => wss.clients.size && wss.clients.forEach(wsc => wsc.send(data))
    }

    return wss;
}