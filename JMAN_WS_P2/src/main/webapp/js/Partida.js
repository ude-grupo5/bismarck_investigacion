import Controles from './Controles.js';
import EstadoPartida from './EstadoPartida.js';
import EstadoGuardado from './EstadoGuardado.js';
import Barco from './Barco.js';
import Bala from './Bala.js';
import Canion from './Canion.js';
import Geometria from './util/Geometria.js';
import MenuPausa from './MenuPausa.js';
import Config from './config/Config.js';

export default class Partida {

    static get ESCALADO_BISMARCK () { return 0.15; }
    static get ESCALADO_BALA_BISMARCK () { return 1; }
    static get ESCALADO_HOOD () { return 0.15; }
    static get ESCALADO_BALA_HOOD () { return 1; }
    static get DAMPING_BARCO () { return 0.8; }
    static get DAMPING_ANGULAR_BARCO () { return 0.9; }
    static get VELOCIDAD_BISMARCK () { return 100; }
    static get VELOCIDAD_HOOD () { return 100; }
    static get VER_CUERPOS () { return true; }
    static get VIDA_BISMARCK () { return 200; }
    static get VIDA_HOOD () { return 100; }
    
    /**
     * Constructor
     * @param {Phaser.Game} juego El juego principal
     */
    constructor(juego, vistaLateral) {

        this.juego = juego;
        this.vistaLateral = vistaLateral;

        // websockets
        this.websocket = null;

        // mapa
        this.mapa = null;

        // grupos de colision
        this.gruposColision  = null;

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
        this.animaciones = null;

        // sonidos
        this.sonidos = null;

        // menu pausa
        this.menuPausa = null;

        // controles
        this.controles = null;

        // estados enviados por el servidor
        this.estadosRecibidos = [];
    }

    // ########################################################################
    // FUNCIONES PUBLICAS
    // ########################################################################
    
    reanudar() {
        this.juego.paused = false;
        this.vistaLateral.reanudar();
    }

    // ########################################################################
    // FUCIONES ESTANDAR DE PHASER
    // ########################################################################
    
    preload() {
        this.cargarMapa();
        this.cargarImagenes();
        this.cargarSpritesheets();
        this.cargarSpritePhysics();
        this.cargarAudio();

        this.conectarWebsocket();
    }

    create() {
        this.deshabilitarPerdidaFoco();
        this.iniciarFisica();

        this.crearMapa();
        this.crearGruposDeColision();
        this.setearColisionesMapa();

        this.crearExplosiones();

        this.crearSonidos();
        
        this.crearBarcos();
        this.setearColisionBarcos();
        this.asignarBarcos();
        
        this.crearArmas();

        this.crearNiebla();

        this.crearPunteroEnemigo();

        this.crearMarcador();

        this.crearMenuPausa();

        this.crearControles();
        this.crearCamaras();

        this.cargarDatosVistaLarteral();
    }

    update() {
        this.procesarEstadosRecibidos();
        this.updateAccionesJugador();
        this.updatePunteroEnemigo();
        this.updateDisparos();
        this.updateNiebla();
        this.enviarEstadoPartida();
        this.actualizarVidas();
        this.actualizarMarcador();
        
        this.estadoGuardado = new EstadoGuardado();
    }

    // ########################################################################
    // FUCIONES AUXILIARES PRELOAD
    // ########################################################################

    cargarMapa() {
        this.juego.load.tilemap('map', 'sprites/Tile/Mapa.csv', null, Phaser.Tilemap.CSV);
        this.juego.load.image('tiles', 'sprites/Tile/forest_tiles.png');
    }

    cargarImagenes() {
        this.juego.load.image('balaBismarck','sprites/balaB.png');
        this.juego.load.image('balaHood','sprites/balaH.png');
        this.juego.load.image('bismarck','sprites/Modelo_bismarck.png');
        this.juego.load.image('hood','sprites/Modelo_hood.png');
        this.juego.load.image('punteroRojo','sprites/puntero_rojo.png');
    }

