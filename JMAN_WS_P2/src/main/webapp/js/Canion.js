import Bala from './Bala.js';
import Barco from './Barco.js';

export default class Canion {

    static get ENFRIAMIENTO_SEGUNDOS () { return 2; }
    static get ALCANCE () { return 380; }
    static get VELOCIDAD_BALA () { return 400; };

    constructor(barco, bala) {
        this._barco = barco;
        this._bala = bala;
        this._tiempoUltimoDisparo = null;
    }

    // ########################################################################
    //      METODOS PUBLICOS
    // ########################################################################

    disparar() {
        if (this._canionListo()) {
            // TODO: Disparar bala e iniciar enfriamiento
            this._bala.posicionInicial = this._barco.posicion;
        }
    }

    // ########################################################################
    //      METODOS PRIVADOS
    // ########################################################################

    _canionListo() { 
        return Canion.ENFRIAMIENTO_SEGUNDOS >= this._segundosDesdeUltimoDisparo(); 
    }

    _segundosDesdeUltimoDisparo() {
        let ahora = new Date();
        return ( ahora.getTime() - this._tiempoUltimoDisparo.getTime() ) / 1000;
    }

}