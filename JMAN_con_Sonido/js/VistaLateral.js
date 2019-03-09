import EstadoPartida from './EstadoPartida.js';

export default class VistaLateral {

  /**
     * Constructor
     * @param {Phaser.Game} juego El juego principal
     */
    constructor(lateral) {

        this.lateral = lateral;

        // barcos
        this.barcoJugador = null;
        this.barcoEnemigo = null;
        this.bismarck = null;
        this.hood = null;

        // animaciones
        this.explosiones = null;


    }

    /*************************************************************************
     * FUCIONES ESTANDAR DE PHASER
     *************************************************************************/

    preload() {
        this.cargarImagenes();

    }

    create() {
        this.deshabilitarPerdidaFoco();
        this.crearFondo();
        this.crearBarcos();  
    }

    update() {	
        /*
        EL angulo es para la vision del barco enemigo (8 angulos)
        El escalado es para mostrar mas cerca o mas lejos el barco (mostrar distancia)
        */                
    }

    /*************************************************************************
     * FUNCIONES AUXILIARES PRELOAD
     *************************************************************************/

    cargarImagenes() {
        this.lateral.load.image('escenarioLateral', 'sprites/lateral.png');
    	this.lateral.load.image('Bismark_lateral', 'sprites/Modelo_Bismarck_Lateral.png');
    }

    /*************************************************************************
     * FUNCIONES AUXILIARES CREATE
     *************************************************************************/

    deshabilitarPerdidaFoco() {
        this.lateral.stage.disableVisibilityChange = true;
    }

    crearFondo() {
        this.lateral.add.sprite(0, 0, 'escenarioLateral');
    }

    crearBarcos() {
        // bismarck
        let barco = this.lateral.add.sprite(this.lateral.world.centerX, this.lateral.height-50,'Bismark_lateral');
        barco.scale.setTo(1.0,1.0);

    }


    /*************************************************************************
     * FUCIONES AUXILIARES UPDATE
     *************************************************************************/
  
}