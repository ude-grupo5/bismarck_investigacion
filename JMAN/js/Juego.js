
var juego = new Phaser.Game(800, 600, Phaser.AUTO,document.getElementById("juego"), { preload: preload, create: create, update: update });

var Bismarck;
var balaBismarck
    
var Hood;
var balaHood;

var explosionFinal;
var explosion;

var vidaBismarck = 100;
var vidaHood = 100;
var estadoB;
var estadoH;


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


    function preload () {
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
    juego.load.spritesheet('vidaHood', 'sprites/Vida_Hood.png',302, 60);
    juego.load.spritesheet('vidaBismarck', 'sprites/Vida_Bismarck.png',302, 60);
} 

function create() {

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
	
    
    //Cargando imagen de Estado 
    SetEstadoVidas();    
    //Cargando barcos
    SetCargaBarcos();
    //Cargando balas de los barcos
    SetCargaBalas();  
    //Cargando  Explosiones
    SetCargaExplosiones();
    //Cargando controles
    SetControles();
    
    //Camara
    juego.camera.follow(Bismarck,Phaser.Camera.FOLLOW_PLATFORMER);
    //juego.camera.follow(Hood,Phaser.Camera.FOLLOW_PLATFORMER);
    
}

function update () {
        //Logica del game como los movimientos, las colisiones, el movimiento del personaje, etc
        
        SetColisiones();
        
        Bismarck.body.velocity.x = 0;
        Bismarck.body.velocity.y = 0;  
        capaNieblaBismarck.x = Bismarck.x;
        capaNieblaBismarck.y = Bismarck.y;

    
        Hood.body.velocity.x = 0;
        Hood.body.velocity.y = 0;
        //capaNieblaHood.x = Hood.x;
        //capaNieblaHood.y = Hood.y;

        MostrarVidaHood();
        MostrarVidaBismarck();
        SetControles();
        actualizarNieblaBismarck();
        //actualizarNieblaHood();    
}

/*      FUNCIONES AUXILIARES    */

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
    
    if(vidaBismarck <= 0){
        var explotaFin = explosionFinal.getFirstExists(false);
        explotaFin.reset(Bismarck.body.x, Bismarck.body.y);
        explotaFin.play('explosion', 30, false, true);
        Bismarck.kill();
        bala.kill();
        estadoB.visible = true;   
    }
}

function disparoBismarck (enemigo,bala) {
    bala.kill();
        
    var explota = explosiones.getFirstExists(false);
    explota.reset(Hood.body.x, Hood.body.y);
    explota.play('explosion1', 30, false, true);
        
    vidaHood = vidaHood - 25;

    if(vidaHood <= 0){
        var explotaFin = explosionFinal.getFirstExists(false);
        explotaFin.reset(Hood.body.x, Hood.body.y);
        explotaFin.play('explosion', 30, false, true);
        Hood.kill();
        bala.kill();
        estadoH.visible = true;   
    }
}

function MostrarVidaHood(){
    switch (vidaHood) {
      case 100:
            estadoH.animations.play('100', 2, true);
        break;
      case 75:
            estadoH.animations.play('75', 2, true);  	
        break;
      case 50:
            estadoH.animations.play('50', 2, true); 	
        break;
      case 25:
            estadoH.animations.play('25', 2, true); 	
      break;
      case 0:
            estadoH.animations.play('0', 2, true);
      break;  
      }
}

function MostrarVidaBismarck(){
    switch (vidaBismarck) {
      case 100:
            estadoB.animations.play('100', 2, true);
        break;
      case 75:
            estadoB.animations.play('75', 2, true);  	
        break;
      case 50:
            estadoB.animations.play('50', 2, true); 	
        break;
      case 25:
            estadoB.animations.play('25', 2, true); 	
      break;
      case 0:
            estadoB.animations.play('0', 2, true);
      break;  
      }
}

