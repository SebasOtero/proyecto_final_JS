/**
 *  CLASE CARRITO   -->   Representa al objeto carrito.
 *  
 *  Se encarga de manejar toda la funcionalidad del carrito, así mismo sabe cómo es su formato html y cómo interactuar con el localStorage.
 */

 class Carrito {
    constructor () {
        this.cosplays = [];
        this.cantidades = [];   // Arreglo paralelo con la cantidad de cada cosplay
        this.descuento = 0;     // Descuento porcentual
        this.total = 0;
        this.envio = 1000;
        this.codigoPostal = "";
    }

    guardarCarrito() {  // Guarda en local storage
        localStorage.removeItem("carrito");
        localStorage.setItem("carrito", JSON.stringify(this));
    }

    recuperarCarrito() {
        // Recupero del localStorage y lo parseo
        let carritoJSON = JSON.parse(localStorage.getItem("carrito"));

        // Para que recupere su estado como clase y no objeto
        Object.assign(this, carritoJSON);

        // Para que los cosplays recuperen su estado de clase y pueda acceder a sus métodos. No aplico el mismo método de arriba porque, de alguna manera, los cosplays quedan setteados de una manera que falla todo. Por lo cual, busco según id en el arreglo de cosplays global.
        for (let i = 0; i < this.cosplays.length; i++) {
            this.cosplays[i] = searchCosplayById(this.cosplays[i].id);
        }
    }

    getCantidad(cosplay) {      // Devuelve la cantidad de veces que hay un cosplay
        let indiceCosplay = this.cosplays.indexOf(cosplay);
        return this.cantidades[indiceCosplay];
    }

    getCantidadTotal() {        // Devuelve la cantidad total de items
        return this.cantidades.reduce( (ac, el) => ac + el, 0);
    }

    existeCosplay(cosplay) {    // Devuelve si un cosplay existe en el carrito
        return (this.cosplays.indexOf(cosplay) != -1)? true : false;
    }

    agregarCosplay(cosplay) {   // Agrega un cosplay al carrito
        let indiceCosplay = this.cosplays.indexOf(cosplay);

        if (indiceCosplay == -1) {  // Si no está en el carrito
            this.cosplays.push(cosplay);
            this.cantidades.push(1); 
        } else {    // Si ya existe en el carrito
            this.cantidades[indiceCosplay] += 1; // Aumento la cantidad
        }

        this.total += cosplay.calcularPrecio();    // Actualizo el precio total
    }

    eliminarCosplay(cosplay) {      // Elimina una vez la cantidad de un cosplay
        let indiceCosplay = this.cosplays.indexOf(cosplay);
        this.cantidades[indiceCosplay] -= 1; // Disminuyo la cantidad

        this.total -= cosplay.calcularPrecio();    // Actualizo el precio total
    }

    eliminarCosplayCompleto(cosplay) {      // Elimina todas las ocurrencias de un cosplay en el carrito
        let indiceCosplay = this.cosplays.indexOf(cosplay);
        let cantidadEnCarrito = this.cantidades[indiceCosplay];

        this.total -= cosplay.calcularPrecio() * cantidadEnCarrito; // Actualizo el precio total

        carrito.cosplays.splice(indiceCosplay, 1);
        carrito.cantidades.splice(indiceCosplay, 1);
    }

    // De momento, si el total es más de 7000, el envío es gratis, sino es lo que está setteado.
    // Nota: Si el total es superior a 7000 pero con el descuento queda menos, el envío sigue siendo gratis.
    costoEnvio () {    
        return (this.total >= 7000)? 0: this.envio;
    }

    calcularSubcosto(cosplay) {     // Calcula el costo de un cosplay la cantidad de veces que se haya seleccionado
        let indiceCosplay = this.cosplays.indexOf(cosplay);
        return this.cosplays[indiceCosplay].calcularPrecio()*this.cantidades[indiceCosplay];
    }

    calcularDescuento () {  // El descuento es sobre los productos, no incluye el envío
        return calcularDescuento(this.total, this.descuento);
    }

    calcularTotal () {      // Devuelve el total con el descuento aplicado y el costo de envío 
        let totalConEnvio = calcularPrecioConDescuento(this.total, this.descuento) + this.costoEnvio();
        return totalConEnvio;
    }

    borrarCarrito () {      // Elimina el contenido del carrito
        this.cosplays.splice(0, this.cosplays.length);
        this.cantidades.splice(0, this.cantidades.length);
        this.descuento = 0;
        this.codigoPostal = "";
        this.total = 0;
    }

    length () {         // Devuelve la cantidad de cosplays (sin repetir) que hay en el carrito
        return this.cosplays.length;
    }

    cosplayToHtml (cosplay) {       // Pasa de un objeto de la clase cosplay al formato que tiene que tener en el html del carrito
        let cosplayHtml = document.createElement("div");
        cosplayHtml.classList.add("header__carrito__offcanvas__producto");

        let precio = cosplay.oferta == 0 ? `$ ${cosplay.precio}` : `(<del>$ ${cosplay.precio}</del>) $ ${cosplay.calcularPrecio()}`
        let descuento = cosplay.oferta == 0 ? `` : `(${cosplay.oferta}% OFF)`;
        cosplayHtml.innerHTML = 
            `<div class="header__carrito__offcanvas__producto__imagen">
                <img src=${cosplay.imagen} alt="${cosplay.anime} - ${cosplay.personaje} - ${cosplay.tipo}">
            </div>

            <div class="header__carrito__offcanvas__producto__info" id=galeriaCarrito${cosplay.id}>
                <span>${cosplay.tipo.toUpperCase()} ${cosplay.personaje.toUpperCase()}</span>
                <span>${precio} ${descuento}</span>
                
                <div class="header__carrito__offcanvas__producto__info__cantidad mb-3">
                    <button class="btn btn-light carritoMenos" type="submit"><i class="fa fa-minus"></i></button>
                    <span class="carritoCantidad">${this.getCantidad(cosplay)}</span>
                    <button class="btn btn-light carritoMas" type="submit"><i class="fa fa-plus"></i></button>
                </div>

                <h6 class="stockAgotado"></h6>
            </div>

            <div class="header__carrito__offcanvas__producto__precio">$ ${this.calcularSubcosto(cosplay)} </div>

            <div>
                <button class="btn btn-danger header__carrito__offcanvas__producto__tachito" type="submit">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </div>`;

        return cosplayHtml;
    }

    footerToHtml () {       // Genera el footer del carrito en formato html
        let footerCarrito = document.createElement("div");
        footerCarrito.classList.add("header__carrito__offcanvas__footer");
        footerCarrito.innerHTML = 
            `<div class="row">
                <div class="fs-5 flex-column col-9">
                    <span>Subtotal (sin envío):</span>
                    <span>Envío (CP ${this.codigoPostal}): </span>
                    <span>Descuentos: </span>
                    <span class="fs-4">TOTAL: </span>
                </div>

                <div class="fs-5 flex-column col-3 p-0 px-md-2">
                    <div class>
                        <span>$</span> ${this.total}
                    </div>

                    <div><span>$</span> ${this.costoEnvio() || "Gratis!"}</div>

                    <div><span>$</span> ${this.calcularDescuento()}</div>

                    <div class="fs-4"><span>$</span> ${this.calcularTotal()}</div>

                </div>
            </div>
        
            <div class="fs-5 mt-5 flex-column row col-12 col-md-6">
                <h4 class="">CÓDIGO DE DESCUENTO</h4>
                <div class="input-group">
                    <input type="text" class="form-control" placeholder="Ingrese su código" id="codigoDescuento">
                    <button class="btn btn-dark text-white aplicarCodigo" type="submit">
                        <i class="fa-solid fa-paper-plane"></i>
                    </button>
                </div>
                <h6 class="cartelCodigoDescuento mt-2 ms-1"></h6>
            </div>

            <button class="btn btn-dark mt-4 me-2 iniciarCompra" type="submit">INICIAR COMPRA</button>`;

        return footerCarrito;
    }
}