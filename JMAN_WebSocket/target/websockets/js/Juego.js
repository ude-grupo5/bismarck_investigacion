var JuegoPrincipal = {};
/*
JuegoPrincipal.init = function(){
    juego.stage.disableVisibilityChange = true;
};
*/
//var game = new Phaser.Game(745, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update });

//var lateral=new Phaser.Game(300, 600, Phaser.AUTO, 'lateral', { preload: preloadLateral, create: createLateral, update: updateLateral});

    
var Bismarcklateral;

//Declaracion de variables desde arriba
    var barcoJugador;
    var barcoEnemigo;
    var Bismarck;
    var Hood;
    var balaBismarck;
	var fuegoBismarck;
    var balaHood;
    var fuegoHood;
    var controles;
    var izqHood;
	var derHood;
	var arribaHood;
    var abajoHood;
    var explosionFinal;
    var explosiones;
    var mostrarVidaB = '';
    var mostrarVidaH = '';
    var vidaBismarck = 100;
    var vidaHood = 100;
    var estado;
	/*-------------------------------------*/
	var mapa;
    var capa;
    var mapaData;
    var mapaData2;
	var capaNieblaBismarck;
    var capaNieblaHood;
    var nieblaSprite;
    var franja;
    var fondo;
    var vision;
	/*-------------------------------------*/
	var websocket;


JuegoPrincipal.preload = function() {
    juego.load.image('escenario','sprites/escenario.png');
    juego.load.tilemap('map', 'sprites/Tile/Mapa.csv', null, Phaser.Tilemap.CSV);
    juego.load.image('tiles', 'sprites/Tile/forest_tiles.png');
	juego.load.spritesheet('barco','sprites/barco.png',51,55);
    juego.load.spritesheet('barco2','sprites/barco.png',51,55);
    juego.load.image('bala1','sprites/balaB.png');
    juego.load.image('bala2','sprites/balaH.png');
    juego.load.spritesheet('explosion', 'sprites/explosion.png', 128, 128);
    juego.load.spritesheet('explosion1', 'sprites/explosion1.png', 64, 64);
    juego.load.spritesheet('explosionA', 'sprites/ExplosionAgua.png', 64, 64);

    conectarWebsocket();
} 

