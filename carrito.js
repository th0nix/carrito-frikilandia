class Carrito {
  constructor(productos) {
    this.productos = productos;
    this.divisa = "€";
    for (const producto of this.productos) {
      producto.precio = parseFloat(producto.precio);
      producto.unidades = 0;
      producto.subtotal = 0.0;
    }
  }

  actualizarUnidades(sku, unidades) {
    for (const producto of this.productos) {
      if (producto.SKU === sku) {
        producto.unidades += unidades;
        if(producto.unidades < 0 ){
          producto.unidades = 0;
        }
        producto.subtotal = Number((producto.precio * producto.unidades).toFixed(2));
      }
    }
  }

  obtenerInformacionProducto(sku) {
    for (const producto of this.productos) {
      if (producto.SKU === sku) {
        return producto;
      }
    }

  }

  obtenerCarrito() {
    let precioTotal = 0.0;
    let productosCarrito = [];
    for (const producto of this.productos) {
      if (producto.unidades > 0) {
        productosCarrito.push(producto);
        precioTotal += producto.subtotal;
      }

    }
    return { productos: productosCarrito, total: Number(precioTotal.toFixed(2)), divisa: this.divisa };
  }
}

let carrito;

function mostrarProductos() {
  const tabla = document.getElementById("listaProductos");
  tabla.innerHTML="";
  for(p of carrito.productos){
    let fila = document.createElement("tr");
    fila.classList.add("vistaProductos");
    fila.innerHTML= "<td><strong>" +p.nombre  +  "</strong><br><small>" + "REF: " + p.SKU + "</small></td>"+
                    "<td>" + 
                      "<button onclick=\"carrito.actualizarUnidades('" + p.SKU + "', 1); mostrarProductos();\">+</button>" +
                          "<input value=" + p.unidades + " readonly class = 'entradaCantidad'>"+ 
                          "<button onclick=\"carrito.actualizarUnidades('" + p.SKU + "', -1); mostrarProductos();\">-</button>"+
                    "</td>"+
                    "<td>" + p.precio + "" + carrito.divisa + "</td>"+
                    "<td>" + p.subtotal + carrito.divisa + "</td>";
    
    
    tabla.appendChild(fila);
  }
  let resumenCarrito = carrito.obtenerCarrito();
  const filaCarrito = document.getElementById("resumenProductos");
  const totalCarrito = document.getElementById("precioTotal");
  filaCarrito.innerHTML="";
  for (let datos of resumenCarrito.productos){
    let parrafo = document.createElement("p");
    parrafo.innerText = datos.unidades + " x " + datos.nombre;
    totalCarrito.innerText = datos.total;
    filaCarrito.appendChild(parrafo);
  }
  totalCarrito.innerText = resumenCarrito.total + carrito.divisa;
}
const URL_API = "api.php";

async function inicializarCarrito() {
  try{
    const respuesta = await fetch(URL_API);
  if(!respuesta.ok){
    throw new Error("Error al obtener los productos del carrito");
  }
  const datosCarrito = await respuesta.json();
  carrito = new Carrito(datosCarrito.productos);
  mostrarProductos();
  }
  catch(error){
    console.error("Error al inicializar el carrito:", error);
  }
   
}



inicializarCarrito();
