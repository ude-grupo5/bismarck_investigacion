package com.jman.model;

import java.io.Serializable;

public class EstadoPartida implements Serializable {
	private static final long serialVersionUID = 1L;
	
	String bizmarckNombreJugador;
	Integer bizmarckX;
	Integer bizmarckY;
	Integer bizmarckAngulo;
	Integer bizmarckVelocidadX;
	Integer bizmarckVelocidadY;
	Integer bizmarckVida;
	
	String hookNombreJugador;
	Integer hookX;
	Integer hookY;
	Integer hookAngulo;
	Integer hookVelocidadX;
	Integer hookVelocidadY;
	Integer hookVida;
	
	@Override
    public String toString() {
        return super.toString();
    }
	
	public String getBizmarckNombreJugador() {
		return bizmarckNombreJugador;
	}
	public void setBizmarckNombreJugador(String bizmarckNombreJugador) {
		this.bizmarckNombreJugador = bizmarckNombreJugador;
	}
	public Integer getBizmarckX() {
		return bizmarckX;
	}
	public void setBizmarckX(Integer bizmarckX) {
		this.bizmarckX = bizmarckX;
	}
	public Integer getBizmarckY() {
		return bizmarckY;
	}
	public void setBizmarckY(Integer bizmarckY) {
		this.bizmarckY = bizmarckY;
	}
	public Integer getBizmarckAngulo() {
		return bizmarckAngulo;
	}
	public void setBizmarckAngulo(Integer bizmarckAngulo) {
		this.bizmarckAngulo = bizmarckAngulo;
	}
	public Integer getBizmarckVelocidadX() {
		return bizmarckVelocidadX;
	}
	public void setBizmarckVelocidadX(Integer bizmarckVelocidadX) {
		this.bizmarckVelocidadX = bizmarckVelocidadX;
	}
	public Integer getBizmarckVelocidadY() {
		return bizmarckVelocidadY;
	}
	public void setBizmarckVelocidadY(Integer bizmarckVelocidadY) {
		this.bizmarckVelocidadY = bizmarckVelocidadY;
	}
	public Integer getBizmarckVida() {
		return bizmarckVida;
	}
	public void setBizmarckVida(Integer bizmarckVida) {
		this.bizmarckVida = bizmarckVida;
	}
	public String getHookNombreJugador() {
		return hookNombreJugador;
	}
	public void setHookNombreJugador(String hookNombreJugador) {
		this.hookNombreJugador = hookNombreJugador;
	}
	public Integer getHookX() {
		return hookX;
	}
	public void setHookX(Integer hookX) {
		this.hookX = hookX;
	}
	public Integer getHookY() {
		return hookY;
	}
	public void setHookY(Integer hookY) {
		this.hookY = hookY;
	}
	public Integer getHookAngulo() {
		return hookAngulo;
	}
	public void setHookAngulo(Integer hookAngulo) {
		this.hookAngulo = hookAngulo;
	}
	public Integer getHookVelocidadX() {
		return hookVelocidadX;
	}
	public void setHookVelocidadX(Integer hookVelocidadX) {
		this.hookVelocidadX = hookVelocidadX;
	}
	public Integer getHookVelocidadY() {
		return hookVelocidadY;
	}
	public void setHookVelocidadY(Integer hookVelocidadY) {
		this.hookVelocidadY = hookVelocidadY;
	}
	public Integer getHookVida() {
		return hookVida;
	}
	public void setHookVida(Integer hookVida) {
		this.hookVida = hookVida;
	}
}
