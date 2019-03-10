export default class Canion {

    static get ENFRIAMIENTO_MILISEGUNDOS () { return 3000; }
    static get ALCANCE () { return 380; }
    static get VELOCIDAD_BALA () { return 500; }
    static get DANIO_MAXIMO_BALA () { return 50; }

    constructor(barco, compensacionAngulo, bala, sonidoDisparo) {
        this._barco = barco;
        this._compensacionAngulo = compensacionAngulo;

        this._bala = bala;
        this._bala.alcance = Canion.ALCANCE;
        this._bala.velocidad = Canion.VELOCIDAD_BALA
        this._bala.danioMaximo = Canion.DANIO_MAXIMO_BALA;
        
        this._sonidoDisparo = sonidoDisparo;

        this._tiempoUltimoDisparo = new Date(Date.now() - Canion.ENFRIAMIENTO_MILISEGUNDOS);
    }

    // ########################################################################
    //      METODOS PUBLICOS
    // ########################################################################

    disparar() {
        if (this._canionListo()) {
            this._sonidoDisparo.play();
            this._dispararBala();
            this._iniciarEnfriamiento();
        }
    }

    // ########################################################################
    //      METODOS PRIVADOS
    // ########################################################################

    _canionListo() {
        return this._milisegundosDesdeUltimoDisparo() >= Canion.ENFRIAMIENTO_MILISEGUNDOS;
    }

    _milisegundosDesdeUltimoDisparo() {
        let ahora = new Date();
        return ahora.getTime() - this._tiempoUltimoDisparo.getTime();
    }

    _dispararBala() {
        this._bala.posicionInicial = this._barco.posicion;
        this._bala.direccion = this._barco.angulo + this._compensacionAngulo;
        this._bala.revivir();
    }

    _iniciarEnfriamiento() {
        this._tiempoUltimoDisparo = new Date();
    }

}