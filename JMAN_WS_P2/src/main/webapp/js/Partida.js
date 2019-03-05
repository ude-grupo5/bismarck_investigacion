import Controles from './Controles.js';
import EstadoPartida from './EstadoPartida.js';
import Barco from './Barco.js';
import Bala from './Bala.js';
import Canion from './Canion.js';
import Geometria from './util/Geometria.js';

export default class Partida {

    static get ESCALADO_BISMARCK () { return 0.15; }
    static get ESCALADO_BALA_BISMARCK () { return 1; }
    static get ESCALADO_HOOD () { return 0.15; }
    static get ESCALADO_BALA_HOOD () { return 1; }
    static get DAMPING_BARCO () { return 0.8; }
    static get DAMPING_ANGULAR_BARCO () { return 0.9; }
    static get VER_CUERPOS () { return false; }
    
    /**
     * Constructor
     * @param {Phaser.Game} juego El juego principal
     */
    constructor(juego) {    

        this.juego = juego;
        this.websocket = null;

        // barcos
        this.barcoJugador = null;
        this.barcoEnemigo = null;
        this.bismarck = null;
        this.hood = null;

        // puntero
        this.punteroEnemigo = null;

        // niebla
        this.niebla = null;

        // marcador
        this.marcador = null;

        // animaciones
        this.explosiones = null;

        // controles
        this.controles = null;

        // estado enviado por el servidor
        this.estadosRecibidos = [];
    }

    /*************************************************************************
     * FUCIONES ESTANDAR DE PHASER
     *************************************************************************/
    
    preload() {
        this.cargarTilemaps();
        this.cargarImagenes();
        this.cargarSpritesheets();
        this.cargarSpritePhysics();

        this.conectarWebsocket();
    }

    create() {
        this.deshabilitarPerdidaFoco();
        this.iniciarFisica();
        this.crearFondo();
        this.crearNiebla();
        this.crearMarcador();
        this.crearExplosiones();
        this.crearBarcos();
        this.crearColisionEntreBarcos();
        this.asignarBarcos();
        this.crearPunteroEnemigo();
        this.crearArmas();
        this.crearControles();
        this.crearCamaras();
    }

    update() {
        this.procesarEstadosRecibidos();
        this.updateMovimientoJugador();
        this.updatePunteroEnemigo();
        this.updateDisparos();
        this.updateNiebla();
        this.enviarEstadoPartida();
        this.actualizarVidas();
        this.actualizarMarcador();

        //console.log(this.barcoJugador.posicion + ' x: ' + this.barcoJugador.x + ' y: ' + this.barcoJugador.y);
    }

    /*************************************************************************
     * FUCIONES AUXILIARES PRELOAD
     *************************************************************************/

    cargarTilemaps() {
        this.juego.load.tilemap('map', 'sprites/Tile/Mapa.csv', null, Phaser.Tilemap.CSV);
    }

    cargarImagenes() {
        this.juego.load.image('escenario','sprites/escenario.png');
        this.juego.load.image('tiles', 'sprites/Tile/forest_tiles.png');
        this.juego.load.image('balaBismarck','sprites/balaB.png');
        this.juego.load.image('balaHood','sprites/balaH.png');
        this.juego.load.image('bismarck','sprites/Modelo_bismarck.png');
        this.juego.load.image('hood','sprites/Modelo_hood.png');
        this.juego.load.image('punteroRojo','sprites/puntero_rojo.png');
    }

    cargarSpritesheets() {
        this.juego.load.spritesheet('explosionFinal', 'sprites/explosion.png', 128, 128);
        this.juego.load.spritesheet('explosionImpacto', 'sprites/explosion1.png', 64, 64);
        this.juego.load.spritesheet('explosionA', 'sprites/ExplosionAgua.png', 64, 64);
        this.juego.load.spritesheet('vidaHood', 'sprites/Vida_Hood.png',302, 60);
        this.juego.load.spritesheet('vidaBismarck', 'sprites/Vida_Bismarck.png',302, 60);
    }