function SetEstadoVidas(){

    estadoH = juego.add.sprite(10, 60, 'vidaHood');
    
    estadoH.animations.add ('100',[4]);
    estadoH.animations.add ('75',[3]);
    estadoH.animations.add ('50',[2]);
    estadoH.animations.add ('25',[1]);
    estadoH.animations.add ('0',[0]);

    estadoB = juego.add.sprite(10, 1, 'vidaBismarck');
    
    estadoB.animations.add ('100',[4]);
    estadoB.animations.add ('75',[3]);
    estadoB.animations.add ('50',[2]);
    estadoB.animations.add ('25',[1]);
    estadoB.animations.add ('0',[0]);

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
function SetCargaBarcos(){

    Bismarck = juego.add.sprite(240, juego.world.height - 200,'barco');
    Bismarck.scale.setTo(0.5,0.5);
    Bismarck.anchor.setTo(0.5,0.5);
    Bismarck.angle = 180;
    juego.physics.arcade.enable(Bismarck);
    Bismarck.body.inmovable = true;
    Bismarck.enablebody = true;
    Bismarck.body.collideWorldBounds = true;
    
	
    //Carga del barco Hood
    Hood = juego.add.sprite(450, juego.world.height - 200,'barco2');
    Hood.scale.setTo(0.5,0.5);
    Hood.anchor.setTo(0.5,0.5);
    Hood.angle = 150;
    juego.physics.arcade.enable(Hood);
    Hood.body.inmovable = true;
    Hood.enablebody = true;
    Hood.body.collideWorldBounds = true;

}

function SetCargaBalas(){
    
    //Bala Bismarck
    balaBismarck = juego.add.weapon(1, 'bala1');	
    juego.physics.arcade.enable(balaBismarck);
    balaBismarck.bulletKillType = Phaser.Weapon.KILL_DISTANCE;
    balaBismarck.bulletKillDistance = 230;
    balaBismarck.bulletAngleOffset = 300;
    balaBismarck.bulletSpeed = 500;
    balaBismarck.trackSprite(Bismarck, 0, 0, true);
    
        
    //Bala Hood
    balaHood = juego.add.weapon(1, 'bala2');	
    juego.physics.arcade.enable(balaHood);
    balaHood.bulletKillType = Phaser.Weapon.KILL_DISTANCE;
    balaHood.bulletKillDistance = 230;
    balaHood.bulletSpeed = 300;
    balaHood.trackSprite(Hood, 0, 0, true);
}

function SetCargaExplosiones(){
	
    explosionFinal = juego.add.group();
    explosionFinal.createMultiple(30, 'explosion');
    explosionFinal.forEach(setExplosionFinal, this);

    explosiones = juego.add.group();
    explosiones.createMultiple(30, 'explosion1');
    explosiones.forEach(setExplosiones, this);

}

function SetControles(){
    
    /*Controles BISMARCK */
    let controles = juego.input.keyboard.createCursorKeys();
    let fuegoBismarck = juego.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
    

    if (controles.left.isDown) {
        Bismarck.angle = 180;                       
        Bismarck.body.velocity.x = -100;
        
    }
    else if (controles.right.isDown) {
        Bismarck.angle = 360;
        Bismarck.body.velocity.x = 100;

    }
    else if (controles.up.isDown) {
        Bismarck.angle = 270;
        Bismarck.body.velocity.y = -100;

    }
    else if (controles.down.isDown) {
        Bismarck.angle = 90;					
        Bismarck.body.velocity.y = 100;				
    }

    /*Controles HOOD */
    let izqHood = juego.input.keyboard.addKey(Phaser.Keyboard.A);
	let derHood = juego.input.keyboard.addKey(Phaser.Keyboard.D);;
	let arribaHood = juego.input.keyboard.addKey(Phaser.Keyboard.W);
    let abajoHood = juego.input.keyboard.addKey(Phaser.Keyboard.S);
    let fuegoHood = juego.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
       
    if (izqHood.isDown) {
        Hood.angle = 180;                       
        Hood.body.velocity.x = -100;
        
    }
    else if (derHood.isDown) {
        Hood.angle = 360;
        Hood.body.velocity.x = 100;

    }
    else if (arribaHood.isDown) {
        Hood.angle = 270;
        Hood.body.velocity.y = -100;

    }
    else if (abajoHood.isDown) {
        Hood.angle = 90;					
        Hood.body.velocity.y = 100;				
    }

    if (fuegoBismarck.isDown){
        balaBismarck.fire();
    }

    if (fuegoHood.isDown){
        balaHood.fire();
    }
}

function SetColisiones(){

    //Colision de disparos
    juego.physics.arcade.collide(balaBismarck.bullets, Hood, disparoBismarck); 
    juego.physics.arcade.collide(balaHood.bullets, Bismarck, disparoHood); 

    //Colision de Bismarck con Hood
    juego.physics.arcade.collide(Bismarck,Hood);
    //Colision de Hood con Bismarck
    juego.physics.arcade.collide(Hood,Bismarck);
        
}
    
