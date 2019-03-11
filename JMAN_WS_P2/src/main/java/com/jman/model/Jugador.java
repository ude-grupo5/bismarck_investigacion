package com.jman.model;

public class Jugador {
	String barco;
	String nombre;
	String tipoPartida;
	
	public String getTipoPartida() {
		return tipoPartida;
	}

	public void setTipoPartida(String tipoPartida) {
		this.tipoPartida = tipoPartida;
	}

	public Jugador() {

	}
	
	public Jugador(String barco) {
		super();
		this.barco = barco;
	}

	public Jugador(String barco, String nombre) {
		super();
		this.barco = barco;
		this.nombre = nombre;
	}

	@Override
	public String toString() {
		return super.toString();
	}

	public String getBarco() {
		return barco;
	}

	public void setBarco(String barco) {
		this.barco = barco;
	}

	public String getNombre() {
		return nombre;
	}

	public void setNombre(String nombre) {
		this.nombre = nombre;
	}
}