    cargarSpritePhysics() {
        this.juego.load.json('sprite_physics', 'sprites/sprite_physics.json');
    }

    conectarWebsocket() {
        let host = document.location.host;
        //let pathname = document.location.pathname;
    
        //this.websocket = new WebSocket("ws://" +host  + pathname + "partida/");
        this.websocket = new WebSocket("ws://" + host  + "/websockets/partida/");
        this.websocket.partida = this;
    
        this.websocket.onmessage = function(event) {
            let estadoPartida = JSON.parse(event.data);
            this.partida.estadosRecibidos.push(estadoPartida);
        };
    }

    /*************************************************************************
     * FUCIONES AUXILIARES CREATE
     *************************************************************************/

    deshabilitarPerdidaFoco() {
        this.juego.stage.disableVisibilityChange = true;
    }

    iniciarFisica() {
        this.juego.physics.startSystem(Phaser.Physics.P2JS);
        this.juego.physics.p2.setImpactEvents(true);
        this.juego.physics.p2.updateBoundsCollisionGroup();

        this.juego.world.setBounds(0, 0, 1920, 1200);
        this.juego.add.sprite(0, 0, 'escenario');
    }

    crearFondo() {
        let mapa = this.juego.add.tilemap('map', 32, 32);
        mapa.addTilesetImage('tiles');
        mapa.setCollisionBetween(0, 44);

        let capa = mapa.createLayer(0);
        capa.resizeWorld();
    }

    crearNiebla() {
        let bitmapData = this.juego.make.bitmapData(800, 600);
        let nieblaSprite = bitmapData.addToWorld();
        nieblaSprite.fixedToCamera = true;

        this.niebla = {
            radio: 400,
            franja: 150,
            visibilidad: 350,
            bitmapData: bitmapData
        };
    }

    crearMarcador() {

        this.marcador = {};

        this.crearVidasMarcador();

        // estado de la partida
        let fuenteEstado = { font: '45px Arial', fill: '#fff' };
        let xCentroCamara = this.juego.camera.width / 2;
        let yCentroCamara = this.juego.camera.height / 2;
        let estadoPartida = this.juego.add.text(xCentroCamara, yCentroCamara, ' ', fuenteEstado);
        estadoPartida.anchor.setTo(0.5, 0.5);
        estadoPartida.visible = false;
        estadoPartida.fixedToCamera = true;
        estadoPartida.cameraOffset.setTo(xCentroCamara, yCentroCamara);

        this.marcador.estadoPartida = estadoPartida;
    }

    crearVidasMarcador() {
    
        let vidaBismarck = this.juego.add.sprite(10, 1, 'vidaBismarck');
        
        vidaBismarck.animations.add (100,[4]);
        vidaBismarck.animations.add (75 ,[3]);
        vidaBismarck.animations.add (50,[2]);
        vidaBismarck.animations.add (25,[1]);
        vidaBismarck.animations.add (0,[0]);

        vidaBismarck.fixedToCamera = true;
        vidaBismarck.cameraOffset.setTo(10, 10);

        let vidaHood = this.juego.add.sprite(10, 60, 'vidaHood');
        
        vidaHood.animations.add (100,[4]);
        vidaHood.animations.add (75,[3]);
        vidaHood.animations.add (50,[2]);
        vidaHood.animations.add (25,[1]);
        vidaHood.animations.add (0,[0]);

        vidaHood.fixedToCamera = true;
        vidaHood.cameraOffset.setTo(10, 80);

        this.marcador.vidaBismarck = vidaBismarck;
        this.marcador.bismarckHundido = false;

        this.marcador.vidaHood = vidaHood;
        this.marcador.hoodHundido = false;
    }

    crearExplosiones() {
        this.explosiones = {
            impacto: this.crearExplosion('explosionImpacto'),
            final: this.crearExplosion('explosionFinal')
        }
    }

