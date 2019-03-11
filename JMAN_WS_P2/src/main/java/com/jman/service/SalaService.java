package com.jman.service;

import java.util.Optional;

import com.jman.io.LeerArchivo;

public class SalaService {
	public Optional<String> getPartida() {
		LeerArchivo obj = new LeerArchivo();

		String estadoGuardado = obj.leer("c:\\temp\\ultima_partida.ser");
		
		if (estadoGuardado != null) {
			System.out.println("acrhivo encontrado");
			return Optional.of(estadoGuardado);
		} else {
			System.out.println("archivo vacío");
			return Optional.empty();
		}
	}
}
