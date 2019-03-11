export default class EstadoPartida {

    constructor(barcoJugador, barcoEnemigo) {
        this.jugador = barcoJugador.nombre;
        this.x = barcoJugador.x;
        this.y = barcoJugador.y;
        this.angulo = barcoJugador.angulo;
        this.velocidadX = barcoJugador.velocidadX;
        this.velocidadY = barcoJugador.velocidadY;
        this.fuegoProa = barcoJugador.fuegoProa;
        this.fuegoPopa = barcoJugador.fuegoPopa;
        this.enemigoImpactado = barcoEnemigo.impactado;
        this.danioImpacto = barcoEnemigo.danioImpacto;
    }
}