export default class Bala {

    constructor(sprite, spriteImpactoAgua, sonidoImpactoAgua,
            spriteImpactoBarco, sonidoImpactoBarco) {
        this._sprite = sprite;
        this._sprite.bala = this;
        this._sprite.preUpdate = this._preUpdate;

        this._spriteImpactoAgua = spriteImpactoAgua;
        this._spriteImpactoBarco = spriteImpactoBarco

        this._sonidoImpactoAgua = sonidoImpactoAgua;
        this._sonidoImpactoBarco = sonidoImpactoBarco;

        this._viva = false;
    }

    // ########################################################################
    //      SETTERS
    // ########################################################################

    set alcance (alcance) { this._alcance = alcance; }

    set danioMaximo (danioMaximo) { this._danioMaximo = danioMaximo; }

    set direccion (direccion) { this._sprite.body.angle = direccion; }

    set grupoColision (grupoColision) {
        this._sprite.body.setCollisionGroup(grupoColision);
        this._grupoColision = grupoColision;
    }

    set posicionInicial (posicionInicial) {
        this._posicionInicial = posicionInicial;
        this._sprite.body.x = posicionInicial.x;
        this._sprite.body.y = posicionInicial.y;
    }

    set velocidad (velocidad) { this._velocidad = velocidad; }

    // ########################################################################
    //      GETTERS
    // ########################################################################

    get grupoColision () { return this._grupoColision; }

    get x () { return this._sprite.body.x; }

    get y () { return this._sprite.body.y; }
    
    // ########################################################################
    //      METODOS PUBLICOS
    // ########################################################################

    danio() {
        let danio = this._danioMaximo;
        if (this._distanciaRecorrida() > this._alcance / 2) {
            danio = this._danioMaximo / 2;
        }
        return danio;
    }

    desaparecer() {
        this._matar();
    }

    explotar() {
        this._matar();

        this._spriteImpactoBarco.reset(this.x, this.y);
        this._spriteImpactoBarco.play('explosionImpacto', 30, false, true);
        this._sonidoImpactoBarco.play();
    }

    revivir() {
        this._sprite.revive();
        this._sprite.body.setZeroRotation();
        this._viva = true;
    }

    setearColision(grupoColision, callback, contexto) {
        this._sprite.body.collides(grupoColision, callback, contexto);
    }

    // ########################################################################
    //      METODOS PRIVADOS
    // ########################################################################

    _preUpdate() {
        let bala = this.bala;
        if (bala._viva) {
            if (bala._sobrepasaAlcance()) {
                bala._matar();
                bala._hundir();
            } else {
                bala._mover();
            }
        }
    }

    _sobrepasaAlcance() {
        return this._distanciaRecorrida() > this._alcance;
    }

    _distanciaRecorrida() {
        return Phaser.Math.distance(
            this._posicionInicial.x,
            this._posicionInicial.y,
            this._sprite.body.x,
            this._sprite.body.y
        );
    }

    _matar() {
        this._sprite.kill();
        this._viva = false;
    }

    _hundir() {
        this._spriteImpactoAgua.reset(this.x, this.y);
        this._sonidoImpactoAgua.play();
        this._spriteImpactoAgua.play('impactoAgua', 30, false, true);
    }

    _mover() {
        this._sprite.body.moveForward(this._velocidad);
    }

}