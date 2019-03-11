package com.jman.io;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.util.logging.Level;
import java.util.logging.Logger;

import com.jman.model.EstadoPartida;

public class LeerArchivo {
	public EstadoPartida deserealizar(String fileName) {
		EstadoPartida estadoPartida = null;
		
		FileInputStream fin = null;
		ObjectInputStream ois = null;

		try {
			fin = new FileInputStream(fileName);
			ois = new ObjectInputStream(fin);
			estadoPartida = (EstadoPartida) ois.readObject();
		} catch (Exception ex) {
			Logger.getLogger(LeerArchivo.class.getName()).log(Level.SEVERE, ex.getMessage());
		} finally {
			if (fin != null) {
				try {
					fin.close();
				} catch (IOException e) {
					Logger.getLogger(LeerArchivo.class.getName()).log(Level.SEVERE, e.getMessage());
				}
			}

			if (ois != null) {
				try {
					ois.close();
				} catch (IOException e) {
					Logger.getLogger(LeerArchivo.class.getName()).log(Level.SEVERE, e.getMessage());
				}
			}
		}
		return estadoPartida;
	}

}
