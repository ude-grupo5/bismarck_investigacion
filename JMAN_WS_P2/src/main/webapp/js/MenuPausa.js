export default class MenuPausa {

    constructor(partida) {
        this._partida = partida;
        this._divMenu = document.getElementById('fondo_menu_pausa');
    
        let host = document.location.host;
        this._websocket = new WebSocket("ws://" + host + '/websockets/guardar/');
        this._websocket.onmessage = function(event) {
            let resultado = event.data;

            console.log('resultado guardar: ' + resultado);
            // TODO: comunicar resultado
            console.log('TODO: comunicar resultado');
        };

        this._agregarAccionesBotones();
    }

    // ########################################################################
    // METODOS PUBLICOS
    // ########################################################################

    mostrar() {
        this._divMenu.style.display = 'block';
    }

    ocultar() {
        this._divMenu.style.display = 'none';
    }

    // ########################################################################
    // METODOS PRIVADOS
    // ########################################################################

    _agregarAccionesBotones() {
        let botonGuardar = document.getElementById('boton_guardar');
        let botonSeguir = document.getElementById('boton_seguir');
        let botonSalir = document.getElementById('boton_salir');

        botonGuardar.addEventListener('click', () => {
            this._accionClickGuardar();
        });
        botonSeguir.addEventListener('click', () => {
            this._accionClickSeguir();
        });
        botonSalir.addEventListener('click', () => {
            this._accionClickSalir();
        });
    }

    _accionClickGuardar() {
        this._guardar();
    }

    _accionClickSeguir() {
        this.ocultar();
        this._partida.reanudar();
    }

    _accionClickSalir() {
        // TODO: accionClickSalir
        console.log('TODO: accionClickSalir');
    }

    _guardar() {
        let estadoGuardadoStr =  JSON.stringify(this._partida.estadoGuardado);
        this._websocket.send(estadoGuardadoStr);
    }
}