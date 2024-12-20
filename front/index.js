$(function() {
    $.get("http://localhost:1234/api/productos")
            .done(function( data ) {
                var productContainer = $(".flex-container");
                data.forEach(element => {
                    const cantidad = element.cantidad === 0 ? 0 : 1;
                    const product = `
                    <div class="flex-item">
                        <div class="flex-inline">
                            <label>${element.nombre}</label>
                        </div>
                        <div class="flex-inline">
                            <label>${element.descripcion}</label>
                        </div>
                        <div class="flex-inline">
                            <label>Price:</label>
                            <label>${element.precio}</label>
                        </div>
                        <div class="flex-inline">
                            <label>Quantity:</label>
                            <label id="quantity${element.id}">${element.cantidad}</label>
                        </div>
                        <div class="flex-inline">
                            <button class="add" id="${element.id}">+</button>
                            <label id="counter${element.id}">${cantidad}</label>
                            <button class="substract" id="${element.id}">-</button>
                        </div>
                        <button id="add">Add to basket</button>
                        <input type="hidden" name="product_id" value=${element.id}>
                    </div>
                    `;
                    productContainer.append(product);
                });
            });

    $(document).on("click", ".add", function(event) {
        const quantity = $(`#quantity${event.currentTarget.id}`).text();
        var productCounter = $(`#counter${event.currentTarget.id}`).text();
        if (quantity == 0 || productCounter === quantity) {
            alert("Out of stock");
        } else {
            productCounter++;
            $(`#counter${event.currentTarget.id}`).text(productCounter);
        }
    });

    $(document).on("click", ".substract", function(event) {
        const quantity = $(`#quantity${event.currentTarget.id}`).text();
        var productCounter = $(`#counter${event.currentTarget.id}`).text();
        if (productCounter == 0) {
            alert("Could not be less than 0");
        } else {
            productCounter--;
            $(`#counter${event.currentTarget.id}`).text(productCounter);
        }
    });
})


// {
//     "id": 1,
//     "nombre": "Producto A",
//     "descripcion": "Descripción A",
//     "cantidad": 10,
//     "precio": 100.0
// },

//        $("#create").on("click", function(event) {
//        
//     });