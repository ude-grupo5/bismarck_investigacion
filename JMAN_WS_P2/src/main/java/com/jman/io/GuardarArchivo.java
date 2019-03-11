package com.jman.io;

import java.io.FileOutputStream;
import java.io.IOException;
import java.io.ObjectOutputStream;
import java.util.logging.Level;
import java.util.logging.Logger;

import com.jman.model.EstadoPartida;

public class GuardarArchivo {

	public void guardar(EstadoPartida estadoPartida) {
		FileOutputStream fout = null;
		ObjectOutputStream oos = null;
		
		try {
			fout = new FileOutputStream("c:\\temp\\ultima_partida.ser");
			oos = new ObjectOutputStream(fout);
			oos.writeObject(estadoPartida);			

			Logger.getLogger(GuardarArchivo.class.getName()).log(Level.INFO, "Archivo guardado");
		} catch (Exception ex) {
			Logger.getLogger(GuardarArchivo.class.getName()).log(Level.SEVERE, ex.getMessage());
		} finally {
			if (fout != null) {
				try {
					fout.close();
				} catch (IOException e) {
					Logger.getLogger(GuardarArchivo.class.getName()).log(Level.SEVERE, e.getMessage());
				}
			}

			if (oos != null) {
				try {
					oos.close();
				} catch (IOException e) {
					Logger.getLogger(GuardarArchivo.class.getName()).log(Level.SEVERE, e.getMessage());
				}
			}
		}
	}

}
