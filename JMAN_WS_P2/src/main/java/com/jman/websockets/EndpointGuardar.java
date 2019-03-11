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
import javax.websocket.server.ServerEndpoint;

import com.jman.io.GuardarArchivo;
import com.jman.model.EstadoPartida;
import com.jman.model.EstadoPartidaDecoder;
import com.jman.model.EstadoPartidaEncoder;

@ServerEndpoint(value = "/guardar/", decoders = EstadoPartidaDecoder.class, encoders = EstadoPartidaEncoder.class)
public class EndpointGuardar {

	private Session session;
	private static final Set<EndpointGuardar> endpoints = new CopyOnWriteArraySet<>();

	@OnOpen
	public void onOpen(Session session) throws IOException, EncodeException {
		this.session = session;
		endpoints.add(this);
	}

	@OnMessage
	public void onMessage(Session session, EstadoPartida estadoPartida) throws IOException, EncodeException {
		try {
			GuardarArchivo obj = new GuardarArchivo();
			obj.guardar(estadoPartida);

			session.getBasicRemote().sendText("OK");
		} catch (Exception e) {
			session.getBasicRemote().sendText("ERROR");
		}
	}

	@OnClose
	public void onClose(Session session) throws IOException, EncodeException {
		endpoints.remove(this);
	}

	@OnError
	public void onError(Session session, Throwable throwable) {
		// Do error handling here
	}
}
