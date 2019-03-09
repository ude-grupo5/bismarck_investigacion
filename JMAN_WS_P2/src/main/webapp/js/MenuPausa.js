export default class MenuPausa {

    constructor(juego) {
        this._juego = juego;

        this._divMenu = document.getElementById('fondo_menu_pausa');

        this._agregarAccionesBotones();
    }

    // ########################################################################
    //      METODOS PUBLICOS
    // ########################################################################

    mostrar() {
        this._divMenu.style.display = 'block';
    }

    ocultar() {
        this._divMenu.style.display = 'none';
    }

    // ########################################################################
    //      METODOS PRIVADOS
    // ########################################################################

    _agregarAccionesBotones() {
        let botonGuardar = document.getElementById('boton_guardar');
        let botonSeguir = document.getElementById('boton_seguir');
        let botonSalir = document.getElementById('boton_salir');

        botonGuardar.addEventListener('click', ()=>{
            this._accionClickGuardar();
        });
        botonSeguir.addEventListener('click', ()=>{
            this._accionClickSeguir();
        });
        botonSalir.addEventListener('click', ()=>{
            this._accionClickSalir();
        });
    }

    _accionClickGuardar() {
        // TODO: accionClickGuardar
        console.log('TODO: accionClickGuardar');
    }

    _accionClickSeguir() {
        this.ocultar();
        this._juego.paused = false;
    }

    _accionClickSalir() {
        // TODO: accionClickSalir
        console.log('TODO: accionClickSalir');
    }

}