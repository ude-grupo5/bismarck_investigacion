export default class Barco {

    constructor(nombre, sprite, vida, velocidadMaxima, explosion) {
        this.nombre = nombre;
        this.sprite = sprite;
        this.vida = vida;
        this.velocidadMaxima = velocidadMaxima;
        this.explosion = explosion;

        this.velocidadActual = 0;
        this.impactado = false;
        this.hundido = false;

        this.sprite.nombre = this.nombre;
    }

    set canionProa(canion) {
        this._canionProa = canion;
    }

    set impactado(impactado) {
        this._impactado = impactado;
    }

    get canionProa() {
        return this._canionProa;
    }

    get impactado() {
        return this._impactado;
    }

    get x() {
        return this.sprite.body.x;
    }

    get velocidadX() {
        return this.sprite.body.velocity.x;
    }

    get y() {
        return this.sprite.body.y;
    }

    get velocidadY() {
        return this.sprite.body.velocity.y;
    }

    get velocidadCuerpo() {
        return this.sprite.body.velocity;
    }

    get rotacion() {
        return this.sprite.rotation;
    }

    get angulo() {
        return this.sprite.angle;
    }

    actualizarVida() {
        if (this.impactado) {
            console.log('bajar vida');
            this.vida -= 25;
            this.impactado = false;
        }
        if (this.vida <= 0 && !this.hundido) {
            this.explotar();
            this.hundir();
        }
    }

    explotar() {
        let explosion = this.explosion.getFirstExists(false);
        explosion.reset(this.sprite.x, this.sprite.y);
        explosion.play(this.explosion.nombre, 30, false, true);
    }

    hundir() {
        this.sprite.kill();
        this.hundido = true;
    }

    acelerarHaciaAdelante() {
        let nuevaVelocidad = this.velocidadActual + 1;
        this.velocidadActual = Math.min(nuevaVelocidad, this.velocidadMaxima);
    }

    acelerarHaciaAtras() {
        let nuevaVelocidad = this.velocidadActual - 1;
        let velocidadMaximaReveresa = (this.velocidadMaxima * -1);
        this.velocidadActual = Math.max(nuevaVelocidad, velocidadMaximaReveresa);
    }

    disminuirVelocidad() {
        if (this.velocidadActual > 0) {
            this.velocidadActual -= 0.5;
        } else if (this.velocidadActual < 0) {
            this.velocidadActual += 0.5;
        }
    }

    virarABabor() {
        if (this.velocidadActual != 0) {
            this.sprite.body.angle -= 0.5;
            //this.sprite.body.rotateLeft(10.5);
        }
    }

    virarAEstribor() {
        if (this.velocidadActual != 0) {
            this.sprite.body.angle += 0.5;
            //this.sprite.body.rotateRight(10.5);
        }
    }

    aplicarEstadoPartida(estadoPartida) {
        this.sprite.body.x = estadoPartida.x;
        this.sprite.body.y = estadoPartida.y;
        this.sprite.body.angle = estadoPartida.angulo;
        this.sprite.body.velocity.x = estadoPartida.velocidadX;
        this.sprite.body.velocity.y = estadoPartida.velocidadY;
        if (estadoPartida.fuegoProa) {
            this.canionProa.fire();
        }
    }
    
}