JuegoPrincipal.create = function() {

    //Se crea el personaje, los enemigos, los sonidos, el fondo del game, etc

    //agregar fisica
	juego.physics.startSystem(Phaser.Physics.ARCADE);
	juego.world.setBounds(0, 0, 1920, 1200);
	juego.add.sprite(0, 0, 'escenario'); 
    
	//se agrega el fondo. 
	mapa = juego.add.tilemap('map', 32, 32);
	mapa.addTilesetImage('tiles');
	capa = mapa.createLayer(0);
	capa.resizeWorld();
	mapa.setCollisionBetween(0, 44);

    //Niebla Bismarck
	capaNieblaBismarck = new Phaser.Circle(200, 400, 500);
    franja = 50;
    mapaData = juego.make.bitmapData(800, 600);
    actualizarNieblaBismarck();
    nieblaSprite = mapaData.addToWorld();
    nieblaSprite.fixedToCamera = true;
	
    //Niebla Hood
	/*capaNieblaHood = new Phaser.Circle(200, 400, 500);
    franja = 40;
    mapaData2 = juego.make.bitmapData(800, 600);
    actualizarNieblaHood();
    nieblaSprite = mapaData2.addToWorld();
    nieblaSprite.fixedToCamera = true;*/
	
    
	/*-------------------------------------------------------------------------------------------------------------------*/
    //Mostrar vidas 
    mostrarVidaB = 'Vida Bismarck : ';
    mostrarVidaB = juego.add.text(10, 10, mostrarVidaB + vidaBismarck + "%", { font: '20px Arial', fill: '#fff' });
    
    mostrarVidaH = 'Vida Hood : ';
    mostrarVidaH = juego.add.text(10, 40, mostrarVidaH + vidaHood + "%", { font: '20px Arial', fill: '#fff' });
    
    
    //  Estado del game
    estado = juego.add.text(juego.world.centerX,juego.world.centerY,' ', { font: '45px Arial', fill: '#fff' });
    estado.anchor.setTo(0.5, 0.5);
    estado.visible = false;
    /*-------------------------------------------------------------------------------------------------------------------*/
    
    //Carga del barco Bismarck
    Bismarck = juego.add.sprite(2400, juego.world.height - 200,'barco');
    Bismarck.scale.setTo(0.5,0.5);
    Bismarck.anchor.setTo(0.5,0.5);
    Bismarck.angle = 180;
    juego.physics.arcade.enable(Bismarck);
    Bismarck.body.inmovable = true;
    Bismarck.enablebody = true;
    Bismarck.body.collideWorldBounds = true;
    Bismarck.nombre = "Bismarck";
    
	
    //Carga del barco Hood
    Hood = juego.add.sprite(450, juego.world.height - 200,'barco2');
    Hood.scale.setTo(0.5,0.5);
    Hood.anchor.setTo(0.5,0.5);
    Hood.angle = 150;
    juego.physics.arcade.enable(Hood);
    Hood.body.inmovable = true;
    Hood.enablebody = true;
    Hood.body.collideWorldBounds = true;
    Hood.nombre = "Hood";

	// asoignar barcos
	asignarBarcos();
	
    //carga bala Bismarck
    balaBismarck = juego.add.weapon(1, 'bala1');	
    juego.physics.arcade.enable(balaBismarck);
    balaBismarck.bulletKillType = Phaser.Weapon.KILL_DISTANCE;
    balaBismarck.bulletKillDistance = 230;
    balaBismarck.bulletAngleOffset = 300;
    balaBismarck.bulletSpeed = 500;
    balaBismarck.trackSprite(Bismarck, 0, 0, true);

	
	
    //carga bala Hood
    balaHood = juego.add.weapon(1, 'bala2');	
    juego.physics.arcade.enable(balaHood);
    balaHood.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
    balaHood.bulletAngleOffset =240;
    balaHood.bulletSpeed = 300;
    balaHood.trackSprite(Hood, 0, 0, true);

    
    //  Explosiones
    explosionFinal = juego.add.group();
    explosionFinal.createMultiple(30, 'explosion');
    explosionFinal.forEach(setExplosionFinal, this);


    explosiones = juego.add.group();
    explosiones.createMultiple(30, 'explosion1');
    explosiones.forEach(setExplosiones, this);

    
    //controles
    controles = juego.input.keyboard.createCursorKeys();
    fuegoBismarck = juego.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
    derHood = juego.input.keyboard.addKey(Phaser.Keyboard.D);
    izqHood = juego.input.keyboard.addKey(Phaser.Keyboard.A);
    arribaHood = juego.input.keyboard.addKey(Phaser.Keyboard.W);
    abajoHood = juego.input.keyboard.addKey(Phaser.Keyboard.S);
    fuegoHood = juego.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
        
    //Camara
    juego.camera.follow(barcoJugador,Phaser.Camera.FOLLOW_PLATFORMER);
    //juego.camera.follow(Hood,Phaser.Camera.FOLLOW_PLATFORMER);
    juego.minimap = juego.cameras.add(200, 10, 400, 100).setZoom(0.2).setName('mini');
    juego.minimap.setBackgroundColor(0x002244);
    juego.minimap.scrollX = 1600;
    juego.minimap.scrollY = 300;


}

JuegoPrincipal.update = function() {
        //Logica del game como los movimientos, las colisiones, el movimiento del personaje, etc
                    
        //juego.physics.arcade.overlap(balaBismarck.bullets, Hood, disparoBismarck, null, this);
        //juego.physics.arcade.overlap(balaHood.bullets, Bismarck, disparoHood, null, this);

        juego.physics.arcade.collide(balaBismarck.bullets, Hood, disparoBismarck); 
        juego.physics.arcade.collide(balaHood.bullets, Bismarck, disparoHood); 

        //Con esto se genera que los barcos colisionen
        juego.physics.arcade.collide(Bismarck,Hood);
        juego.physics.arcade.collide(Hood,Bismarck);
        
        
        Bismarck.body.velocity.x = 0;
        Bismarck.body.velocity.y = 0;  
        capaNieblaBismarck.x = Bismarck.x;
        capaNieblaBismarck.y = Bismarck.y;

    
        Hood.body.velocity.x = 0;
        Hood.body.velocity.y = 0;
        //capaNieblaHood.x = Hood.x;
        //capaNieblaHood.y = Hood.y;

    
        if (controles.left.isDown) {
            barcoJugador.angle = 180;                       
            barcoJugador.body.velocity.x = -100;
            
        }
        else if (controles.right.isDown) {
            barcoJugador.angle = 360;
            barcoJugador.body.velocity.x = 100;

        }
        else if (controles.up.isDown) {
            barcoJugador.angle = 270;
            barcoJugador.body.velocity.y = -100;

        }
        else if (controles.down.isDown) {
            barcoJugador.angle = 90;					
            barcoJugador.body.velocity.y = 100;				
        }

        enviarPosicion();
        //procesarMovimiento();

        if (fuegoBismarck.isDown){
            balaBismarck.fire();
        }

        if (fuegoHood.isDown){
            balaHood.fire();
        }
    
    actualizarNieblaBismarck();
    //actualizarNieblaHood();

    
}

