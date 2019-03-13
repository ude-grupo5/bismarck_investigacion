import Geometria from './util/Geometria.js';

export default class VistaLateral {

    static get ANGULO_VISION () { return 50; }

    /**
     * Constructor
     * @param {Phaser.Game} lateral El juego con vista lateral
     */
    constructor(juegoVistaLateral) {

        this._juego = juegoVistaLateral;
        this.partidaCreada = false;
    }

    // ########################################################################
    // SETTERS
    // ########################################################################

    set barcoJugador (barcoJugador) { this._barcoJugador = barcoJugador; }

    set barcoEnemigo (barcoEnemigo) { this._barcoEnemigo = barcoEnemigo; }

    set datosCargados (datosCargados) { this._datosCargados = datosCargados; }

    set visibilidad (visibilidad) { this._visibilidad = visibilidad; }

    // ########################################################################
    // FUNCIONES PUBLICAS
    // ########################################################################

    pausar() {
        this._juego.paused = true;
    }

    reanudar() {
        this._juego.paused = false;
    }
    
    // ########################################################################
    // FUNCIONES ESTANDAR DE PHASER
    // ########################################################################

    preload() {
        this._precargarEscenario();
        this._precargarBarcos();
    }

    create() {
        this._deshabilitarPerdidaFoco();
        this._crearFondo();
        this._crearOlas();
        //this._crearNubes();
        this._crearBarcoEnemigo();
        this._crearBarcoJugador();
        this._crearLluvia();
    }

    update() {
        if (this._datosCargados) {
            if (this._enemigoVisible()) {
                this._actualizarAnguloBarcoEnemigo();
                this._actualizarEscaladoBarcoEnemigo();
                this._actualizarPosicionBarcoEnemigo();
                this._mostrarEnemigo();
            } else {
                this._ocultarEnemigo();
            }
        }
    }

    // ########################################################################
    // FUNCIONES AUXILIARES PRELOAD
    // ########################################################################

    _precargarEscenario() {
        this._juego.load.image('escenarioLateral', 'sprites/vista_lateral/lateral.png');
        this._juego.load.spritesheet('nube', 'sprites/vista_lateral/nube.png',64,128);
        this._juego.load.spritesheet('oceano', 'sprites/vista_lateral/agua.png', 32, 400, 32);
    }

    _precargarBarcos() {
        let barcoElegido = this._barcoElegido();
        if (barcoElegido == "Bismarck") {
            this._juego.load.image('proaJugador', 'sprites/vista_lateral/proa_bismarck.png');
            this._juego.load.atlas(
                'enemigo',
                'sprites/vista_lateral/hood_texture_atlas.png',
                'sprites/vista_lateral/hood_texture_atlas.json'
            );
        } else if (barcoElegido == "Hood") {
            this._juego.load.image('proaJugador', 'sprites/vista_lateral/proa_hood.png');
            this._juego.load.atlas(
                'enemigo',
                'sprites/vista_lateral/bismarck_texture_atlas.png',
                'sprites/vista_lateral/bismarck_texture_atlas.json'
            );
        }
    }

    // ########################################################################
    // FUNCIONES AUXILIARES CREATE
    // ########################################################################

    _deshabilitarPerdidaFoco() {
        this._juego.stage.disableVisibilityChange = true;
    }

    _crearFondo() {
        this._juego.add.sprite(0, 0, 'escenarioLateral');
    }

    _crearOlas(){
        let horizonte = this._juego.add.tileSprite(0, 295, 128 * 16, 100,'oceano');
        let agua = this._juego.add.tileSprite(0, 300, 128 * 16, 200,'oceano');
        let agua2 = this._juego.add.tileSprite(0, 350, 128 * 16, 200,'oceano');
        
        agua.animations.add('olas', [0, 1, 2, 3, 2, 1]);
        agua.animations.play('olas', 8, true);
        agua2.animations.add('olas2', [12, 13, 14, 15, 14, 13]);
        agua2.animations.play('olas2', 5, true);
        horizonte.animations.add('horizonte', [16, 17, 18, 19, 18, 17]);
    }

    _crearNubes(){
        let nubechica = this._juego.add.tileSprite(0, 0, 256, 120,'nube');
        let nubeGrande = this._juego.add.tileSprite(0, 5, this._juego.height, 120,'nube');
        let nubeConRayo = this._juego.add.tileSprite(256, 2, 128, 120,'nube');
        let nubeConRayo2 = this._juego.add.tileSprite(0, 2, 128, 120,'nube');
        let nubeConRayo3 = this._juego.add.tileSprite(0, 0, this._juego.height, 120,'nube');

        nubechica.animations.add('n1', [0, 1,2]);
        nubechica.animations.play('n1', 4, true); 
        nubeGrande.animations.add('ng',[8])
        nubeGrande.animations.play('ng', 1, true);
        nubeConRayo.animations.add('nr',[4,5,6,7])
        nubeConRayo.animations.play('nr', 1, true);
        nubeConRayo2.animations.add('nr2',[4,5])
        nubeConRayo2.animations.play('nr2', 1, true);
        nubeConRayo3.animations.add('nr3',[1,2,3])
        nubeConRayo3.animations.play('nr3', 2, true);
    }

