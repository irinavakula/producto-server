$(function() {

    let basket = [];

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
            
            //Початок нової частини

             $(document).on("click", ".add", function(event) {
                const productId = event.currentTarget.id.replace('add', ''); // Отримуємо ID товару, якщо це кнопка "add"
                const quantity = parseInt($(`#quantity${productId}`).text(), 10); // Оскільки кількість на складі — це текст, парсимо її в число
                let productCounter = parseInt($(`#counter${productId}`).text(), 10); // Лічильник також перетворюємо на число
            
                if (quantity == 0 || productCounter >= quantity) {
                    alert("Out of stock");
                } else {
                    productCounter++; // Збільшуємо лічильник на 1
                    $(`#counter${productId}`).text(productCounter); // Оновлюємо кількість на сторінці
                }
            });

            //Обробка натискання кнопки "Add to basket"    
            $(document).on("click", ".add-to-basket", function (event) {
                const productId = event.currentTarget.id;
                const nombre = $(this).data("nombre");
                const precio = parseFloat($(this).data("precio"));
                const counter = parseInt($(`#counter${productId}`).text(), 10);
        
                if (counter > 0) {
                    // Перевірити, чи товар вже є в корзині
                    const existingProduct = basket.find(product => product.id === productId);
                    if (existingProduct) {
                        existingProduct.quantity += counter;
                    } else {
                        basket.push({ id: productId, nombre, precio, quantity: counter });
                    }
        
                    alert(`${counter} item(s) of ${nombre} added to the basket!`);
                    updateBasketUI();
                } else {
                    alert("You must add at least one item!");
                }
            });
        
            // Оновлення інтерфейсу корзини
            function updateBasketUI() {
                const basketContainer = $("#basket-products");
                basketContainer.empty();
        
                let total = 0;
                basket.forEach(item => {
                    const itemTotal = item.precio * item.quantity;
                    total += itemTotal;
        
                    const productHTML = `
                        <div class="basket-item">
                            <span>${item.nombre}</span>
                            <span>${item.quantity} x ${item.precio.toFixed(2)} = ${itemTotal.toFixed(2)}</span>
                            <button class="remove-item" data-id="${item.id}">Remove</button>
                        </div>
                    `;
                    basketContainer.append(productHTML);
                });

                // Оновлюємо підсумок
                if (total === 0) {
                     $("#total-price").text("Your basket is empty!"); // Якщо корзина порожня
                } else {
                    $("#total-price").text(`Total: $${total.toFixed(2)}`); // Виводимо загальний підсумок
                }
    
            }

            // Виклик функції для оновлення корзини після додавання товару
            $(document).on("click", ".add-to-basket", function(event) {
                const productId = $(this).data("id");
                const nombre = $(this).data("nombre");
                const precio = parseFloat($(this).data("precio"));
                const counter = parseInt($(`#counter${productId}`).text(), 10); // Кількість, що вибрана на сторінці

             if (counter > 0) {
             // Перевіряємо, чи товар вже є в корзині
                const existingProduct = basket.find(product => product.id === productId);
                 if (existingProduct) {
                     existingProduct.quantity += counter; // Додаємо кількість до існуючого товару
                } else {
                    basket.push({ id: productId, nombre, precio, quantity: counter }); // Додаємо новий товар до корзини
                }

                alert(`${counter} item(s) of ${nombre} added to the basket!`);
                updateBasketUI(); // Оновлюємо інтерфейс корзини
            } else {
                alert("You must add at least one item!");
            }
        });


        
            // Видалення товару з корзини
            $(document).on("click", ".remove-item", function (event) {
                const productId = $(this).data("id");
                basket = basket.filter(item => item.id !== productId);
                updateBasketUI();
            });
        
            // Відображення корзини
            $("#basket").on("click", function () {
                $("#overlay").show();
                $("#popup").show();
            });
        
            // Закриття корзини
            $("#close-popup").on("click", function () {
                $("#overlay").hide();
                $("#popup").hide();
            });
        
            // Оформлення замовлення
            $("#checkout").on("click", function () {
                if (basket.length === 0) {
                    alert("Your basket is empty!");
                } else {
                    alert("Thank you for your purchase!");
                    basket = []; // Очищення корзини
                    updateBasketUI();
                    $("#overlay").hide();
                    $("#popup").hide();
                }
            });

                       
            // Виправлення для кнопки "substract"
            $(document).on("click", ".substract", function(event) {
                const productId = event.currentTarget.id.replace('subtract', ''); // Отримуємо ID товару
                let productCounter = parseInt($(`#counter${productId}`).text(), 10); // Перетворюємо лічильник на число
            
                if (productCounter <= 0) {
                    alert("Could not be less than 0");
                } else {
                    productCounter--; // Зменшуємо лічильник на 1
                    $(`#counter${productId}`).text(productCounter); // Оновлюємо кількість на сторінці
                }
            });

           



    //  $(document).on("click", ".add", function(event) {
    //      const quantity = $(`#quantity${event.currentTarget.id}`).text();
    //      var productCounter = $(`#counter${event.currentTarget.id}`).text();
    //      if (quantity == 0 || productCounter === quantity) {
    //          alert("Out of stock");
    //      } else {
    //          productCounter++;
    //          $(`#counter${event.currentTarget.id}`).text(productCounter);
    //      }
    //  });

    //  $(document).on("click", ".substract", function(event) {
    //      const quantity = $(`#quantity${event.currentTarget.id}`).text();
    //      var productCounter = $(`#counter${event.currentTarget.id}`).text();
    //      if (productCounter == 0) {
    //          alert("Could not be less than 0");
    //      } else {
    //          productCounter--;
    //          $(`#counter${event.currentTarget.id}`).text(productCounter);
    //      }
    //  });
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