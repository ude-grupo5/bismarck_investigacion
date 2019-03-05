export default class Geometria {

    static anguloEntrePuntos(puntoA, puntoB) {
        let adyacente = puntoA.y - puntoB.y;
        let opuesto = puntoB.x - puntoA.x;
        let anguloGrados = 90;
        let compensacion = 0;
        let anguloCompensado;

        if (adyacente != 0) {
            let anguloRadianes = Math.atan(opuesto / adyacente);
            anguloGrados = Geometria.radianesAGrados(anguloRadianes);
        }
        
        if (adyacente < 0 ||( adyacente = 0 && opuesto < 0 ) )  {
            compensacion = 180;
        }

        anguloCompensado = (anguloGrados + compensacion + 360) % 360;

        return anguloCompensado;

    }

    static obtenerPunto(puntoPartida, distancia, anguloGrados) {
        let anguloRadianes = Geometria.gradosARadianes(anguloGrados);
        let adyacente = Math.cos(anguloRadianes) * distancia;
        let opuesto = Math.sin(anguloRadianes) * distancia;

        let punto = {
            x: puntoPartida.x + opuesto,
            y: puntoPartida.y - adyacente
        };

        return punto;
    }

    static radianesAGrados(radianes) {
        return radianes * (180 / Math.PI);
    }

    static gradosARadianes(grados) {
        return grados / (180 / Math.PI);
    }

    /*
    static probarAngulos() {
        let puntoA = { x: 20, y:20};
        let puntoB = { x: 0, y: 0};
        let xB = 0;
        let yB = 0;
        let angulo = 0;
        for (xB=0; xB <= 40; xB+=10) {
            puntoB.x = xB;
            puntoB.y = yB;
            angulo = Geometria.anguloEntrePuntos(puntoA, puntoB);
            console.log('x: ' + xB + ' y: ' + yB + ' angulo: ' + angulo);
        }
        xB = 40;
        for (yB = 0; yB <= 40; yB += 10) {
            puntoB.x = xB;
            puntoB.y = yB;
            angulo = Geometria.anguloEntrePuntos(puntoA, puntoB);
            console.log('x: ' + xB + ' y: ' + yB + ' angulo: ' + angulo);
        }
        yB = 40;
        for (xB=40; xB >= 0; xB-=10) {
            puntoB.x = xB;
            puntoB.y = yB;
            angulo = Geometria.anguloEntrePuntos(puntoA, puntoB);
            console.log('x: ' + xB + ' y: ' + yB + ' angulo: ' + angulo);
        }
        xB = 0;
        for (yB = 40; yB >= 0; yB -= 10) {
            puntoB.x = xB;
            puntoB.y = yB;
            angulo = Geometria.anguloEntrePuntos(puntoA, puntoB);
            console.log('x: ' + xB + ' y: ' + yB + ' angulo: ' + angulo);
        }
    }*/
}