    cargarSpritesheets() {
        this.juego.load.spritesheet('explosionFinal', 'sprites/explosion.png', 128, 128);
        this.juego.load.spritesheet('explosionImpacto', 'sprites/explosion1.png', 64, 64);
        this.juego.load.spritesheet('impactoAgua', 'sprites/ExplosionAgua.png', 64, 64);
        this.juego.load.spritesheet('vidaHood', 'sprites/vida_hood.png',298, 60);
        this.juego.load.spritesheet('vidaBismarck', 'sprites/vida_bismarck.png', 290, 61);
    }

    cargarSpritePhysics() {
        this.juego.load.json('sprite_physics', 'sprites/sprite_physics.json');
    }

    cargarAudio() {
        this.juego.load.audio('ambiente','audio/ambiente.wav');
        this.juego.load.audio('barco','audio/Barco.wav');
        this.juego.load.audio('disparo', 'audio/disparo.mp3');
        this.juego.load.audio('impactoBala', 'audio/explosionImpacto.wav');
        this.juego.load.audio('explosionFinal', 'audio/explosionFinal.wav');	
        this.juego.load.audio('impactoAgua', 'audio/Splash.wav');
    }

    conectarWebsocket() {
        this.websocket = new WebSocket('ws://' + Config.URL_BASE + 'partida/');
        this.websocket.partida = this;
    
        this.websocket.onmessage = function(event) {
            let estadoPartida = JSON.parse(event.data);
            this.partida.estadosRecibidos.push(estadoPartida);
        };
    }

    // ########################################################################
    // FUCIONES AUXILIARES CREATE
    // ########################################################################

    deshabilitarPerdidaFoco() {
        this.juego.stage.disableVisibilityChange = true;
    }

    iniciarFisica() {
        this.juego.physics.startSystem(Phaser.Physics.P2JS);
        this.juego.physics.p2.setImpactEvents(true);
        this.juego.physics.p2.updateBoundsCollisionGroup();
    }

    crearMapa() {
        let mapa = this.juego.add.tilemap('map', 32, 32);
        mapa.addTilesetImage('tiles');

        let capa = mapa.createLayer(0);
        capa.resizeWorld();

        mapa.setCollisionBetween(0, 132);
        mapa.setCollisionBetween(134, 200);

        this.mapa = mapa;
        // Convierte el tilemap en cuerpos
        this.juego.physics.p2.convertTilemap(mapa, capa);

        // Definir los cuatro limites del mapa
        this.juego.physics.p2.setBounds(0, 0, 3200, 3200, true, true, true, true, true);
    }

    crearGruposDeColision() {
        let p2 = this.juego.physics.p2;
        this.gruposColision = {
            balasBismarck: p2.createCollisionGroup(),
            balasHood: p2.createCollisionGroup(),
            bismarck: p2.createCollisionGroup(),
            hood: p2.createCollisionGroup(),
            mapa: p2.createCollisionGroup()
        }
    }

    setearColisionesMapa() {
        let cuerposMapa = this.mapa.layer.bodies;
        for (let cuerpo of cuerposMapa) {
            cuerpo.setCollisionGroup(this.gruposColision.mapa);
            cuerpo.collides([
                this.gruposColision.balasBismarck,
                this.gruposColision.balasHood,
                this.gruposColision.bismarck,
                this.gruposColision.hood
            ]);
        }
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
        
        for (let i = 0; i <= 8; i++) {
            let vida = i * 25;
            vidaBismarck.animations.add(vida, [i]);
        }

        vidaBismarck.fixedToCamera = true;
        vidaBismarck.cameraOffset.setTo(10, 10);

        let vidaHood = this.juego.add.sprite(10, 60, 'vidaHood');
        
        for (let i = 0; i <= 4; i++) {
            let vida = i * 25;
            vidaHood.animations.add(vida, [i]);
        }

        vidaHood.fixedToCamera = true;
        vidaHood.cameraOffset.setTo(10, 80);

        this.marcador.vidaBismarck = vidaBismarck;
        this.marcador.bismarckHundido = false;

        this.marcador.vidaHood = vidaHood;
        this.marcador.hoodHundido = false;
    }

    crearMenuPausa() {
        this.menuPausa = new MenuPausa(this);
    }

