import Canion from './Canion.js';

export default class Barco {

    static get BABOR () { return -1; }
    static get ESTRIBOR () { return 1; }

    constructor(nombre, sprite, vida, velocidadMaxima, explosion) {
        this.nombre = nombre;
        this.sprite = sprite;
        this.sprite.barco = this;
        this.vida = vida;
        this.velocidadMaxima = velocidadMaxima;
        this.explosion = explosion;

        this.velocidadActual = 0;
        this.impactado = false;
        this.hundido = false;

        this.sprite.nombre = this.nombre;
    }

    // ########################################################################
    //      SETTERS
    // ########################################################################

    set canionProa (canion) {  this._canionProa = canion; }

    set impactado (impactado) { this._impactado = impactado; }

    set grupoColision (grupoColision) {
        this.sprite.body.setCollisionGroup(grupoColision);
        this._grupoColision = grupoColision;
    }

    // ########################################################################
    //      GETTERS
    // ########################################################################

    get angulo () { return this.sprite.angle; }

    get canionProa () { return this._canionProa; }

    get impactado () { return this._impactado; }

    get grupoColision () { return this._grupoColision; }

    get posicion () { return this.sprite.position; }

    get rotacion () { return this.sprite.rotation; }

    get velocidadAbsoluta () { return Math.abs(this.velocidadActual); }

    get velocidadCuerpo () { return this.sprite.body.velocity; }

    get velocidadX () { return this.sprite.body.velocity.x; }

    get velocidadY () { return this.sprite.body.velocity.y; }

    get oculto () { return !this.sprite.visible; }

    get x () { return this.sprite.body.x; }

    get y () { return this.sprite.body.y; }

    // ########################################################################
    //      METODOS PUBLICOS
    // ########################################################################

    acelerarHaciaAdelante() {
        let nuevaVelocidad = this.velocidadActual + 1;
        this.velocidadActual = Math.min(nuevaVelocidad, this.velocidadMaxima);
    }

    acelerarHaciaAtras() {
        let nuevaVelocidad = this.velocidadActual - 1;
        let velocidadMaximaReveresa = (this.velocidadMaxima * -1);
        this.velocidadActual = Math.max(nuevaVelocidad, velocidadMaximaReveresa);
    }
    
    actualizarVida() {
        if (this.impactado) {
            this.vida -= 25;
            this.impactado = false;
        }
        if (this.vida <= 0 && !this.hundido) {
            this._explotar();
            this._hundir();
        }
    }

    aplicarEstadoPartida(estadoPartida) {
        this.sprite.body.x = estadoPartida.x;
        this.sprite.body.y = estadoPartida.y;
        this.sprite.body.angle = estadoPartida.angulo;
        this.sprite.body.velocity.x = estadoPartida.velocidadX;
        this.sprite.body.velocity.y = estadoPartida.velocidadY;
        if (estadoPartida.fuegoProa) {
            this.canionProa.disparar();
        }
    }

    setearColision(grupoColision) {
        this.sprite.body.collides(grupoColision);
    }

    disminuirVelocidad() {
        if (this.velocidadActual > 0) {
            this.velocidadActual -= 0.5;
        } else if (this.velocidadActual < 0) {
            this.velocidadActual += 0.5;
        }
    }

    mostrar() {
        this.sprite.visible = true;
    }

    mover() {
        this.sprite.body.moveForward(this.velocidadActual);
    }

    ocultar() {
        this.sprite.visible = false;
    }

    virarABabor() {
        this._virar(Barco.BABOR);
    }

    virarAEstribor() {
        this._virar(Barco.ESTRIBOR);
    }

    // ########################################################################
    //      METODOS PRIVADOS
    // ########################################################################

    _explotar() {
        let explosion = this.explosion.getFirstExists(false);
        explosion.reset(this.sprite.x, this.sprite.y);
        explosion.play(this.explosion.nombre, 30, false, true);
    }

    _hundir() {
        this.sprite.kill();
        this.hundido = true;
    }

    /**
     * Vira el barco en la direccion indicada en relacion a la velocidad
     * @param {number} direccion Barco.ESTRIBOR o Barco.BABOR
     */
    _virar(direccion) {
        let grados = (this.velocidadAbsoluta / 200) * direccion;
        this._rotarCuerpo(grados);
    }

    _rotarCuerpo(grados) {
        this.sprite.body.angle += grados;
    }
    
}