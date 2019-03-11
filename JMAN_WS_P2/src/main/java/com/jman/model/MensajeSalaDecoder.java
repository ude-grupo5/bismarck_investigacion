package com.jman.model;

import javax.websocket.DecodeException;
import javax.websocket.Decoder;
import javax.websocket.EndpointConfig;

import com.google.gson.Gson;

public class MensajeSalaDecoder implements Decoder.Text<MensajeSala> {

    private static Gson gson = new Gson();

    @Override
    public MensajeSala decode(String s) throws DecodeException {
        MensajeSala message = gson.fromJson(s, MensajeSala.class);
        return message;
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