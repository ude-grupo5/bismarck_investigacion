export default class EstadoGuardado {

    constructor(bismarck, hood) {
        this.estadoBismarck = this._estadoBarco(bismarck);
        this.estadoHood = this._estadoBarco(hood);
    }

    _estadoBarco(barco) {
        let estadoBarco = {
            angulo: barco.angulo,
            vida: barco.vida,
            x: barco.x,
            y: barco.y
        };

        return estadoBarco;
    }
}