package com.jman.service;

import java.util.Optional;

import com.jman.io.LeerArchivo;
import com.jman.model.EstadoPartida;

public class SalaService {
	public Optional<EstadoPartida> getPartida() {
		LeerArchivo obj = new LeerArchivo();

		EstadoPartida estadoPartida = obj.deserealizar("c:\\temp\\ultima_partida.ser");
		
		if (estadoPartida != null) {
			System.out.println("acrhivo encontrado");
			return Optional.of(estadoPartida);
		} else {
			System.out.println("archivo vacío");
			return Optional.empty();
		}
	}
}
