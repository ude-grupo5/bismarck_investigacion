export default class Controles {

    constructor(juego) {
        this.movimiento = juego.input.keyboard.createCursorKeys();
        this.fuegoProa = juego.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
    }

    get arriba() {
        return this.movimiento.up.isDown;
    }

    get abajo() {
        return this.movimiento.down.isDown;
    }

    get derecha() {
        return this.movimiento.right.isDown;
    }

    get izquierda() {
        return this.movimiento.left.isDown;
    }

    get fuegoProa() {
        return this._fuegoProa.isDown;
    }

    set fuegoProa(fuegoProa) {
        this._fuegoProa = fuegoProa;
    }
}