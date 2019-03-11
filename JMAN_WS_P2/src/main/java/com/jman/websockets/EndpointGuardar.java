package com.jman.websockets;

import java.io.IOException;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.websocket.EncodeException;
import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;
import javax.websocket.server.PathParam;

import com.jman.io.GuardarArchivo;

@ServerEndpoint(value = "/guardar/{estadoGuardado}")
public class EndpointGuardar {

	// private Session session;

	@OnOpen
	public void onOpen(Session session, @PathParam("estadoGuardado") String estadoGuardado)
			throws IOException, EncodeException {
		// this.session = session;

		Logger.getLogger(GuardarArchivo.class.getName()).log(Level.INFO, "estado guardado: " + estadoGuardado);
		
		try {
			GuardarArchivo obj = new GuardarArchivo();
			obj.guardar(estadoGuardado);

			session.getBasicRemote().sendText("OK");
		} catch (Exception e) {
			session.getBasicRemote().sendText("ERROR");
		}
	}

	@OnMessage
	public void onMessage(Session session, String mensaje) throws IOException, EncodeException {
		// Nothing
	}

	@OnClose
	public void onClose(Session session) throws IOException, EncodeException {
		// Nothing
	}

	@OnError
	public void onError(Session session, Throwable throwable) {
		// Do error handling here
	}
}
