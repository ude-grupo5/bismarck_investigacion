
var lateral=new Phaser.Game(400, 450, Phaser.AUTO,document.getElementById("lateral"), { preload: preloadLateral, create: createLateral, update: updateLateral});


function preloadLateral()
{
	lateral.load.image('escenarioLateral', 'sprites/lateral.png');
	lateral.load.image('Bismark_Frente', 'sprites/Bismark/bismark_frontal.png');
}

function createLateral() 
{
    lateral.physics.startSystem(Phaser.Physics.ARCADE);
    lateral.add.sprite(0, 0, 'escenarioLateral'); 
}


function updateLateral ()
{

}

/*
var lateral=new Phaser.Game(400, 400, Phaser.AUTO, 'lateral', { preload: preloadLateral, create: createLateral, update: updateLateral});

function preloadLateral()
{
	lateral.load.image('escenarioLateral', 'sprites/lateral.png');
	lateral.load.image('Bismark_Frente', 'sprites/Bismark/bismark_frontal.png');
}

function createLateral()
{
    
    lateral.physics.startSystem(Phaser.Physics.ARCADE);
    lateral.add.sprite(0, 0, 'escenarioLateral'); 
    //juego.physics.startSystem(Phaser.Physics.ARCADE);
	//juego.world.setBounds(0, 0, 1920, 1200);
	//juego.add.sprite(0, 0, 'escenario'); 
    
	//lateral.stage.disableVisibilityChange = true;
	//Bismarcklateral = lateral.add.sprite(lateral.world.centerX, lateral.height-25, 'Bismark_Frente');
    //Bismarcklateral.anchor.setTo(0.5, 0.5);
	//Bismarcklateral.visible=true;
    
    
}


function updateLateral()
{
}*/