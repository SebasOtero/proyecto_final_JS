/**
 *  CLASE COSPLAY   -->   Representa al objeto cosplay.
 *  
 *  Sabe cómo mostrarse por html, cómo calcular su precio, generarse un id y hay funciones que no son de la clase pero que están relacionadas
 *  con los arreglos de cosplays.
 */

 class Cosplay {
    static count = 0;   // Por el momento, es para generar un id

    constructor (personaje, anime, tipo, precio, oferta = 0, popularidad = 0, stock = 0, imagen, especial = false) {
        this.personaje = personaje;
        this.anime = anime;
        this.tipo = tipo;               // Tipo de prenda
        this.precio = precio;
        this.oferta = oferta;           // Porcentaje de descuento (Rebaja)
        this.popularidad = popularidad; // Esta variable es un contandor que almacena cada vez que se compra uno
        this.stock = stock;
        this.imagen = imagen;
        this.especial = especial;       // Si es a medida o tiene algo particular.

        this.id = ++Cosplay.count; 
    }

    calcularPrecio () {     // Si no tiene descuento devuelve el precio y sino calcula el precio con descuento
        return (this.oferta == 0) ? this.precio : calcularPrecioConDescuento(this.precio, this.oferta);
    }

    toHtml () {         // Pasa un cosplay al formato que tiene que tener en el html
        let cosplayHtml = document.createElement("article");
        cosplayHtml.id = `galeriaIndex${this.id}`;
        cosplayHtml.classList.add("col-6", "col-sm-4", "col-md-3", "col-lg-2", "cosplay", "d-flex", "justify-content-start", "d-none");
        
        // Variables de cada cosplay
        let precio = this.oferta == 0 ? `<h4>$ ${this.precio}</h4>` : `<h4>(<del>$ ${this.precio}</del>) $ ${this.calcularPrecio()}</h4>`;
        let mostrarDescuento = (this.oferta == 0) ? "d-none" : "d-flex";

        // Si es un cosplay sin stock 
        let disabled = "";
        let cartelSinStock = "";
        if (this.stock == 0) {
            disabled = "disabled";  // Es una precaución, aunque no se pueda hacer click en el botón del carrito, por las dudas se lo deshabilita.
            cartelSinStock = `  <div class="cosplay__overlayStock">
                                    <span>SIN STOCK</span>
                                </div>`
        }
        
        cosplayHtml.innerHTML = 
            `<img src=${this.imagen} class="cosplay__imagen mb-2 img-fluid"  alt="${this.anime} - ${this.personaje} - ${this.tipo}">
            ${cartelSinStock}
    
            <div class="cosplay__footer text-break">
                <h3>${this.tipo.toUpperCase()} ${this.personaje.toUpperCase()}</h3>
                <h5>${this.anime}</h5>
                ${precio}
            </div>
    
            <button type="submit" class="cosplay__carrito" data-bs-toggle="offcanvas" data-bs-target="#offcanvasCarrito" aria-controls="offcanvasCarrito" ${disabled}>
                <i class="fa-solid fa-cart-plus"></i>
            </button>
    
            <div class="cosplay__descuento ${mostrarDescuento}">
                ${this.oferta}% <br>OFF
            </div>`;
    
            // Nota: Si se quiere ver cómo funcionan los filtros, agregar el div de acá abajo luego de la línea 43
            /* <div class="cosplay__footer BORRAR">
                <h4>OFERTA: ${cosplay.oferta}</h4>
                <h4>STOCK: ${cosplay.stock}</h4>
                <h4>ESPECIAL: ${cosplay.especial}</h4> 
            </div> */
    
            return cosplayHtml;
    }
}

function searchCosplayById (id) {   // Busca un cosplay según id en el arreglo que se recuperó de la "base de datos"
    return cosplaysBackup.find(c => c.id == parseInt(id));
} 

function getIdCosplayHtml (cosplayHtml) {   // Obtiene el id de un cosplay en su representación html
    return (numbersInString(cosplayHtml.id));
}