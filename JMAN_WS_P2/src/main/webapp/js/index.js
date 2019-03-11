var websocket;
var TIEMPO_MAX_BUSQUEDA_PARTIDA = 30000; // miliseguntos
var estadoPartidaParaEnviar;
var timeOutDesconectar;

function mostrarError(mensaje) {
	$("#error").html(mensaje);
	$('#modalError').modal('show');
}

function mostrarBuscandoPartida() {
	$('#modalBuscando').modal('show');
}

function getJSONObj() {
	let estadoPartida;
	let myJSONtext = document.getElementById("jsonEstadoPartidaStr").innerHTML;
	estadoPartida = eval('(' + myJSONtext + ')');
	return estadoPartida;
}

$('#buttonNuevaPartida').click(function () {
	let nombre = document.getElementById("inputNombreNuevo").value;
	let b = document.getElementById("selectBarcoNuevo");
	let barco = b.options[b.selectedIndex].value;

	if (isEmpty(barco)) {
		mostrarError("Debe seleccionar un barco Capit&aacute;n");
	} else if (isEmpty(nombre)) {
		mostrarError("Debe ingresar su nombre Capit&aacute;n");
	} else {
		estadoPartidaParaEnviar = new Object();

		estadoPartidaParaEnviar.barcoLocal = barco;
		estadoPartidaParaEnviar.tipoPartida = "NUEVA";
		estadoPartidaParaEnviar.nombreLocal = nombre;

		sessionStorage.estadoPartida = JSON.stringify(estadoPartidaParaEnviar);

		buscarPartida();
	}
});

$('#buttonContinuar').click(function () {
	let b = document.getElementById("selectBarcoContinuar");
	let barco = b.options[b.selectedIndex].value;
	let nombre = b.options[b.selectedIndex].text;

	if (isEmpty(barco)) {
		mostrarError("Identif&iacute;quese Capit&aacute;n");
	} else {
		estadoPartidaParaEnviar = getJSONObj();

		estadoPartidaParaEnviar.barcoLocal = barco;
		estadoPartidaParaEnviar.tipoPartida = "GUARDADA";
		estadoPartidaParaEnviar.nombreLocal = nombre;

		sessionStorage.estadoPartida = JSON.stringify(estadoPartidaParaEnviar);

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

	websocket = new WebSocket("ws://" + host + pathname + "sala/" +
		estadoPartidaParaEnviar.barcoLocal);

	websocket.onmessage = function (event) {

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
	timeOutDesconectar = window.setTimeout(desconectar, TIEMPO_MAX_BUSQUEDA_PARTIDA);

	let jsonMensajeSala = JSON.stringify({
		"tipoPartida": estadoPartidaParaEnviar.tipoPartida,
		"nombreJugador": estadoPartidaParaEnviar.nombreLocal,
		"barco": estadoPartidaParaEnviar.barcoLocal
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

$('#buttonCancelarBuscar').click(function () {
	clearTimeout(timeOutDesconectar);
	desconectar();
});

function cambiarBarco(){
	let b = document.getElementById("selectBarcoContinuar");
	document.getElementById('inputNombreContinuar').value = b.options[b.selectedIndex].value;
}

function isEmpty(str) {
	return (!str || 0 === str.length);
}

function isEqual(str1, str2) {
	return str1.toUpperCase() === str2.toUpperCase();
}