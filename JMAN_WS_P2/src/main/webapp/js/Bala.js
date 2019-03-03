export default class Bala {

    constructor(sprite) {
        this._sprite = sprite;
        this._sprite.bala = this;
        this._sprite.preUpdate = this._preUpdate;

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
    
    // ########################################################################
    //      METODOS PUBLICOS
    // ########################################################################

    danio() {
        let danio = this._danioMaximo;
        if (this._distanciaRecorrida > this._alcance / 2) {
            danio = this._danioMaximo / 2;
        }

        return danio;
    }

    revivir() {
        this._sprite.revive();
        this._viva = true;
    }

    setearColision(barco) {
        this._sprite.body.collides(barco.grupoColision, function(){console.log('colisiona ' + this.nombre);}, this);
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
        // TODO: Animar hundimiento
    }

    _mover() {
        this._sprite.body.moveForward(this._velocidad);
    }

}