package com.jman.websockets;

import java.io.IOException;
import java.util.Set;
import java.util.concurrent.CopyOnWriteArraySet;


import javax.websocket.EncodeException;
import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.PathParam;
import javax.websocket.server.ServerEndpoint;

@ServerEndpoint(value = "/partida/")
public class EndpointPartida {

    private Session session;
    private static final Set<EndpointPartida> endpointsPartida = new CopyOnWriteArraySet<>();
    //private static HashMap<String, String> jugadores = new HashMap<>();

    @OnOpen
    public void onOpen(Session session, @PathParam("nombreJugador") String nombreJugador) throws IOException, EncodeException {

        this.session = session;
        endpointsPartida.add(this);
        //jugadores.put(session.getId(), nombreJugador);

        /*
        Message message = new Message();
        message.setFrom(nombreJugador);
        message.setContent("Connected!");
        broadcast(message);
        */
    }

    @OnMessage
    public void onMessage(Session session, String movimiento) throws IOException, EncodeException {
        broadcast(movimiento);

    }

    @OnClose
    public void onClose(Session session) throws IOException, EncodeException {

        endpointsPartida.remove(this);
    }

    @OnError
    public void onError(Session session, Throwable throwable) {
        // Do error handling here
    }

    private static void broadcast(String movimiento) throws IOException, EncodeException {
        endpointsPartida.forEach(endpoint -> {
            synchronized (endpoint) {
                try {
                    endpoint.session.getBasicRemote()
                            .sendText(movimiento);
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        });
    }

}
