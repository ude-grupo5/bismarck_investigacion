import Partida from "./Partida.js";

var juego = new Phaser.Game(800, 600, Phaser.AUTO,'juego');
juego.state.add('JuegoPrincipal', new Partida(juego));
juego.state.start('JuegoPrincipal');

/*var juego = new Phaser.Game(800, 600, Phaser.AUTO,'juego');
juego.state.add('JuegoPrincipal',JuegoPrincipal);
juego.state.start('JuegoPrincipal');*/