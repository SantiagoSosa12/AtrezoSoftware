
function cargarTodosLosProductos() {
    fetch('http://localhost:3050/product')
        .then(response => response.json())
        .then(data => {
            console.log('Productos traidos del servidor')
            console.log(data);
            for (let value of data) {
                var TextJSON = JSON.stringify(value) + '';
                console.log(TextJSON);
                var editar = '<a id="linkEditarProducto" href="../editarProducto.html" onClick=\'cambiarIdProducto('
                + TextJSON+');\' style="color:rgb(0, 0, 0);" >';
                var clase = '<div class="lista-productos">';
                var image = '<img src="./images/' + value.imagenProducto + '" width="260" height="150"> </img>';
                var nombreProducto = '<h1 style="color:rgb(0, 0, 0);">' + value.nombreProducto + '</h1>';
                var cantidadDisponible = '<p style="color:rgb(120, 120, 120);">' + value.cantidadDisponible + ' disponibles</p>';
                var precio = '<h3 style="color:rgb(60, 60, 60);">  $ ' + value.precioDeVenta + ' COP</h3>';
                var cerrarDiv = editar + clase + image + nombreProducto + cantidadDisponible + precio + '</div> </a>';
                console.log("Haz de oros: " + cerrarDiv);
                $('#contenedor').append(cerrarDiv);
            }
        })
}

/**
 * Se carga un producto en particular
 * Se cargan las categorias
 */
function cargarProductoYCategorias(){
    getCodigoProducto();
    cargarCategorias();
}

function cargarCategorias() {
    fetch('http://localhost:3050/categorias')
        .then(response => response.json())
        .then(data => {
            console.log('Categorias del servidor')
            console.log(data);
            for (let value of data) {
                console.log(value.codigoCategoria + ' ' + value.nombreCategoria);
                var categoria = '<option value="'+ value.codigoCategoria + '"> ' + value.nombreCategoria + ' </option>';
                $('#Categoria').append(categoria);
            }
        })
}


/**
 * Se debe mantener el producto actual del producto
 * con ello al cambiar de pagina ya tenemos 
 * el id para los parametros necesarios
 * @param {*} nuevoId 
 */
function cambiarIdProducto(productoActual){
    console.log('Se guaradron atributos: ' + JSON.stringify(productoActual));
    localStorage.setItem("ProductoActual", JSON.stringify(productoActual));
}

function getCodigoProducto() {
    var retrievedObject = localStorage.getItem('ProductoActual');
    var objetoProducto = JSON.parse(retrievedObject)
    console.log('retrievedObject: ', objetoProducto.descripcionProducto);
    document.getElementById("codigoProducto").value=objetoProducto.codigoProducto;
    document.getElementById("cantidadDisponible").value=objetoProducto.cantidadDisponible;
    document.getElementById("nombreProducto").value=objetoProducto.nombreProducto;
    document.getElementById("precioDeCompra").value=objetoProducto.precioDeCompra;
    document.getElementById("precioDeVenta").value=objetoProducto.precioDeVenta;
    document.getElementById("descripcionProducto").value=objetoProducto.descripcionProducto;
    document.getElementById('camara').src = "./productos/images/" + objetoProducto.imagenProducto;
}
function chageToAddProduct(){
    window.location = "../crearProducto.html";
}

/**
 * Se utiliza el atributo LocalStorage para eliminar un producto
 */
function eliminarProducto(){
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