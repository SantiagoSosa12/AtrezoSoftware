function cargarTodosLosProductos() {
    peticionTodosLosProductos()
        .then(cargarCategorias2())
        .then(crearBuscador());
}

/**
 * Lista de todos porductos
 * @returns lista de productos o error si no se realizo la coneccion
 */
function peticionTodosLosProductos() {
    return new Promise((resolve, reject) => {
        fetch('http://localhost:3050/product')
            .then(response => response.json())
            .then(data => {
                console.log('Productos traidos del servidor');
                mostrarTodosLosProductos(data);
                return resolve(data);
            })
            .then(error => {
                return reject(error);
            })
    });
}

/**
 * Se crea un buscador con el contenido de las tarjetas
 */
function crearBuscador() {
    document.addEventListener("keyup", e => {
        if (e.target.matches("#gsearch")) {
            if (e.key === "Escape") e.target.value = ""
            document.querySelectorAll(".lista-productos").forEach(producto => {
                producto.textContent.toLowerCase().includes(e.target.value.toLowerCase()) ?
                    producto.classList.remove("filtro") :
                    producto.classList.add("filtro")
            })
        }
    })
}

/**
 * Se carga un producto en particular
 * Se cargan las categorias
 */
function cargarProductoYCategorias() {
    let cargarCategoriasServidor = cargarCategorias();
    cargarCategoriasServidor.then((successMessage) => {
        console.log('Se cargaron las categorias con exito: ' + successMessage);
        getCodigoProducto();
    })
    /*
    cargarCategorias()
        .then(getCodigoProducto());*/

}

/**
 * Funciones que se muestran al crear o editar un producto
 */
function cargarCategorias() {
    return new Promise((resolve, reject) => {
        fetch('http://localhost:3050/categorias')
            .then(response => response.json())
            .then(data => {
                console.log(data);
                for (let value of data) {
                    console.log(value.codigoCategoria + ' ' + value.nombreCategoria);
                    var categoria = '<option value="' + value.codigoCategoria + '"> ' + value.nombreCategoria + ' </option>';
                    $('#Categoria1').append(categoria);
                }
                return resolve(data);
            })
            .then(error => {
                return reject(error);
            })
    });
}

/**
 * Carga las categorias pero para ser mostradas como botones
 */
function cargarCategorias2() {
    console.log('Cargar categorias dossss');
    fetch('http://localhost:3050/categorias')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            for (let value of data) {
                console.log(value.codigoCategoria + ' ' + value.nombreCategoria);
                var categoria = '<a class="item" style="color:#000000;" ' +
                    'onclick="cargarProductosPorCategoria(' + value.codigoCategoria + ')">' + value.nombreCategoria + ' </a>';
                $('#listaCategorias').append(categoria);
            }
        })
}

/**
 * Se debe mantener el producto actual del producto
 * con ello al cambiar de pagina ya tenemos 
 * el id para los parametros necesarios
 * @param {*} nuevoId 
 */
function cambiarIdProducto(productoActual) {
    console.log('Se guaradron atributos: ' + JSON.stringify(productoActual));
    localStorage.setItem("ProductoActual", JSON.stringify(productoActual));
}

/**
 * Al seleccionarse una tarjeta se extrae el codigo del producto
 * para poder mostrar la imformación particular del mismo
 */
function getCodigoProducto() {
    var retrievedObject = localStorage.getItem('ProductoActual');
    var objetoProducto = JSON.parse(retrievedObject);
    console.log('retrievedObject: ', objetoProducto);
    document.getElementById("codigoProducto").value = objetoProducto.codigoProducto;
    document.getElementById("cantidadDisponible").value = objetoProducto.cantidadDisponible;
    document.getElementById("nombreProducto").value = objetoProducto.nombreProducto;
    document.getElementById("precioDeCompra").value = objetoProducto.precioDeCompra;
    document.getElementById("precioDeVenta").value = objetoProducto.precioDeVenta;
    document.getElementById("descripcionProducto").value = objetoProducto.descripcionProducto;
    document.getElementById("Categoria1").value = objetoProducto.idCategoria;
    document.getElementById('camara').src = "./productos/images/" + objetoProducto.imagenProducto;
}

/**
 * Cambio de html
 */
function chageToAddProduct() {
    window.location = "../crearProducto.html";
}

/**
 * Se utiliza el atributo LocalStorage para eliminar un producto
 */
function eliminarProducto() {
    if (window.confirm("Realmente desea eliminar este producto?")) {
        var retrievedObject = localStorage.getItem('ProductoActual');
        var objetoProducto = JSON.parse(retrievedObject)
        fetch('http://localhost:3050/delete_product/' + objetoProducto.codigoProducto, {
            method: 'DELETE',
        })
            .then(res => res.text()) // or res.json()
            .then(res => window.location = "./productos/productos.html")
    }
}

/**
 * Se eliminan los productos bien sea para mostrar unos nuevos por categoria
 * o para mostrar unos que se hayan buscado
 */
function eliminarTodosLosProductos() {
    var prod = document.getElementById("contenedor");
    while (prod.firstChild) {
        prod.removeChild(prod.firstChild);
    }
}

/**
 * Para una lista de productos
 * se crea una tarjeta para cada uno de ellos
 * @param {*} data 
 */
function mostrarTodosLosProductos(data) {
    for (let value of data) {
        var TextJSON = JSON.stringify(value) + '';
        var editar = '<a id="linkEditarProducto" href="../editarProducto.html" onClick=\'cambiarIdProducto(' +
            TextJSON + ');\' style="color:rgb(0, 0, 0);" >';
        var clase = '<div class="lista-productos">';
        var image = '<img src="./images/' + value.imagenProducto + '" width="260" height="150" class="imgProduct"> </img>';
        var nombreProducto = '<h1 style="color:rgb(0, 0, 0);">' + value.nombreProducto + '</h1>';
        var cantidadDisponible = '<p style="color:rgb(120, 120, 120);">' + value.cantidadDisponible + ' disponibles</p>';
        var precio = '<h3 style="color:rgb(60, 60, 60);">  $ ' + value.precioDeVenta + ' COP</h3>';
        var cerrarDiv = editar + clase + image + nombreProducto + cantidadDisponible + precio + '</div> </a>';
        $('#contenedor').append(cerrarDiv);
    }
}

/**
 * Carga los productos de una categoria en particualr
 * @param {*} idCategoria 
 */
function cargarProductosPorCategoria(idCategoria) {
    eliminarTodosLosProductos();
    fetch('http://localhost:3050/product/' + idCategoria)
        .then(response => response.json())
        .then(data => {
            console.log('Productos cargados solo por categoria');
            mostrarTodosLosProductos(data);
        })
}

/**
 * Se suma un porcentaje al valor de venta
 * dependiendo del de compra
 * El valor minimo de compra debe ser al menos un 5%
 * mayor que el de compra
 */
function sumarPorcentaje() {
    let precioCompra = document.getElementById("precioDeCompra").value;
    precioCompra = parseFloat(precioCompra);
    document.getElementById("precioDeVenta").min = (precioCompra + (precioCompra * 0.05)) * 1;
    document.getElementById("precioDeVenta").value = (precioCompra + (precioCompra * 0.2)) * 1;
}

module.exports = {
    "sumarPorcentaje" : sumarPorcentaje
}