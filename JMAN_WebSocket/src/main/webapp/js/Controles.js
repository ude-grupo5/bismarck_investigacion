export default class Controles {

    constructor(juego) {
        this._movimiento = juego.input.keyboard.createCursorKeys();
        this._fuegoProa = juego.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
    }

    get arriba() {
        return this._movimiento.up.isDown;
    }

    get abajo() {
        return this._movimiento.down.isDown;
    }

    get derecha() {
        return this._movimiento.right.isDown;
    }

    get izquierda() {
        return this._movimiento.left.isDown;
    }

    get fuegoProa() {
        return this._fuegoProa.isDown;
    }
}