function asignarBarcos() {
    let barcoElegido = obtenerBarcoURL();
    if (barcoElegido == "Bismarck") {
        barcoJugador = Bismarck;
        barcoEnemigo = Hood;
    } else if (barcoElegido == "Hood") {
        barcoJugador = Hood;
        barcoEnemigo = Bismarck;
    }
}

function setExplosiones (entrada) {

    entrada.anchor.x = 0.5;
    entrada.anchor.y = 0.5;
    entrada.animations.add('explosion1');

}

function setExplosionFinal (entrada) {

    entrada.anchor.x = 0.5;
    entrada.anchor.y = 0.5;
    entrada.animations.add('explosion');

}

function setExplosionAgua (entrada) {

    entrada.anchor.x = 0.5;
    entrada.anchor.y = 0.5;
    entrada.animations.add('explosionA');

}

function disparoHood(enemigo,bala) {
    bala.kill();
        
    var explota = explosiones.getFirstExists(false);
    explota.reset(Bismarck.body.x, Bismarck.body.y);
    explota.play('explosion1', 30, false, true);
    
    vidaBismarck = vidaBismarck - 25;
    console.log(vidaBismarck);
    mostrarVidaB.text = 'Vida Bismark : ' + vidaBismarck + '%';
    mostrarVidaB.visible = true;
    
    if(vidaBismarck <= 0){
        var explotaFin = explosionFinal.getFirstExists(false);
        explotaFin.reset(Bismarck.body.x, Bismarck.body.y);
        explotaFin.play('explosion', 30, false, true);
        Bismarck.kill();
        bala.kill();
        estado.text = " El BISMARK ha sido hundido";
        estado.visible = true;   
    }
}

function disparoBismarck (enemigo,bala) {
    bala.kill();
        
        var explota = explosiones.getFirstExists(false);
        explota.reset(Hood.body.x, Hood.body.y);
        explota.play('explosion1', 30, false, true);
        
        vidaHood = vidaHood - 25;
        console.log(vidaHood);
        mostrarVidaH.text = 'Vida Hood : ' + vidaHood + '%';
        mostrarVidaH.visible = true;
        
    if(vidaHood <= 0){
        var explotaFin = explosionFinal.getFirstExists(false);
        explotaFin.reset(Hood.body.x, Hood.body.y);
        explotaFin.play('explosion', 30, false, true);
        Hood.kill();
        bala.kill();
        estado.text = " El HOOD ha sido hundido";
        estado.visible = true;   
    }
}

function actualizarNieblaBismarck ()
{  
    var gradient = mapaData.context.createRadialGradient(
        capaNieblaBismarck.x - juego.camera.x,
        capaNieblaBismarck.y - juego.camera.y,
        capaNieblaBismarck.radius,
        capaNieblaBismarck.x - juego.camera.x,
        capaNieblaBismarck.y - juego.camera.y,
        capaNieblaBismarck.radius - franja
    );

    gradient.addColorStop(0, 'rgba(0,0,0,0.8');
    gradient.addColorStop(0.4, 'rgba(0,0,0,0.5');
    gradient.addColorStop(1, 'rgba(0,0,0,0');

    mapaData.clear();
    mapaData.context.fillStyle = gradient;
    mapaData.context.fillRect(0, 0, 800, 600);
}
/*
function actualizarNieblaHood ()
{  
    var gradient = mapaData.context.createRadialGradient(
        capaNieblaHood.x - juego.camera.x,
        capaNieblaHood.y - juego.camera.y,
        capaNieblaHood.radius,
        capaNieblaHood.x - juego.camera.x,
        capaNieblaHood.y - juego.camera.y,
        capaNieblaHood.radius - franja
    );

    gradient.addColorStop(0, 'rgba(0,0,0,0.8');
    gradient.addColorStop(0.4, 'rgba(0,0,0,0.5');
    gradient.addColorStop(1, 'rgba(0,0,0,0');

    mapaData.clear();
    mapaData.context.fillStyle = gradient;
    mapaData.context.fillRect(0, 0, 800, 600);
}
*/

function preloadLateral()
{
	lateral.load.image('escenarioLateral', 'sprites/lateral.png');
	lateral.load.image('Bismark_Frente', 'sprites/Bismark/bismark_frontal.png');
}