    _crearBarcoEnemigo(){
        this._spriteEnemigo = this._juego.add.sprite(225, 440, 'enemigo');
        this._spriteEnemigo.anchor.setTo(0.5, 1);
    }

    _crearBarcoJugador() {
        let barcoElegido = this._barcoElegido();
        if (barcoElegido == "Bismarck") {
            let sprite = this._juego.add.sprite(90, 302,'proaJugador');
            sprite.scale.setTo(1.0,1.0);
        } else if (barcoElegido == "Hood") {
            let sprite = this._juego.add.sprite(90, 332,'proaJugador');
            sprite.scale.setTo(0.9,0.9);
        }
    }

    _crearLluvia(){
        let gotas = this._juego.add.bitmapData(15, 50);

        gotas.ctx.rect(0, 5, 5, 20);
        gotas.ctx.fillStyle = '#9cc9de';
        gotas.ctx.fill();

        this.emisor = this._juego.add.emitter(this._juego.world.centerX, -300, 400);

        this.emisor.width = this._juego.world.width;
        this.emisor.angle = 5;

        this.emisor.makeParticles(gotas);

        this.emisor.minParticleScale = 0.1;
        this.emisor.maxParticleScale = 0.7;

        this.emisor.setYSpeed(600, 1000);
        this.emisor.setXSpeed(-5, 5);

        this.emisor.minRotation = 0;
        this.emisor.maxRotation = 0;

        this.emisor.start(false, 1600, 5, 0);
    }

    // ########################################################################
    // FUNCIONES AUXILIARES UPDATE
    // ########################################################################

    /**
     * Indica si el enemigo se encuentra visible para la vista lateral
     * independientemente de si se puede ver en la vista superior.
     */
    _enemigoVisible() {
        return this._barcoEnemigo.visible && this._enemigoEnAnguloVision();
    }

    _actualizarAnguloBarcoEnemigo() {
        let angulo = this._anguloRelativoBarcoEnemigo();
        let anguloRedondeado = (Math.round(angulo / 45) * 45) % 360;
        this._spriteEnemigo.frameName = anguloRedondeado + '';
    }

    _actualizarEscaladoBarcoEnemigo() {
        let distancia = Geometria.distancia(this._barcoJugador,
            this._barcoEnemigo);
        let escalado = 1 - ( 0.9 * ( distancia / this._visibilidad ) );
        this._spriteEnemigo.scale.setTo(escalado, escalado);
    }

    _actualizarPosicionBarcoEnemigo() {
        // centro x = 225
        // y lejano = 330 (linea horizonte)
        // y cercano = 440
        // diferencia y = 110

        let anguloRelativo = this._anguloRelativoPosicionEnemigo();
        let distancia = Geometria.distancia(this._barcoJugador,
            this._barcoEnemigo);

        let x = ( this._juego.width / VistaLateral.ANGULO_VISION )
            * anguloRelativo;
        let y = 440 - ( 110 * ( distancia / this._visibilidad ) );

        this._spriteEnemigo.position.x = x;
        this._spriteEnemigo.position.y = y;
    }

    _mostrarEnemigo() {
        this._spriteEnemigo.visible = true;
    }

    _ocultarEnemigo() {
        this._spriteEnemigo.visible = false;
    }

    // ########################################################################
    // FUNCIONES AUXILIARES PRIVADAS
    // ########################################################################

    _barcoElegido() {
        let parametrosSala = JSON.parse(sessionStorage.parametrosSala);
        return parametrosSala.barcoLocal;
    }

    _enemigoEnAnguloVision() {
        let anguloRelativo = this._anguloRelativoPosicionEnemigo();
        return anguloRelativo <= VistaLateral.ANGULO_VISION;
    }

    /**
     * Devuelve el angulo en que se encuentra el enemigo con respecto a la vista
     * lateral. Siendo 0 cuando se encuentra en el borde izquierdo del angulo de
     * vision y VistaLateral.ANGULO_VISION cuando se encuentra en el borde
     * derecho del angulo de vision.
     */
    _anguloRelativoPosicionEnemigo() {
        let anguloBarcoJugador = this._barcoJugador.angulo;
        let anguloEntreBarcos = Geometria.anguloEntrePuntos(
                this._barcoJugador, this._barcoEnemigo);
        let anguloRelativo = ( anguloEntreBarcos
            + ( VistaLateral.ANGULO_VISION / 2 ) - anguloBarcoJugador ) % 360;
        
        if (anguloRelativo < 0) {
            anguloRelativo += 360;
        }

        return  anguloRelativo;
    }

    /**
     * Devuelve el angulo del barco enemigo en relacion al angulo del barco del
     * jugador. Por ejemplo, si el jugador esta rotado cero grados y el enemigo
     * 180 devuelve 180, pero si el jugador esta rotado 45 grados y el enemigo
     * 180 devuelve 225.
     */
    _anguloRelativoBarcoEnemigo() {
        let anguloEnemigo = this._barcoEnemigo.angulo;
        let anguloJugador = this._barcoJugador.angulo;
        let anguloRelativo = (anguloEnemigo - anguloJugador) % 360;
        if (anguloRelativo < 0) {
            anguloRelativo += 360;
        }
        
        return anguloRelativo;
    }
}
