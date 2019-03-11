package com.jman.model;

import javax.websocket.EncodeException;
import javax.websocket.Encoder;
import javax.websocket.EndpointConfig;

import com.google.gson.Gson;

public class EstadoPartidaEncoder implements Encoder.Text<EstadoPartida>{
	private static Gson gson = new Gson();

    @Override
    public String encode(EstadoPartida e) throws EncodeException {
        String json = gson.toJson(e);
        return json;
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
