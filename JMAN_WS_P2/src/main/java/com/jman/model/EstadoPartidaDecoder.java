package com.jman.model;

import javax.websocket.DecodeException;
import javax.websocket.Decoder;
import javax.websocket.EndpointConfig;

import com.google.gson.Gson;

public class EstadoPartidaDecoder implements Decoder.Text<EstadoPartida> {

	private static Gson gson = new Gson();

	@Override
	public EstadoPartida decode(String s) throws DecodeException {
		EstadoPartida estadoPartida = gson.fromJson(s, EstadoPartida.class);
		return estadoPartida;
	}

	@Override
	public boolean willDecode(String s) {
		return (s != null);
	}

	@Override
	public void init(EndpointConfig endpointConfig) {
		// Custom initialization logic
	}

	@Override
	public void destroy() {
		// Close resources
	}
}
