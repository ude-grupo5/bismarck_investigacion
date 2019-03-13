var websocket;
var TIEMPO_MAX_BUSQUEDA_PARTIDA = 30000; // milisegundos
var parametrosSala;
var timeOutDesconectar;

window.onload = function() {
	$("#filaContinuarError").hide();
	try {
		let estadoGuardado = getEstadoGuardado();
		if (estadoGuardado == null) {
			$("#filaContinuar").hide();
		}
	} catch (error) {
		console.log(error);
		$("#filaContinuar").hide();
		$("#filaContinuarError").show();
	}
}

function mostrarError(mensaje) {
	$("#error").html(mensaje);
	$('#modalError').modal('show');
}

function mostrarBuscandoPartida() {
	$('#modalBuscando').modal('show');
}

function getEstadoGuardado() {
	let estadoGuardado = null;
	let estadoGuardadoStr = document.getElementById("jsonEstadoPartidaStr").innerHTML;
	
	console.log("estadoGuardadoStr: " + estadoGuardadoStr);
	
	if (estadoGuardadoStr != null) {
		estadoGuardado = JSON.parse(estadoGuardadoStr);
	}
	return estadoGuardado;
}

$('#buttonNuevaPartida').click(function() {
	let b = document.getElementById("selectBarcoNuevo");
	let barco = b.options[b.selectedIndex].value;

	if (isEmpty(barco)) {
		mostrarError("Debe seleccionar un barco Capit&aacute;n");
	} else {
		parametrosSala = new Object();

		parametrosSala.barcoLocal = barco;
		parametrosSala.tipoPartida = "NUEVA";

		sessionStorage.parametrosSala = JSON.stringify(parametrosSala);

		buscarPartida();
	}
});

$('#buttonContinuar').click(function() {
	let b = document.getElementById("selectBarcoContinuar");
	let barco = b.options[b.selectedIndex].value;

	if (isEmpty(barco)) {
		mostrarError("Identif&iacute;quese Capit&aacute;n");
	} else {
		parametrosSala.barcoLocal = barco;
		parametrosSala.tipoPartida = "GUARDADA";
		parametrosSala.estadoGuardado = getEstadoGuardado();

		sessionStorage.parametrosSala = JSON.stringify(parametrosSala);

		buscarPartida();
	}
});

function buscarPartida() {
	mostrarBuscandoPartida();

	try {
		websocket.close();
	} catch (error) {
		// do nothing
	}

	let host = document.location.host;
	let pathname = document.location.pathname;

	websocket = new WebSocket("ws://" + host + pathname + "sala/"
			+ parametrosSala.barcoLocal);

	websocket.onmessage = function(event) {

		let mensaje = event.data;

		if (isEqual(mensaje, "CONECTADO")) {
			enviarPeticionPartida();
		} else if (isEqual(mensaje, "NUEVA")) {
			window.location.href = 'juego.html';

		} else if (isEqual(mensaje, "GUARDADA")) {
			window.location.href = 'juego.html';
		}
	};
}

function enviarPeticionPartida() {
	timeOutDesconectar = window.setTimeout(desconectar,
			TIEMPO_MAX_BUSQUEDA_PARTIDA);

	let jsonMensajeSala = JSON.stringify({
		"tipoPartida" : parametrosSala.tipoPartida,
		"barco" : parametrosSala.barcoLocal
	});

	websocket.send(jsonMensajeSala);
}

function desconectar() {
	$('#modalBuscando').modal('hide');
	try {
		websocket.close();
	} catch (ex) {

	}
}

$('#buttonCancelarBuscar').click(function() {
	clearTimeout(timeOutDesconectar);
	desconectar();
});

function playAudio() {
	let ayuda = document.getElementById("audioID");
	ayuda.play();
}

function isEmpty(str) {
	return (!str || 0 === str.length);
}

function isEqual(str1, str2) {
	return str1.toUpperCase() === str2.toUpperCase();
}