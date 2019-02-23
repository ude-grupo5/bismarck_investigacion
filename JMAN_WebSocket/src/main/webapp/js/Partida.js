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

        this.actualizarVidasMarcador();
    }

    update() {
        //Logica del game como los movimientos, las colisiones, el movimiento del personaje, etc
        this.updateColisiones();
        this.updateMovimientoJugador();
        this.updateDisparos();
        this.updateNiebla();
        this.enviarEstadoPartida();
        this.actualizarVidasMarcador();
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
        //this.juego.load.spritesheet('barco','sprites/barco.png',51,55);
        this.juego.load.spritesheet('bismarck','sprites/Modelo_bismarck.png');
        //this.juego.load.spritesheet('barco2','sprites/barco.png',51,55);
        this.juego.load.spritesheet('hood','sprites/Modelo_hood.png');
        this.juego.load.spritesheet('explosion', 'sprites/explosion.png', 128, 128);
        this.juego.load.spritesheet('explosion1', 'sprites/explosion1.png', 64, 64);
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
            this.partida.actualizarEstadoPartida(estadoPartida);
        };
    }

    actualizarEstadoPartida(estadoPartida) {
        console.log(this.barcoEnemigo);
        if (estadoPartida.sender == this.barcoEnemigo.nombre) {
            if (this.barcoEnemigo.nombre == "Hood") {
                //console.log("entra hood");
                this.hood.position.x = estadoPartida.xHood;
                this.hood.position.y = estadoPartida.yHood;
                this.hood.angle = estadoPartida.anguloHood;
                if (estadoPartida.impactadoBismarck) {
                    this.bismarck.vida -= 25;
                }
            } else if (this.barcoEnemigo.nombre == "Bismarck") {
                //console.log("entra bismarck");
                this.bismarck.position.x = estadoPartida.xBismarck;
                this.bismarck.position.y = estadoPartida.yBismarck;
                this.bismarck.angle = estadoPartida.anguloBismarck;
                if (estadoPartida.impactadoHood) {
                    this.hood.vida -= 25;
                }
            }
        }
        if (estadoPartida.fuegoHood) {
            this.hood.canionFrontal.fire();
        }
        if (estadoPartida.fuegoBismarck) {
            this.bismarck.canionFrontal.fire();
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
		
        this.bismarck.body.inmovable = true;
        this.bismarck.enablebody = true;
        this.bismarck.body.collideWorldBounds = true;
        this.bismarck.nombre = "Bismarck";
        this.bismarck.vida = 100;
        this.bismarck.velocidadMaxima = 100;
        this.bismarck.velocidadActual = 0;
        
        // hood
        this.hood = this.juego.add.sprite(450, this.juego.world.height - 200,'hood');
        this.hood.scale.setTo(0.2,0.2);
        this.hood.anchor.setTo(0.5,0.5);
        this.hood.angle = 150;
        
        this.juego.physics.arcade.enable(this.hood);
		
        this.hood.body.inmovable = true;
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
        let fuegoFrontal = this.juego.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);

        this.controles = {
            movimiento: movimiento,
            fuegoFrontal: fuegoFrontal
        }
    }

    crearCamaras() {
        this.juego.camera.follow(this.barcoJugador,Phaser.Camera.FOLLOW_PLATFORMER);
    }

    /*************************************************************************
     * FUCIONES AUXILIARES UPDATE
     *************************************************************************/
    
    updateColisiones() {
        let arcade = this.juego.physics.arcade;
        let balasBismarck = this.bismarck.canionFrontal.bullets;
        let balasHood = this.hood.canionFrontal.bullets;

        this.resetearImpactos();

        // colision balas
        arcade.collide(this.hood, balasBismarck, this.impactoBala, function(){return true;}, this);
        arcade.collide(this.bismarck, balasHood, this.impactoBala, function(){return true;}, this);

        // colision entre barcos
        arcade.collide(this.bismarck, this.hood);
        arcade.collide(this.hood, this.bismarck);
    }

    resetearImpactos() {
        this.hood.impactado = false;
        this.bismarck.impactado = false;
    }
    
    impactoBala(barco, bala) {
        bala.kill();
            
        let explosionImpacto = this.explosiones.impacto.getFirstExists(false);
        explosionImpacto.reset(barco.body.x, barco.body.y);
        explosionImpacto.play('explosion1', 30, false, true);
        
        //barco.vida -= 25;
        barco.impactado = true;
        
        if (barco.vida <= 0) {
            let explosionFinal = this.explosiones.final.getFirstExists(false);
            explosionFinal.reset(barco.body.x, barco.body.y);
            explosionFinal.play('explosion', 30, false, true);

            barco.kill();

            this.comunicarHundimiento(barco);
        }
    }

    actualizarVidasMarcador() {
        let vidaBismarck = this.bismarck.vida;
        this.marcador.vidaBismarck.animations.play(vidaBismarck, 2, true);

        let vidaHood = this.hood.vida;
        this.marcador.vidaHood.animations.play(vidaHood, 2, true);
    }

    comunicarHundimiento(barco) {
        let estadoPartida = this.marcador.estadoPartida;
        estadoPartida.text = " El " + barco.nombre + " ha sido hundido";
        estadoPartida.visible = true;
    }

    updateMovimientoJugador() {
        let movimiento = this.controles.movimiento;
        let velocidadMaxima = this.barcoJugador.velocidadMaxima;
        let velocidadAnterior = this.barcoJugador.velocidadActual;
        
        if (movimiento.up.isDown) {
            if (velocidadAnterior < velocidadMaxima) {
                this.barcoJugador.velocidadActual += 1;
            }
        } else if (movimiento.down.isDown) {
            if (velocidadAnterior > (velocidadMaxima * -1)) {
                this.barcoJugador.velocidadActual -= 1;
            }
        } else if (velocidadAnterior > 0) {
            this.barcoJugador.velocidadActual -= 0.5;
        } else if (velocidadAnterior < 0) {
            this.barcoJugador.velocidadActual += 0.5;
        }

        if (this.barcoJugador.velocidadActual != 0) {
            this.updateRotacion();
            this.juego.physics.arcade.velocityFromRotation(this.barcoJugador.rotation, this.barcoJugador.velocidadActual, this.barcoJugador.body.velocity);
        } else {
            this.barcoJugador.body.velocity.x = 0;
            this.barcoJugador.body.velocity.y = 0;
        }
    }

    updateRotacion() {
        let movimiento = this.controles.movimiento;
        if (movimiento.left.isDown) {
            this.barcoJugador.angle -= 0.5;
        } else if (movimiento.right.isDown) {
            this.barcoJugador.angle += 0.5;
        }
    }

    updateDisparos() {
        if (this.controles.fuegoFrontal.isDown) {
            //this.barcoJugador.canionFrontal.fire();
            this.barcoJugador.fuego = true;
        } else {
            this.barcoJugador.fuego = false;
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
        let estadoPartida = {
            sender: this.barcoJugador.nombre,
            xBismarck: this.bismarck.position.x,
            yBismarck: this.bismarck.position.y,
            anguloBismarck: this.bismarck.angle,
            fuegoBismarck: this.bismarck.fuego,
            impactadoBismarck: this.bismarck.impactado,
            xHood: this.hood.position.x,
            yHood: this.hood.position.y,
            anguloHood: this.hood.angle,
            fuegoHood: this.hood.fuego,
            impactadoHood: this.hood.impactado
        };
    
        this.enviarJSON(estadoPartida);
    }

    enviarJSON(objeto) {
        let json = JSON.stringify(objeto);
        this.websocket.send(json);
    }
    
}