    crearExplosiones() {
        this.animaciones = {
            explosionImpacto: this.crearSpriteAnimado('explosionImpacto'),
            explosionFinal: this.crearSpriteAnimado('explosionFinal'),
            impactoAgua: this.crearSpriteAnimado('impactoAgua')
        }
    }

    crearSonidos() {
        this.sonidos = {
            disparo: this.juego.add.audio('disparo'),
            explosionImpacto: this.juego.add.audio('impactoBala'),
            explosionFinal: this.juego.add.audio('explosionFinal'),
            impactoAgua: this.juego.add.audio('impactoAgua')
        }
    }

    crearSpriteAnimado(nombreSpriteSheet) {
        let sprite = this.juego.add.sprite(0, 0, nombreSpriteSheet);
        sprite.anchor.x = 0.5;
        sprite.anchor.y = 0.5;
        sprite.animations.add(nombreSpriteSheet);

        return sprite;
    }

    crearBarcos() {
        this.crearBismarck();
        this.crearHood();
    }

    crearBismarck() {
        let spriteBismarck = this.crearSpriteBarco(
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
            Partida.VIDA_BISMARCK,
            Partida.VELOCIDAD_BISMARCK,
            this.animaciones.explosionFinal,
            this.sonidos.explosionFinal
        );
        this.bismarck.grupoColision = this.gruposColision.bismarck;
    }

    crearHood() {
        let spriteHood = this.crearSpriteBarco(
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
            Partida.VIDA_HOOD,
            Partida.VELOCIDAD_HOOD,
            this.animaciones.explosionFinal,
            this.sonidos.explosionFinal
        );
        this.hood.grupoColision = this.gruposColision.hood;
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
    crearSpriteBarco(x, y, imagen, nombrePoligono, escalado, damping, dampingAngular) {
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

    setearColisionBarcos() {
        this.bismarck.setearColision([
            this.gruposColision.balasHood,
            this.gruposColision.hood,
            this.gruposColision.mapa
        ]);
        this.hood.setearColision([
            this.gruposColision.balasBismarck,
            this.gruposColision.bismarck,
            this.gruposColision.mapa
        ]);
    }

    asignarBarcos() {
        let barcoElegido = this.obtenerBarcoJugador();
        if (barcoElegido == "Bismarck") {
            this.barcoJugador = this.bismarck;
            this.barcoEnemigo = this.hood;
        } else if (barcoElegido == "Hood") {
            this.barcoJugador = this.hood;
            this.barcoEnemigo = this.bismarck;
        }
        this.barcoEnemigo.ocultar();
    }

    obtenerBarcoJugador() {
        let parametrosSala = JSON.parse(sessionStorage.parametrosSala);
        return parametrosSala.barcoLocal;
    }

    crearPunteroEnemigo() {
        this.punteroEnemigo = this.juego.add.sprite(0, 0, 'punteroRojo');
        this.punteroEnemigo.scale.setTo(0.8, 0.8);
        this.punteroEnemigo.anchor.setTo(0.5, 0.5);
    }

    crearArmas() {
        this.crearCaniones(
            this.bismarck,
            this.hood,
            'balaBismarck',
            Partida.ESCALADO_BALA_BISMARCK,
            this.gruposColision.balasBismarck
        );
    
        this.crearCaniones(
            this.hood,
            this.bismarck,
            'balaHood',
            Partida.ESCALADO_BALA_HOOD,
            this.gruposColision.balasHood
        );
    }

    /**
     * Crea los caniones del barco
     * @param {Barco} barco 
     * @param {Barco} barcoOpuesto 
     * @param {string} imagenBala Nombre de la imagen de la bala
     * @param {number} escaladoBala Escalado de la imagen de la bala
     * @param {Phaser.Physics.CollisionGroup} grupoColisonBalas Grupo de colision de las balas
     */
    crearCaniones(barco, barcoOpuesto, imagenBala, escaladoBala, grupoColisionBalas) {
        let balaProa = this.crearBala(barcoOpuesto, imagenBala, escaladoBala, grupoColisionBalas);
        let balaPopa = this.crearBala(barcoOpuesto, imagenBala, escaladoBala, grupoColisionBalas);

        let canionProa = new Canion(barco, 0, balaProa, this.sonidos.disparo);
        barco.canionProa = canionProa;

        let canionPopa = new Canion(barco, 180, balaPopa, this.sonidos.disparo);
        barco.canionPopa = canionPopa;
    }

    crearBala(barcoOpuesto, imagenBala, escaladoBala, grupoColisionBalas) {
        let spriteBala = this.juego.add.sprite(0, 0, imagenBala);
        spriteBala.scale.setTo(escaladoBala, escaladoBala);
        spriteBala.anchor.setTo(0.5, 0.5);

        this.juego.physics.p2.enable(spriteBala, Partida.VER_CUERPOS);
        spriteBala.body.setCircle(6);

        let bala = new Bala(spriteBala, this.animaciones.impactoAgua, this.sonidos.impactoAgua, this.animaciones.explosionImpacto, this.sonidos.explosionImpacto);
        bala.grupoColision = grupoColisionBalas;
        bala.setearColision(barcoOpuesto.grupoColision, this.impactoBalaBarco, this);
        bala.setearColision(this.gruposColision.mapa, this.impactoBalaMapa, this);
        
        spriteBala.body.onBeginContact.add(this.balaBeginContact, bala);

        return bala;
    }

    balaBeginContact(body, bodyB, shapeA, shapeB, equation) {
        if(!body) { // si contacto con borde
            this.desaparecer(); // this es la bala
        }
    }
    
    impactoBalaBarco(bodyBala, bodyBarco) {
        let bala = bodyBala.sprite.bala;
        let barco = bodyBarco.sprite.barco;
        bala.explotar();
        bodyBarco.setZeroRotation();

        if (barco.nombre == this.barcoEnemigo.nombre) {
            this.barcoEnemigo.registrarImpacto(bala.danio());
        }
    }
    
    impactoBalaMapa(bodyBala, bodyMapa) {
        let bala = bodyBala.sprite.bala;
        bala.desaparecer();
    }

    crearControles() {
        this.controles = new Controles(this.juego);
    }

    crearCamaras() {
        this.juego.camera.follow(this.barcoJugador.sprite, Phaser.Camera.FOLLOW_LOCKON);
    }

    cargarDatosVistaLarteral() {
        this.vistaLateral.barcoJugador = this.barcoJugador;
        this.vistaLateral.barcoEnemigo = this.barcoEnemigo;
        this.vistaLateral.visibilidad = this.niebla.visibilidad;
        this.vistaLateral.datosCargados = true;
    }

    // ########################################################################
    //      FUCIONES AUXILIARES UPDATE
    // ########################################################################

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
        } else {
            if (estadoPartida.fuegoProa) {
                this.barcoJugador.canionProa.disparar();
            }
            if (estadoPartida.fuegoPopa) {
                this.barcoJugador.canionPopa.disparar();
            }
        }
    }

