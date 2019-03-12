import Partida from "./Partida.js";
import VistaLateral from "./VistaLateral.js";

let juegoPrincipal = new Phaser.Game(800, 600, Phaser.AUTO,'juego');
let juegoLateral = new Phaser.Game(450, 450, Phaser.AUTO,'lateral');

let vistaLateral = new VistaLateral(juegoLateral);
let partida = new Partida(juegoPrincipal, vistaLateral);

juegoPrincipal.state.add('JuegoPrincipal', partida);
juegoPrincipal.state.start('JuegoPrincipal');

juegoLateral.state.add('JuegoLateral', vistaLateral);
juegoLateral.state.start('JuegoLateral');