    crearExplosion(nombreSprite) {
        let explosion = this.juego.add.group();
        explosion.createMultiple(30, nombreSprite);
        explosion.forEach(
            function (entrada) {
                entrada.anchor.x = 0.5;
                entrada.anchor.y = 0.5;
                entrada.animations.add(nombreSprite);
            }
        );
        explosion.nombre = nombreSprite;

        return explosion;
    }

    crearBarcos() {
        this.crearBismarck();
        this.crearHood();
    }

    crearBismarck() {
        let spriteBismarck = this.agregarSpriteConFisica(
            2400,
            2700,
            'bismarck',
            'Modelo_bismarck',
            Partida.ESCALADO_BISMARCK,
            Partida.DAMPING_BARCO,
            Partida.DAMPING_ANGULAR_BARCO
        );
        this.bismarck = new Barco(
            'Bismarck',
            spriteBismarck,
            100,
            100,
            this.explosiones.final
        );
        this.bismarck.grupoColision = this.juego.physics.p2.createCollisionGroup();
    }

    crearHood() {
        let spriteHood = this.agregarSpriteConFisica(
            2000,
            2700,
            'hood',
            'Modelo_hood',
            Partida.ESCALADO_HOOD,
            Partida.DAMPING_BARCO,
            Partida.DAMPING_ANGULAR_BARCO
        );
        this.hood = new Barco(
            'Hood',
            spriteHood,
            100,
            100,
            this.explosiones.final
        );
        this.hood.grupoColision = this.juego.physics.p2.createCollisionGroup();
    }

    /**
     * Agrega un srite con fisica al juego y lo devuelve.
     * @param {number} x Posicion inicial en el eje x
     * @param {number} y Posicion inicial en el eje y
     * @param {string} imagen Nombre de la imagen a utilizar
     * @param {string} nombrePoligono Nombre del poligono que representa el cuerpo del objeto
     * @param {number} escalado Escalado de la imagen
     * @param {number} damping De 0 a 1. Proporcion de perdida de veloidad lineal por segundo
     * @param {number} dampingAngular De 0 a 1. Proporcion de perdida de veloidad de rotacion por segundo
     */
    agregarSpriteConFisica(x, y, imagen, nombrePoligono, escalado, damping, dampingAngular) {
        let sprite = this.juego.add.sprite(x, y, imagen);
        sprite.scale.setTo(escalado, escalado);
        sprite.anchor.setTo(0.5, 0.5);

        this.juego.physics.p2.enable(sprite, Partida.VER_CUERPOS);

        let physicsJSON = this.juego.cache.getJSON('sprite_physics');
        let poligono = this.poligonoEscalado(physicsJSON[nombrePoligono], escalado);
        sprite.body.clearShapes();
        sprite.body.loadPolygon(null, poligono);
        sprite.body.damping = damping;
        sprite.body.angularDamping = dampingAngular;
        sprite.body.collideWorldBounds = true;

        return sprite;
    }

    poligonoEscalado(poligono, escalado) {
        let poligonoEscalado = [];
        for (let i = 0; i < poligono.length; i++) {
            let forma = poligono[i].shape;
            let formaEscalada = [];
            for (let j = 0; j < forma.length; j++) {
                formaEscalada.push(Math.round(forma[j] * escalado, 1));
            }
            poligonoEscalado.push({shape: formaEscalada});
        }
        return poligonoEscalado;
    }

    crearColisionEntreBarcos() {
        this.bismarck.setearColision(this.hood.grupoColision);
        this.hood.setearColision(this.bismarck.grupoColision);
    }

    asignarBarcos() {
        let barcoElegido = this.obtenerBarcoURL();
        if (barcoElegido == "Bismarck") {
            this.barcoJugador = this.bismarck;
            this.barcoEnemigo = this.hood;
        } else if (barcoElegido == "Hood") {
            this.barcoJugador = this.hood;
            this.barcoEnemigo = this.bismarck;
        }
        this.barcoEnemigo.ocultar();
    }

    obtenerBarcoURL() {
        let url_string = window.location.href;
        let url = new URL(url_string);
        let barco = url.searchParams.get("barco");
        return barco;
    }

