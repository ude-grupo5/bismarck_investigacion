
function mostrarAlerta(){
    let alerta = document.getElementById("nuevaPartidaAlerta");  
    alerta.style.display = "initial";
}

function nuevaPartida() {     
    let nombre = document.getElementById("inputNombreNuevaPartida");
    let b = document.getElementById("selectBarco");
    var barco = b.options[b.selectedIndex].value;
    if (nombre == null || nombre.value == '') {
       alert("Identifiquese por favor");
    } else if (barco == '') {
        alert("Seleccione un barco");
    } else {
        window.location.href = 'juego.html?barco=' + barco + "&usuario=" + nombre.value;
    }
}

