package com.jman.controller;

import java.io.IOException;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.jman.service.SalaService;

//, urlPatterns = "/index.jsp"

@WebServlet(name = "SalaServlet", urlPatterns = "")
public class SalaServlet extends HttpServlet {

	private static final long serialVersionUID = 1L;
	private final SalaService salaService = new SalaService();

	private void processRequest(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		//Logger.getLogger(EndpointSala.class.getName()).log(Level.INFO, "estoy en el servlet");

		salaService.getPartida().ifPresent(s -> request.setAttribute("estadoPartida", s));

		/*
		EstadoPartida s = new EstadoPartida();
		s.setBizmarckNombreJugador("peteco");
		request.setAttribute("estadoPartida", s);
		*/
		RequestDispatcher dispatcher = request.getRequestDispatcher("/index.jsp");
		dispatcher.forward(request, response);
	}

	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		processRequest(request, response);
	}

	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		processRequest(request, response);
	}
}