    crearPunteroEnemigo() {
        this.punteroEnemigo = this.juego.add.sprite(0, 0, 'punteroRojo');
        this.punteroEnemigo.scale.setTo(0.8, 0.8);
        this.punteroEnemigo.anchor.setTo(0.5, 0.5);
    }

    crearArmas() {
        // canion frontal bismarck
        this.crearCanionProa(
            this.bismarck,
            this.hood,
            'balaBismarck',
            Partida.ESCALADO_BALA_BISMARCK
        );
    
        // canionProa hood
        this.crearCanionProa(
            this.hood,
            this.bismarck,
            'balaHood',
            Partida.ESCALADO_BALA_HOOD
        );
    }

    /**
     * Crea el canion de proa del barco
     * @param {Barco} barco 
     * @param {Barco} barcoEnemigo 
     * @param {string} imagenBala Nombre de la imagen de la bala
     * @param {number} escaladoBala Escalado de la imagen de la bala
     */
    crearCanionProa(barco, barcoEnemigo, imagenBala, escaladoBala) {
        let spriteBala = this.juego.add.sprite(0, 0, imagenBala);
        spriteBala.scale.setTo(escaladoBala, escaladoBala);
        spriteBala.anchor.setTo(0.5, 0.5);

        this.juego.physics.p2.enable(spriteBala, Partida.VER_CUERPOS);

        let bala = new Bala(spriteBala);
        bala.grupoColision = this.juego.physics.p2.createCollisionGroup();
        bala.setearColision(barcoEnemigo.grupoColision, this.impactoBala, this);
        barcoEnemigo.setearColision(bala.grupoColision);

        let canion = new Canion(barco, 0, bala);
        barco.canionProa = canion;
    }

    crearControles() {
        this.controles = new Controles(this.juego);
    }

    crearCamaras() {
        this.juego.camera.follow(this.barcoJugador.sprite, Phaser.Camera.FOLLOW_LOCKON);
    }

    /*************************************************************************
     * FUCIONES AUXILIARES UPDATE
     *************************************************************************/
    
    procesarEstadosRecibidos() {
        let estadoPartida = this.estadosRecibidos.shift();
        while (estadoPartida) {
            this.procesarEstado(estadoPartida);
            estadoPartida = this.estadosRecibidos.shift();
        }
    }

    procesarEstado(estadoPartida) {
        if (estadoPartida.jugador == this.barcoEnemigo.nombre) {
            this.procesarEstadoEnemigo(estadoPartida);
        } else if (estadoPartida.fuegoProa) {
            this.barcoJugador.canionProa.disparar();
        }
    }

    procesarEstadoEnemigo(estadoPartida) {
        this.barcoEnemigo.aplicarEstadoPartida(estadoPartida);
        if (estadoPartida.enemigoImpactado) {
            this.barcoJugador.impactado = true;
        }
        this.procesarVisibilidadEnemigo();
    }

    procesarVisibilidadEnemigo() {
        let separacion = this.separacion(this.barcoJugador, this.barcoEnemigo);
        if (separacion < this.niebla.visibilidad) {
            this.barcoEnemigo.mostrar();
        } else {
            this.barcoEnemigo.ocultar();
        }
    }

    separacion(barcoA, barcoB) {
        return Phaser.Math.distance(
            barcoA.x,
            barcoA.y,
            barcoB.x,
            barcoB.y
        );
    }
    
    impactoBala(bodyBala, bodyBarco) {
        let bala = bodyBala.sprite.bala;
        let barco = bodyBarco.sprite.barco;

        bala._matar();
        bodyBarco.setZeroRotation();

        let explosionImpacto = this.explosiones.impacto.getFirstExists(false);
        explosionImpacto.reset(bala.x, bala.y);
        explosionImpacto.play('explosionImpacto', 30, false, true);
        if (barco.nombre == this.barcoEnemigo.nombre) {
            this.barcoEnemigo.impactado = true;
        }
        // TODO: Hacer que el danio sea el que diga la bala
    }

