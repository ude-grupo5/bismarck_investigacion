import Canion from './Canion.js';

export default class Barco {

    static get BABOR () { return -1; }
    static get ESTRIBOR () { return 1; }

    constructor(nombre, sprite, vida, velocidadMaxima, spriteExplosion, sonidoExplosion) {
        this.nombre = nombre;
        this.sprite = sprite;
        this.sprite.barco = this;
        this.vida = vida;
        this.velocidadMaxima = velocidadMaxima;
        this._spriteExplosion = spriteExplosion;
        this._sonidoExplosion = sonidoExplosion;

        this.velocidadActual = 0;
        this._impactado = false;
        this.hundido = false;

        this.sprite.nombre = this.nombre;
    }

    // ########################################################################
    //      SETTERS
    // ########################################################################

    set canionPopa (canion) {  this._canionPopa = canion; }

    set canionProa (canion) {  this._canionProa = canion; }

    set grupoColision (grupoColision) {
        this.sprite.body.setCollisionGroup(grupoColision);
        this._grupoColision = grupoColision;
    }

    // ########################################################################
    //      GETTERS
    // ########################################################################

    get angulo () {
        let angulo = this.sprite.angle;
        if (angulo < 0) {
            angulo = 360 + angulo;
        }
        return angulo;
    }

    get canionPopa () { return this._canionPopa; }

    get canionProa () { return this._canionProa; }

    get danioImpacto () { return this._danioImpacto; }

    get impactado () { return this._impactado; }

    get grupoColision () { return this._grupoColision; }

    get oculto () { return !this.sprite.visible; }

    get posicion () { return this.sprite.position; }

    get rotacion () { return this.sprite.rotation; }

    get velocidadAbsoluta () { return Math.abs(this.velocidadActual); }

    get velocidadCuerpo () { return this.sprite.body.velocity; }

    get velocidadX () { return this.sprite.body.velocity.x; }

    get velocidadY () { return this.sprite.body.velocity.y; }

    get visible () { return this.sprite.visible; }

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
        if (this._impactado) {
            this.vida -= Math.min(this._danioImpacto, this.vida);
            this._impactado = false;
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
        if (estadoPartida.fuegoPopa) {
            this.canionPopa.disparar();
        }
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

    registrarImpacto(danio) {
        this._impactado = true;
        this._danioImpacto = danio;
    }

    setearColision(grupoColision) {
        this.sprite.body.collides(grupoColision);
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
        this._spriteExplosion.reset(this.x, this.y);
        this._spriteExplosion.play('explosionFinal', 30, false, true);
        this._sonidoExplosion.play();
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