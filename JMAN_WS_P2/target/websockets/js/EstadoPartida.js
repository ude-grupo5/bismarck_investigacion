export default class EstadoPartida {

    constructor(barcoJugador, barcoEnemigo) {
        this.jugador = barcoJugador.nombre;
        this.x = barcoJugador.body.x;
        this.y = barcoJugador.body.y;
        this.angulo = barcoJugador.angle;
        this.velocidadX = barcoJugador.body.velocity.x;
        this.velocidadY = barcoJugador.body.velocity.y;
        this.fuegoProa = barcoJugador.fuegoProa;
        this.enemigoImpactado = barcoEnemigo.impactado;
    }
}