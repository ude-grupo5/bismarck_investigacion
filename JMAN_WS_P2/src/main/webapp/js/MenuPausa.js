import Config from './config/Config.js';

export default class MenuPausa {

    constructor(partida) {
        this._partida = partida;
        this._divMenu = document.getElementById('fondo_menu_pausa');
    
        this._websocket = new WebSocket("ws://" + Config.URL_BASE + 'guardar/');
        this._websocket.onmessage = function(event) {
            let resultado = event.data;

            alert('Resultado Guardar: ' + resultado);
            // TODO: comunicar resultado apropiadamente
            console.log('TODO: comunicar resultado apropiadamente');
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
        this._partida.reanudar(true);
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