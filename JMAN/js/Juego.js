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


JuegoPrincipal.preload = function() {
    juego.load.image('escenario','sprites/escenario.png');
    juego.load.spritesheet('barco','sprites/barco.png',51,55);
    juego.load.spritesheet('barco2','sprites/barco.png',51,55);
    juego.load.image('bala1','sprites/balaB.png');
    juego.load.image('bala2','sprites/balaH.png');
    juego.load.spritesheet('explosion', 'sprites/explosion.png', 128, 128);
    juego.load.spritesheet('explosion1', 'sprites/explosion1.png', 64, 64);
} 

JuegoPrincipal.create = function() {

    //Se crea el personaje, los enemigos, los sonidos, el fondo del game, etc
    
    juego.stage.disableVisibilityChange = true;
    juego.physics.startSystem(Phaser.Physics.ARCADE);
    juego.add.sprite(0, 0, 'escenario'); 

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
    Bismarck = juego.add.sprite(51, juego.world.height - 200,'barco');
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
    //carga bala Bismarck
    balaBismarck = juego.add.weapon(1, 'bala1');	
    juego.physics.arcade.enable(balaBismarck);
    balaBismarck.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
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
        Hood.body.velocity.x = 0;
        Hood.body.velocity.y = 0;
        
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


        /**/
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