    actualizarVidas() {
        this.barcoJugador.actualizarVida();
        this.barcoEnemigo.actualizarVida();
    }

    actualizarMarcador() {
        let vidaBismarck = this.bismarck.vida;
        this.marcador.vidaBismarck.animations.play(vidaBismarck, 2, true);
        if (!this.marcador.bismarckHundido && this.bismarck.hundido) {
            this.marcador.bismarckHundido = true;
            this.comunicarHundimiento(this.bismarck);
        }

        let vidaHood = this.hood.vida;
        this.marcador.vidaHood.animations.play(vidaHood, 2, true);
        if (!this.marcador.hoodHundido && this.hood.hundido) {
            this.marcador.hoodHundido = true;
            this.comunicarHundimiento(this.hood);
        }
    }

    comunicarHundimiento(barco) {
        let estadoPartida = this.marcador.estadoPartida;
        estadoPartida.text = " El " + barco.nombre + " ha sido hundido";
        estadoPartida.visible = true;
    }

    updateMovimientoJugador() {
        this.updateVelocidadJugador();
        this.updateRotacionJugador();
        this.barcoJugador.mover();
    }

    updateVelocidadJugador() {
        if (this.controles.arriba) {
            this.barcoJugador.acelerarHaciaAdelante();
        } else if (this.controles.abajo) {
            this.barcoJugador.acelerarHaciaAtras();
        } else {
            this.barcoJugador.disminuirVelocidad();
        }
    }

    updateRotacionJugador() {
        if (this.controles.izquierda) {
            this.barcoJugador.virarABabor();
        }
        if (this.controles.derecha) {
            this.barcoJugador.virarAEstribor();
        }
    }

    updatePunteroEnemigo() {
        if (this.barcoEnemigo.oculto) {
            this.reposicionarPuntero(this.barcoEnemigo);
            this.mostrarPuntero();
        } else {
            this.ocultarPuntero();
        }
    }

    reposicionarPuntero(puntoObjetivo) {
        let distancia = this.niebla.radio - this.niebla.franja;
        let angulo = Geometria.anguloEntrePuntos(this.barcoJugador, puntoObjetivo);
        let punto = Geometria.obtenerPunto(this.barcoJugador, distancia, angulo);
        this.punteroEnemigo.position.x = punto.x;
        this.punteroEnemigo.position.y = punto.y;
        this.punteroEnemigo.angle = angulo;
    }

    mostrarPuntero() {
        this.punteroEnemigo.visible = true;
    }

    ocultarPuntero() {
        this.punteroEnemigo.visible = false;
    }

    updateDisparos() {
        if (this.controles.fuegoProa) {
            this.barcoJugador.fuegoProa = true;
        } else {
            this.barcoJugador.fuegoProa = false;
        }
    }

    updateNiebla() {
        let bitmapData = this.niebla.bitmapData;
        let x = this.barcoJugador.sprite.x - this.juego.camera.x;
        let y = this.barcoJugador.sprite.y - this.juego.camera.y;
        let radioInicio = this.niebla.radio;
        let radioFin = radioInicio - this.niebla.franja;

        let gradient = bitmapData.context.createRadialGradient(
            x, y, radioInicio, x, y, radioFin
        );

        gradient.addColorStop(0, 'rgba(0,0,0,0.8');
        gradient.addColorStop(0.4, 'rgba(0,0,0,0.5');
        gradient.addColorStop(1, 'rgba(0,0,0,0');

        bitmapData.clear();
        bitmapData.context.fillStyle = gradient;
        bitmapData.context.fillRect(0, 0, 800, 600);
    }

    enviarEstadoPartida() {
        let estadoPartida = new EstadoPartida(this.barcoJugador, this.barcoEnemigo);
        this.enviarJSON(estadoPartida);
    }

    enviarJSON(objeto) {
        let json = JSON.stringify(objeto);
        this.websocket.send(json);
    }
    
}