function createLateral()
{
    
    //lateral.physics.startSystem(Phaser.Physics.ARCADE);
    //lateral.add.sprite(, 0, 'escenarioLateral'); 
	//lateral.stage.disableVisibilityChange = true;
	//Bismarcklateral = lateral.add.sprite(lateral.world.centerX, lateral.height-25, 'Bismark_Frente');
    //Bismarcklateral.anchor.setTo(0.5, 0.5);
	//Bismarcklateral.visible=true;
    
    
}


function updateLateral()
{
}


/************************************************************************************************
    WEBSCOKET
 ************************************************************************************************/

function conectarWebsocket() {
    var host = document.location.host;
    var pathname = document.location.pathname;

    //websocket = new WebSocket("ws://" +host  + pathname + "partida/");
    websocket = new WebSocket("ws://" +host  + "/websockets/partida/");

    websocket.onmessage = function(event) {
        //console.log(event.data);
        var posiciones = JSON.parse(event.data);
        //aplicarMovimiento(movimiento);
        actualizarPosicionEnemigo(posiciones);
    };
}

function actualizarPosicionEnemigo(posiciones) {

    if (barcoEnemigo.nombre == "Hood") {
        //console.log("entra hood");
        Hood.position.x = posiciones.xHood;
        Hood.position.y = posiciones.yHood;
        Hood.angle = posiciones.anguloHood;
    } else if (barcoEnemigo.nombre == "Bismarck") {
        //console.log("entra bismarck");
        Bismarck.position.x = posiciones.xBismarck;
        Bismarck.position.y = posiciones.yBismarck;
        Bismarck.angle = posiciones.anguloBismarck;
    }
}

function aplicarMovimiento(movimiento) {

    let barco;

    if (movimiento.barco == "Bismarck") {
        barco = Bismarck;
    } else if (movimiento.barco == "Hood") {
        barco = Hood;
    }

    if (movimiento.izquierda) {
        barco.angle = 180;
        barco.position.x += -10;

    }
    else if (movimiento.derecha) {
        barco.angle = 360;
        barco.position.x += 10;

    }
    else if (movimiento.arriba) {
        barco.angle = 270;
        barco.position.y += -10;

    }
    else if (movimiento.abajo) {
        barco.angle = 90;
        barco.position.y += 10;
    }
}

function enviarPosicion() {
    let posiciones = {
        xBismarck: Bismarck.position.x,
        yBismarck: Bismarck.position.y,
        anguloBismarck: Bismarck.angle,
        xHood: Hood.position.x,
        yHood: Hood.position.y,
        anguloHood: Hood.angle
    };

    enviarPosiciones(posiciones);
}



function enviarPosiciones(posiciones) {
    let json = JSON.stringify(posiciones);
    websocket.send(json);
}
/*
function procesarMovimiento() {

    let hayMovimiento = false;
    let movimiento = {
        barco: "",
        arriba: false,
        abajo: false,
        derecha: false,
        izquierda: false
    };

    if (controles.left.isDown) {
        movimiento.barco = "Bismarck";
        movimiento.izquierda = true;
        hayMovimiento = true;
    }
    else if (controles.right.isDown) {
        movimiento.barco = "Bismarck";
        movimiento.derecha = true;
        hayMovimiento = true;
    }
    else if (controles.up.isDown) {
        movimiento.barco = "Bismarck";
        movimiento.arriba = true;
        hayMovimiento = true;
    }
    else if (controles.down.isDown) {
        movimiento.barco = "Bismarck";
        movimiento.abajo = true;
        hayMovimiento = true;
    } else if (izqHood.isDown) {
        movimiento.barco = "Hood";
        movimiento.izquierda = true;
        hayMovimiento = true;
    }
    else if (derHood.isDown) {
        movimiento.barco = "Hood";
        movimiento.derecha = true;
        hayMovimiento = true;
    }
    else if (arribaHood.isDown) {
        movimiento.barco = "Hood";
        movimiento.arriba = true;
        hayMovimiento = true;
    }
    else if (abajoHood.isDown) {
        movimiento.barco = "Hood";
        movimiento.abajo = true;
        hayMovimiento = true;
    }

    if (hayMovimiento) {
        enviarMovimiento(movimiento);
    }
}

function enviarMovimiento(movimiento) {
    var json = JSON.stringify(movimiento);
    websocket.send(json);
}
*/
function obtenerBarcoURL() {
    let url_string = window.location.href;
    let url = new URL(url_string);
    let barco = url.searchParams.get("barco");
    return barco;
}