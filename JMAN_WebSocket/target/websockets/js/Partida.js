export default class Partida {
    
    constructor(phaserGame) {

        this.juego = phaserGame;
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
    }

    update() {
        //Logica del game como los movimientos, las colisiones, el movimiento del personaje, etc
        this.updateColisiones();
        this.updateMovimientoJugador();
        this.updateDisparos();
        this.updateNiebla();
        this.enviarPosicion();
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
        this.juego.load.spritesheet('barco','sprites/barco.png',51,55);
        this.juego.load.spritesheet('barco2','sprites/barco.png',51,55);
        this.juego.load.spritesheet('explosion', 'sprites/explosion.png', 128, 128);
        this.juego.load.spritesheet('explosion1', 'sprites/explosion1.png', 64, 64);
        this.juego.load.spritesheet('explosionA', 'sprites/ExplosionAgua.png', 64, 64);
    }

    conectarWebsocket() {
        let host = document.location.host;
        //let pathname = document.location.pathname;
    
        //this.websocket = new WebSocket("ws://" +host  + pathname + "partida/");
        this.websocket = new WebSocket("ws://" +host  + "/websockets/partida/");
        this.websocket.partida = this;
    
        this.websocket.onmessage = function(event) {
            let posiciones = JSON.parse(event.data);
            this.partida.actualizarPosicionEnemigo(posiciones);
        };
    }

    actualizarPosicionEnemigo(posiciones) {

        if (this.barcoEnemigo.nombre == "Hood") {
            //console.log("entra hood");
            this.hood.position.x = posiciones.xHood;
            this.hood.position.y = posiciones.yHood;
            this.hood.angle = posiciones.anguloHood;
        } else if (this.barcoEnemigo.nombre == "Bismarck") {
            //console.log("entra bismarck");
            this.bismarck.position.x = posiciones.xBismarck;
            this.bismarck.position.y = posiciones.yBismarck;
            this.bismarck.angle = posiciones.anguloBismarck;
        }
    }

    /*************************************************************************
     * FUCIONES AUXILIARES CREATE
     *************************************************************************/

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
            radio: 500,
            franja: 50,
            bitmapData: bitmapData
        };
    }

    crearMarcador() {
        // fuentes
        let fuenteVida = { font: '20px Arial', fill: '#fff' };
        let fuenteEstado = { font: '45px Arial', fill: '#fff' };

        // vida bismarck
        let textoVidaBismarck = 'Vida Bismarck : ' + 100 + "%";
        let vidaBismarck = this.juego.add.text(10, 10, textoVidaBismarck, fuenteVida);
        vidaBismarck.fixedToCamera = true;
        vidaBismarck.cameraOffset.setTo(10, 10);
        
        // vida hood
        let textoVidaHood = 'Vida Hood : ' + 100 + "%";
        let vidaHood = this.juego.add.text(10, 40, textoVidaHood , fuenteVida);
        vidaHood.fixedToCamera = true;
        vidaHood.cameraOffset.setTo(10, 40);

        // estado de la partida
        let xCentroCamara = this.juego.camera.width / 2;
        let yCentroCamara = this.juego.camera.height / 2;
        let estadoPartida = this.juego.add.text(xCentroCamara, yCentroCamara, ' ', fuenteEstado);
        estadoPartida.anchor.setTo(0.5, 0.5);
        estadoPartida.visible = false;
        estadoPartida.fixedToCamera = true;
        estadoPartida.cameraOffset.setTo(xCentroCamara, yCentroCamara);

        this.marcador = {
            vidaBismarck: vidaBismarck,
            vidaHood: vidaHood,
            estadoPartida: estadoPartida
        }
    }

    crearBarcos() {
        // bismarck
        this.bismarck = this.juego.add.sprite(2400, this.juego.world.height - 200,'barco');
        this.bismarck.scale.setTo(0.5,0.5);
        this.bismarck.anchor.setTo(0.5,0.5);
        this.bismarck.angle = 180;
        
        this.juego.physics.arcade.enable(this.bismarck);
		
        this.bismarck.body.inmovable = true;
        this.bismarck.enablebody = true;
        this.bismarck.body.collideWorldBounds = true;
        this.bismarck.nombre = "Bismarck";
        this.bismarck.vida = 100;
        
        // hood
        this.hood = this.juego.add.sprite(450, this.juego.world.height - 200,'barco2');
        this.hood.scale.setTo(0.5,0.5);
        this.hood.anchor.setTo(0.5,0.5);
        this.hood.angle = 150;
        
        this.juego.physics.arcade.enable(this.hood);
		
        this.hood.body.inmovable = true;
        this.hood.enablebody = true;
        this.hood.body.collideWorldBounds = true;
        this.hood.nombre = "Hood";
        this.hood.vida = 100;
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
        let canionFrontalBismarck = this.juego.add.weapon(1, 'bala1');
        canionFrontalBismarck.bulletKillType = Phaser.Weapon.KILL_DISTANCE;
        canionFrontalBismarck.bulletKillDistance = 230;
        canionFrontalBismarck.bulletAngleOffset = 300;
        canionFrontalBismarck.bulletSpeed = 500;
        canionFrontalBismarck.trackSprite(this.bismarck, 0, 0, true);

        this.juego.physics.arcade.enable(canionFrontalBismarck);
        this.bismarck.canionFrontal = canionFrontalBismarck;
    
        // canionFrontal hood
        let canionFrontalHood = this.juego.add.weapon(1, 'bala2');
        canionFrontalHood.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
        canionFrontalHood.bulletAngleOffset =240;
        canionFrontalHood.bulletSpeed = 300;
        canionFrontalHood.trackSprite(this.hood, 0, 0, true);
        
        this.juego.physics.arcade.enable(canionFrontalHood);
        this.hood.canionFrontal = canionFrontalHood;
    }

    crearExplosiones() {
        // explosion impacto
        let explosionImpacto = this.juego.add.group();
        explosionImpacto.createMultiple(30, 'explosion1');
        explosionImpacto.forEach(
            function (entrada) {
                entrada.anchor.x = 0.5;
                entrada.anchor.y = 0.5;
                entrada.animations.add('explosion1');
            }
        );

        // explosion final
        let explosionFinal = this.juego.add.group();
        explosionFinal.createMultiple(30, 'explosion');
        explosionFinal.forEach(
            function (entrada) {
                entrada.anchor.x = 0.5;
                entrada.anchor.y = 0.5;
                entrada.animations.add('explosion');
            }
        );

        this.explosiones = {
            impacto: explosionImpacto,
            final: explosionFinal
        }
    }

    crearControles() {
        let movimiento = this.juego.input.keyboard.createCursorKeys();
        let fuego = this.juego.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);

        this.controles = {
            movimiento: movimiento,
            fuegoFrontal: fuego
        }
    }

    crearCamaras() {
        this.juego.camera.follow(this.barcoJugador,Phaser.Camera.FOLLOW_PLATFORMER);
        this.juego.minimap = this.juego.cameras.add(200, 10, 400, 100).setZoom(0.2).setName('mini');
        this.juego.minimap.setBackgroundColor(0x002244);
        this.juego.minimap.scrollX = 1600;
        this.juego.minimap.scrollY = 300;
    }

    /*************************************************************************
     * FUCIONES AUXILIARES UPDATE
     *************************************************************************/
    
    updateColisiones() {
        let arcade = this.juego.physics.arcade;
        let balasBismarck = this.bismarck.canionFrontal.bullets;
        let balasHood = this.hood.canionFrontal.bullets;

        // colision balas
        arcade.collide(this.hood, balasBismarck, this.impactoBala, function(){return true;}, this);
        arcade.collide(this.bismarck, balasHood, this.impactoBala, function(){return true;}, this);

        // colision entre barcos
        arcade.collide(this.bismarck, this.hood);
        arcade.collide(this.hood, this.bismarck);
    }
    
    impactoBala(barco, bala) {
        bala.kill();
            
        let explosionImpacto = this.explosiones.impacto.getFirstExists(false);
        explosionImpacto.reset(barco.body.x, barco.body.y);
        explosionImpacto.play('explosion1', 30, false, true);
        
        barco.vida -= 25;
        this.actualizarVidas();
        
        if (barco.vida <= 0) {

            let explosionFinal = this.explosiones.final.getFirstExists(false);
            explosionFinal.reset(barco.body.x, barco.body.y);
            explosionFinal.play('explosion', 30, false, true);

            barco.kill();

            this.comunicarHundimiento(barco);
        }
    }

    actualizarVidas() {
        this.marcador.vidaBismarck.text = 'Vida Bismark : ' + this.bismarck.vida + '%';
        this.marcador.vidaBismarck.visible = true;
        this.marcador.vidaHood.text = 'Vida Hood : ' + this.hood.vida + '%';
        this.marcador.vidaHood.visible = true;
    }

    comunicarHundimiento(barco) {
        let estadoPartida = this.marcador.estadoPartida;
        estadoPartida.text = " El " + barco.nombre + " ha sido hundido";
        estadoPartida.visible = true;
    }

    updateMovimientoJugador() {
        
        this.frenarBarcos();
        
        let movimiento = this.controles.movimiento;
        
        if (movimiento.left.isDown) {
            this.barcoJugador.angle = 180;
            this.barcoJugador.body.velocity.x = -100;

        } else if (movimiento.right.isDown) {
            this.barcoJugador.angle = 360;
            this.barcoJugador.body.velocity.x = 100;

        } else if (movimiento.up.isDown) {
            this.barcoJugador.angle = 270;
            this.barcoJugador.body.velocity.y = -100;

        } else if (movimiento.down.isDown) {
            this.barcoJugador.angle = 90;
            this.barcoJugador.body.velocity.y = 100;
        }
    }

    frenarBarcos() {
        this.bismarck.body.velocity.x = 0;
        this.bismarck.body.velocity.y = 0;

        this.hood.body.velocity.x = 0;
        this.hood.body.velocity.y = 0;
    }

    updateDisparos() {
        if (this.controles.fuegoFrontal.isDown) {
            this.barcoJugador.canionFrontal.fire();
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

    enviarPosicion() {
        let posiciones = {
            xBismarck: this.bismarck.position.x,
            yBismarck: this.bismarck.position.y,
            anguloBismarck: this.bismarck.angle,
            xHood: this.hood.position.x,
            yHood: this.hood.position.y,
            anguloHood: this.hood.angle
        };
    
        this.enviarPosiciones(posiciones);
    }

    enviarPosiciones(posiciones) {
        let json = JSON.stringify(posiciones);
        this.websocket.send(json);
    }
    
}