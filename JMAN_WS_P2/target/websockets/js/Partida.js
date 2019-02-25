import Controles from './Controles.js';
import EstadoPartida from './EstadoPartida.js';

export default class Partida {
    
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

        // niebla
        this.niebla = null;

        // marcador
        this.marcador = null;

        // animaciones
        this.explosiones = null;

        // controles
        this.controles = null;

        // estado enviado por el servidor
        this.estadosPartidaActualizado = null;
    }

    /*************************************************************************
     * FUCIONES ESTANDAR DE PHASER
     *************************************************************************/
    
    preload() {
        this.cargarTilemaps();
        this.cargarImagenes();
        this.cargarSpritesheets();

        this.conectarWebsocket();
    }

    create() {

        this.deshabilitarPerdidaFoco();
        this.iniciarFisica();
        this.crearFondo();
        this.crearNiebla();
        this.crearMarcador();
        this.crearBarcos();
        this.asignarBarcos();
        this.crearArmas();
        this.crearExplosiones();
        this.crearControles();
        this.crearCamaras();

        //this.actualizarMarcador();
    }

    update() {
        //Logica del game como los movimientos, las colisiones, el movimiento del personaje, etc
        this.updateColisiones();
        this.procesarEstadosRecibidos();
        this.updateMovimientoJugador();
        this.updateDisparos();
        this.updateNiebla();
        this.enviarEstadoPartida();
        this.actualizarVidas();
        this.actualizarMarcador();
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
        this.juego.load.image('bala1','sprites/balaB.png');
        this.juego.load.image('bala2','sprites/balaH.png');
    }

    cargarSpritesheets() {
        this.juego.load.spritesheet('bismarck','sprites/Modelo_bismarck.png');
        this.juego.load.spritesheet('hood','sprites/Modelo_hood.png');
        this.juego.load.spritesheet('explosionFinal', 'sprites/explosion.png', 128, 128);
        this.juego.load.spritesheet('explosionImpacto', 'sprites/explosion1.png', 64, 64);
        this.juego.load.spritesheet('explosionA', 'sprites/ExplosionAgua.png', 64, 64);
        this.juego.load.spritesheet('vidaHood', 'sprites/Vida_Hood.png',302, 60);
        this.juego.load.spritesheet('vidaBismarck', 'sprites/Vida_Bismarck.png',302, 60);
    }

    conectarWebsocket() {
        let host = document.location.host;
        //let pathname = document.location.pathname;
    
        //this.websocket = new WebSocket("ws://" +host  + pathname + "partida/");
        this.websocket = new WebSocket("ws://" +host  + "/websockets/partida/");
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
        this.juego.physics.startSystem(Phaser.Physics.ARCADE);
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
            radio: 250,
            franja: 50,
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
        this.marcador.vidaHood = vidaHood;
    }

    crearBarcos() {
        // bismarck
        this.bismarck = this.juego.add.sprite(2400, this.juego.world.height - 200, 'bismarck');
        this.bismarck.scale.setTo(0.2,0.2);
        this.bismarck.anchor.setTo(0.5,0.5);
        this.bismarck.angle = 180;
        
        this.juego.physics.arcade.enable(this.bismarck);
		
        this.bismarck.enablebody = true;
        this.bismarck.body.collideWorldBounds = true;
        this.bismarck.nombre = "Bismarck";
        this.bismarck.vida = 100;
        this.bismarck.velocidadMaxima = 100;
        this.bismarck.velocidadActual = 0;
        
        // hood
        this.hood = this.juego.add.sprite(2000, this.juego.world.height - 200,'hood');
        this.hood.scale.setTo(0.2,0.2);
        this.hood.anchor.setTo(0.5,0.5);
        this.hood.angle = 150;
        
        this.juego.physics.arcade.enable(this.hood);
		
        this.hood.enablebody = true;
        this.hood.body.collideWorldBounds = true;
        this.hood.nombre = "Hood";
        this.hood.vida = 100;
        this.hood.velocidadMaxima = 100;
        this.hood.velocidadActual = 0;
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
    }

    obtenerBarcoURL() {
        let url_string = window.location.href;
        let url = new URL(url_string);
        let barco = url.searchParams.get("barco");
        return barco;
    }

    crearArmas() {
        // canion frontal bismarck
        let canionProaBismarck = this.juego.add.weapon(1, 'bala1');
        canionProaBismarck.bulletKillType = Phaser.Weapon.KILL_DISTANCE;
        canionProaBismarck.bulletKillDistance = 230;
        canionProaBismarck.bulletAngleOffset = 300;
        canionProaBismarck.bulletSpeed = 500;
        canionProaBismarck.trackSprite(this.bismarck, 0, 0, true);

        this.juego.physics.arcade.enable(canionProaBismarck);
        this.bismarck.canionProa = canionProaBismarck;
    
        // canionProa hood
        let canionProaHood = this.juego.add.weapon(1, 'bala2');
        canionProaHood.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
        canionProaHood.bulletKillDistance = 230;
        canionProaHood.bulletAngleOffset = 300;
        canionProaHood.bulletSpeed = 500;
        canionProaHood.trackSprite(this.hood, 0, 0, true);
        
        this.juego.physics.arcade.enable(canionProaHood);
        this.hood.canionProa = canionProaHood;
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

        return explosion;
    }

    crearControles() {
        this.controles = new Controles(this.juego);
    }

    crearCamaras() {
        this.juego.camera.follow(this.barcoJugador,Phaser.Camera.FOLLOW_PLATFORMER);
    }

    /*************************************************************************
     * FUCIONES AUXILIARES UPDATE
     *************************************************************************/
    
    updateColisiones() {
        let arcade = this.juego.physics.arcade;
        let balasBismarck = this.bismarck.canionProa.bullets;
        let balasHood = this.hood.canionProa.bullets;

        this.resetearImpactos();

        // colision balas
        arcade.collide(this.hood, balasBismarck, this.impactoBala, function(){return true;}, this);
        arcade.collide(this.bismarck, balasHood, this.impactoBala, function(){return true;}, this);

        // colision entre barcos
        arcade.collide(this.bismarck, this.hood);
        //arcade.collide(this.hood, this.bismarck);
    }

    procesarEstadosRecibidos() {
        let estadoPartida = this.estadosRecibidos.shift();
        while (estadoPartida) {
            this.procesarEstado(estadoPartida);
            estadoPartida = this.estadosRecibidos.shift();
        }
    }

    procesarEstado() {
        if (estadoPartida.jugador == this.barcoEnemigo.nombre) {
            this.procesarEstadoEnemigo();
        } else if (estadoPartida.fuegoProa) {
            this.barcoJugador.canionProa.fire();
        }
    }

    procesarEstadoEnemigo() {
        this.barcoEnemigo.body.x = estadoPartida.x;
        this.barcoEnemigo.body.y = estadoPartida.y;
        this.barcoEnemigo.angle = estadoPartida.angulo;
        this.barcoEnemigo.body.velocity.x = estadoPartida.velocidadX;
        this.barcoEnemigo.body.velocity.y = estadoPartida.velocidadY;
        this.enemigoImpactado = barcoJugador.impactado;
        if (estadoPartida.fuegoProa) {
            this.barcoEnemigo.canionProa.fire();
        }
        if (estadoPartida.enemigoImpactado) {
            this.barcoJugador.impactado = true;
        }
    }

    resetearImpactos() {
        this.hood.impactado = false;
        this.bismarck.impactado = false;
    }
    
    impactoBala(barco, bala) {
        bala.kill();
            
        let explosionImpacto = this.explosiones.impacto.getFirstExists(false);
        explosionImpacto.reset(barco.body.x, barco.body.y);
        explosionImpacto.play('explosionImpacto', 30, false, true);
        
        if (barco.nombre == this.barcoEnemigo.nombre) {
            barco.impactado = true;
        }
    }

    actualizarVidas() {
        actualizarVida(this.barcoJugador);
        actualizarVida(this.barcoEnemigo);
    }

    actualizarVida(barco) {
        if (barco.impactado) {
            barco.vida -= 25;
        }
        if (barco.vida <= 0) {
            mostrarExplosionFinal(barco);
            barco.kill();
            this.comunicarHundimiento(barco);
        }
    }

    mostrarExplosionFinal(barco) {
        let explosionFinal = this.explosiones.final.getFirstExists(false);
        explosionFinal.reset(barco.body.x, barco.body.y);
        explosionFinal.play('explosionFinal', 30, false, true);
    }

    comunicarHundimiento(barco) {
        let estadoPartida = this.marcador.estadoPartida;
        estadoPartida.text = " El " + barco.nombre + " ha sido hundido";
        estadoPartida.visible = true;
    }

    actualizarMarcador() {
        let vidaBismarck = this.bismarck.vida;
        this.marcador.vidaBismarck.animations.play(vidaBismarck, 2, true);

        let vidaHood = this.hood.vida;
        this.marcador.vidaHood.animations.play(vidaHood, 2, true);
    }

    updateMovimientoJugador() {
        let velocidadMaxima = this.barcoJugador.velocidadMaxima;
        let velocidadAnterior = this.barcoJugador.velocidadActual;
        
        if (this.controles.arriba) {
            if (velocidadAnterior < velocidadMaxima) {
                this.barcoJugador.velocidadActual += 1;
            }
        } else if (this.controles.abajo) {
            if (velocidadAnterior > (velocidadMaxima * -1)) {
                this.barcoJugador.velocidadActual -= 1;
            }
        } else {
            this.disminuirVelocidad(this.barcoJugador);
        }

        if (this.barcoJugador.velocidadActual != 0) {
            this.updateRotacion();
            this.juego.physics.arcade.velocityFromRotation(this.barcoJugador.rotation, this.barcoJugador.velocidadActual, this.barcoJugador.body.velocity);
        } else {
            this.barcoJugador.body.velocity.x = 0;
            this.barcoJugador.body.velocity.y = 0;
        }
    }

    disminuirVelocidad(barco) {
        if (barco.velocidadActual > 0) {
            barco.velocidadActual -= 0.5;
        } else if (barco.velocidadActual < 0) {
            barco.velocidadActual += 0.5;
        }
    }

    updateRotacion() {
        if (this.controles.izquierda) {
            this.barcoJugador.angle -= 0.5;
        } else if (this.controles.derecha) {
            this.barcoJugador.angle += 0.5;
        }
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
        let x = this.barcoJugador.x - this.juego.camera.x;
        let y = this.barcoJugador.y - this.juego.camera.y;
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