import Config from './config/Config.js';

export default class MenuFinPartida {

    // resultado
    static get DERROTA () { return 0; }
    static get VICTORIA () { return 1; }

    // motivo
    static get HOOD_HUNDIDO () { return 0; }
    static get BISMARCK_HUNDIDO () { return 1; }
    static get BISMARCK_ESCAPADO () { return 2; }

    constructor() {
        this._divFin = document.getElementById('fondo_fin_partida');
        this._imgResultado = document.getElementById('fin_partida_resultado');
        this._imgMotivo = document.getElementById('fin_partida_motivo');

        this._agregarAccionSalir();
    }

    // ########################################################################
    // METODOS PUBLICOS
    // ########################################################################

    /**
     * Comunica el fin de la partida
     * @param {number} resultado MenuFinPartida.VICTORIA o MenuFinPartida.DERROTA
     * @param {number} motivo MenuFinPartida.HOOD_HUNDIDO,
     * MenuFinPartida.BISMARCK_HUNDIDO o MenuFinPartida.BISMARCK_ESCAPADO
     */
    comunicarFin(resultado, motivo) {
        this._actualizarResultado(resultado);
        this._actualizarMotivo(motivo);
        this._mostrar();
    }

    // ########################################################################
    // METODOS PRIVADOS
    // ########################################################################

    _actualizarResultado(resultado) {
        let src = '';
        if (resultado == MenuFinPartida.VICTORIA) {
            src = 'sprites/fin_partida/hasGanado.png';
        } else if (resultado == MenuFinPartida.DERROTA) {
            src = 'sprites/fin_partida/hasPerdido.png';
        }

        this._imgResultado.src = src;
    }

    _actualizarMotivo(motivo) {
        let src = '';
        if (motivo == MenuFinPartida.BISMARCK_ESCAPADO) {
            src = 'sprites/fin_partida/bismarckEscapo.png';
        } else if (motivo == MenuFinPartida.BISMARCK_HUNDIDO) {
            src = 'sprites/fin_partida/bismarckHundido.png';
        } else if (motivo == MenuFinPartida.HOOD_HUNDIDO) {
            src = 'sprites/fin_partida/hoodHundido.png';
        }

        this._imgMotivo.src = src;
    }

    _mostrar() {
        this._divFin.style.display = 'block';
    }

    _agregarAccionSalir() {
        let botonSalir = document.getElementById('boton_salir_fin');

        botonSalir.addEventListener('click', () => {
            this._accionClickSalir();
        });
    }

    _accionClickSalir() {
        window.location.replace('http://' + Config.URL_BASE);
    }

}