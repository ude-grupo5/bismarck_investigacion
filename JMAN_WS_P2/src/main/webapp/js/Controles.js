export default class Controles {

    constructor(juego) {
        this._movimiento = juego.input.keyboard.createCursorKeys();
        this._fuegoProa = juego.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
        this._fuegoPopa = juego.input.keyboard.addKey(Phaser.KeyCode.SHIFT);
        this._pausa = juego.input.keyboard.addKey(Phaser.KeyCode.ESC);
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

    get fuegoPopa() {
        return this._fuegoPopa.isDown;
    }

    get pausa() {
        return this._pausa.isDown;
    }
}