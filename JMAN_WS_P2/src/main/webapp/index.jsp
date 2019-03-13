<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>

<%
	String jsonEstadoPartida = "";
	if (request.getAttribute("estadoPartida") != null) {

		jsonEstadoPartida = (String) request.getAttribute("estadoPartida");
	}
%>

<!DOCTYPE html>
<html lang="es">

<head>
	<meta charset="UTF-8">
	<link rel="stylesheet" type="text/css" href="css/bootstrap.min.css">
	<link rel="stylesheet" type="text/css" href="css/index.css">
</head>

<body>
	<span id="jsonEstadoPartidaStr" style="display: none;">
		<%=jsonEstadoPartida%></span>
	<div class="modal fade" id="modalError" role="dialog">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-body text-center">
					<p id="error"></p>
				</div>
			</div>
		</div>
	</div>

	<div class="modal fade" data-backdrop="static" data-keyboard="false" id="modalBuscando" role="dialog">
		<div class="modal-dialog text-center">
			<div class="modal-content">
				<div class="modal-body text-center">
					Estamos buscando a su oponente Capit&aacute;n <img src="media/tenor.gif" height="207" width="470">
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-outline-danger" id="buttonCancelarBuscar">Detener la B&uacute;squeda</button>
				</div>
			</div>
		</div>
	</div>



	<video poster="media/fondoIndex.jpg" playsinline autoplay muted loop>
		<source src="media/videoplayback.mp4" type="video/mp4">
	</video>
	<audio autoplay>
		<source src="media/09 Sons of War.mp3" type="audio/mpeg">
	</audio>
	<div class="container-fluid">
		<div class="row">
			<div class="col"></div>
			<div class="col">
				<ul class="nav justify-content-center">
					<li class="nav-item"><a class="nav-link active" onmouseenter="playAudio()" href="ayuda.html">Ayuda</a></li>
				</ul>
			</div>
			<div class="col"></div>
		</div>
		<div class="row">
			<div class="col">
				<br>
			</div>
		</div>
		<div class="row align-items-start">
			<div class="col">
				<img src="media/logo.png" height="250" width="350">
			</div>
			<div class="col">

				<div class="card text-center text-white bg-dark">

					<div class="card-header">Nueva Partida</div>
					<div class="card-body">
						<div class="form-group">
							<select class="form-control" id="selectBarcoNuevo">
								<option value="" selected="">Seleccione su barco
									Capit&aacute;n</option>
								<option value="Bismarck">Bismarck</option>
								<option value="Hood">Hood</option>
							</select>
						</div>
					</div>
					<div class="card-footer text-muted">
						<button type="button" class="btn btn-outline-light" id="buttonNuevaPartida">Buscar oponente</button>
					</div>
				</div>
			</div>
			<div class="col"></div>
		</div>
		<div class="row">
			<br>
		</div>

		<div class="row" id="filaContinuar">
			<div class="col"></div>
			<div class="col">
				<div class="card text-center text-white bg-dark">
					<div class="card-header">Continuar Partida Guardada</div>
					<div class="card-body">
						<form>
							<div class="form-group">
								<div class="form-group">
									<select class="custom-select" id="selectBarcoContinuar">
										<option value="" selected="">Indetif&iacute;quese
											Capit&aacute;n</option>
										<option value="Bizmarck">Bizmarck</option>
										<option value="Hood">Hood</option>
									</select>
								</div>
							</div>
						</form>
					</div>
					<div class="card-footer text-muted">
						<button type="button" class="btn btn-outline-light" id="buttonContinuar">Continuar</button>
					</div>
				</div>
			</div>
			<div class="col"></div>
		</div>

		<div class="row" id="filaContinuarError">
			<div class="col"></div>
			<div class="col">
				<div class="alert danger-warning alert-dismissible fade show" role="alert">
					<strong>Diablos!</strong> No pudimos cargar el archivo para
					continuar la partida.
					<button type="button" class="close" data-dismiss="alert" aria-label="Cerrar">
						<span aria-hidden="true">&times;</span>
					</button>
				</div>
			</div>
			<div class="col"></div>
		</div>

	</div>
	<audio id="audioID">
		<source src="media/callhelp.wav" type="audio/wav">
	</audio>
	<script type="text/javascript" src="js/lib/jquery-3.3.1.min.js"></script>
	<script type="text/javascript" src="js/lib/bootstrap.min.js"></script>
	<script type="text/javascript" src="js/index.js"></script>
</body>

</html>