    procesarEstadoEnemigo(estadoPartida) {
        this.barcoEnemigo.aplicarEstadoPartida(estadoPartida);
        if (estadoPartida.enemigoImpactado) {
            this.barcoJugador.registrarImpacto(estadoPartida.danioImpacto);
        }
        this.procesarVisibilidadEnemigo();
    }

    procesarVisibilidadEnemigo() {
        if (!this.barcoEnemigo.hundido) {
            let separacion = Geometria.distancia(this.barcoJugador, this.barcoEnemigo);
            if (separacion < this.niebla.visibilidad) {
                this.barcoEnemigo.mostrar();
            } else {
                this.barcoEnemigo.ocultar();
            }
        }
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

    updateAccionesJugador() {
        this.updatePausaJugador();
        this.updateVelocidadJugador();
        this.updateRotacionJugador();
        this.barcoJugador.mover();
    }

    updatePausaJugador() {
        if (this.controles.pausa) {
            this.juego.paused = true;
            this.vistaLateral.pausar()
            this.menuPausa.mostrar();
        }
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
        if (this.barcoEnemigo.oculto && !this.barcoEnemigo.hundido) {
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
        if (this.controles.fuegoPopa) {
            this.barcoJugador.fuegoPopa = true;
        } else {
            this.barcoJugador.fuegoPopa = false;
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