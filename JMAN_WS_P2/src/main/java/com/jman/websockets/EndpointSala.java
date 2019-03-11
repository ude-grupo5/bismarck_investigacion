package com.jman.websockets;

import java.io.IOException;
import java.util.HashMap;
import java.util.Set;
import java.util.concurrent.CopyOnWriteArraySet;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.websocket.EncodeException;
import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.PathParam;
import javax.websocket.server.ServerEndpoint;

import com.jman.model.Jugador;
import com.jman.model.MensajeSala;
import com.jman.model.MensajeSalaDecoder;
import com.jman.model.MensajeSalaEncoder;

@ServerEndpoint(value = "/sala/{barco}", decoders = MensajeSalaDecoder.class, encoders = MensajeSalaEncoder.class)
public class EndpointSala {

	private Session session;
	private static final Set<EndpointSala> endpointsSala = new CopyOnWriteArraySet<>();
	private static HashMap<String, Jugador> peticiones = new HashMap<>();

	@OnOpen
	public void onOpen(Session session, @PathParam("barco") String barco) throws IOException, EncodeException {

		// System.out.println("App Deployed Directory path: " +
		// this.getServletContext().getRealPath(File.separator));

		// Logger.getLogger(EndpointSala.class.getName()).log(Level.INFO, "catalina.home
		// " + System.getProperty("catalina.home"));
		/*
		 * EstadoPartida estado = new EstadoPartida();
		 * estado.setBizmarckNombreJugador(barco);
		 * 
		 * GuardarArchivo obj = new GuardarArchivo();
		 * 
		 * // Address address = new Address(); // address.setStreet("wall street"); //
		 * address.setCountry("united state");
		 * 
		 * obj.guardar(estado);
		 */

		this.session = session;
		endpointsSala.add(this);
		peticiones.put(session.getId(), new Jugador(barco));
		
		Logger.getLogger(EndpointSala.class.getName()).log(Level.INFO, "websocket abierto");
		
		session.getBasicRemote().sendText("CONECTADO");
	}

	@OnMessage
	public void onMessage(Session session, MensajeSala message) throws IOException, EncodeException {
		// guardo datos del origen para la busqueda de otros
		peticiones.get(session.getId()).setNombre(message.getNombreJugador());
		peticiones.get(session.getId()).setTipoPartida(message.getTipoPartida());
		
		buscarPartida(session, message.getBarco(), message.getTipoPartida());
	}
	
	

	private void buscarPartida(Session session, String sessionBarco, String sessionTipoPartida) {
		Logger.getLogger(EndpointSala.class.getName()).log(Level.INFO, "barco " + sessionBarco);
		Logger.getLogger(EndpointSala.class.getName()).log(Level.INFO, "tipo "  + sessionTipoPartida);
		Logger.getLogger(EndpointSala.class.getName()).log(Level.INFO, "websocket abierto");
		
		for (EndpointSala endpoint : endpointsSala) {
			synchronized (endpoint) {
				try {
					String barcoEnemigo = peticiones.get(endpoint.session.getId()).getBarco();
					String tipoPartidaEnemigo = peticiones.get(endpoint.session.getId()).getTipoPartida();

					if (!sessionBarco.contentEquals(barcoEnemigo)
							&& sessionTipoPartida.contentEquals(tipoPartidaEnemigo)) {

						endpoint.session.getBasicRemote().sendText(sessionTipoPartida);
						session.getBasicRemote().sendText(sessionTipoPartida);

						eliminarJugador(endpoint.session.getId(), endpoint);
						eliminarJugador(session.getId(), this);

						break;
					}
				} catch (IOException e) {
					e.printStackTrace();
					Logger.getLogger(EndpointSala.class.getName()).log(Level.SEVERE,
							"Error buscando partidas: " + e.getMessage());
				}
			}
		}
	}

	@OnClose
	public void onClose(Session session) throws IOException, EncodeException {
		try {
			eliminarJugador(session.getId(), this);
		} catch (Exception e) {
			Logger.getLogger(EndpointSala.class.getName()).log(Level.SEVERE, "Error al cerrar la coneccion");
		}
	}

	private void eliminarJugador(String sessionId, EndpointSala endpoint) {
		try {
			if (endpointsSala.contains(endpoint)) {
				endpointsSala.remove(endpoint);
			}
			if (peticiones.containsKey(sessionId)) {
				peticiones.remove(sessionId);
			}
		} catch (Exception e) {
			Logger.getLogger(EndpointSala.class.getName()).log(Level.SEVERE,
					"Error al eliminar el jugador de las colecciones");
		}
	}

	@OnError
	public void onError(Session session, Throwable throwable) {
		Logger.getLogger(EndpointSala.class.getName()).log(Level.SEVERE,
				"Error en socket " + peticiones.get(session.getId()).getBarco() + " error: " + throwable.getMessage());
	}
}
