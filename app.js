/**
     KravFör godkänt betyg (G)
 
     * 1.Alla produkter från det öppna API:et visas på webbplatsen med all data om varje produkt. 
 
     * 2.Det går att beställa produkter(genom att klicka på “köp”-knapp)och användaren ska då behövaskicka 
        med namn, e-post, adress samt välja fraktvillkor(det ska inte gå att skicka beställningar utan att 
        all data har angetts. Produktens id skickas med automatiskt).Beställningar skickas med API till en 
        egen databas i Google Firebase där de lagras.
 
        * 3.En admin-sida skapas som använder Firebase API för att kunna se, ändra och ta bort ordrar. 
        Anslutningen till Firebase ska vara säker (cors och/eller autentisering)

        * 4.Källkoden versionshanteras med Github.
 
        * 5.Webbplatsen publiceras.
 
    För väl godkänt betyg (VG)Alla krav för godkänt, samt:

    * 1.Det går att visa alla produkter baserat pårespektive kategori

    * 2.Det är möjligt för en användare att beställa flera produkter samtidigt(via produkternas “köp”/”lägg 
    i varukorgen”-knappar).

    * 3.En varukorgssida listar alla produkter(med minst produktnamnoch pris)som valts med möjlighet att 

    * ta bort produkter innan beställning. Om webbsidan laddas om ska produkterna 
    fortfarande finnas kvar i varukorgen.

    * 4.En ikon för varukorgenvisar hur många produkter som ligger i varukorgen. 

    InlämningUppgiften lämnas in inlämningslådan på kurswebbplatsen Totara:1.All din källkod i en komprimerad mapp (ZIP-fil)2.Länk till publicerad webbplats3.Länk till publicerat repositorypå Github
    */

"use strict";

const productsEl = document.getElementById("products");
const menEl = document.getElementById("men");
const basketlistEl = document.getElementById("basketlist");
const basketEl = document.getElementById("basket");
const subtotalEl = document.getElementById("subtotal");
const totalItemsInCartEl = document.getElementById("totalitemsincart");
const carticonEl = document.getElementById("carticon");
const checkoutbuttonEl = document.getElementById("checkoutbutton");
const modalEl = document.getElementById("modal");
const modalBasketEl = document.getElementById("offcanvasWithBothOptions");


console.log(localStorage.getItem("USD"));
getRate();
function getRate() {
    fetch('https://api.valuta.se/api/sek/rates/')
        .then(res => res.json())
        .then(data => render(data));

    function render(rates) {
        console.log(rates);
        let arr = rates;
        console.log("arr", arr);
        console.log("arr", arr[4].value);
        localStorage.setItem("USD", (arr[4].value) / 100);
    }
}

fetch('http://localhost:8080/products')
    .then(res => res.json())
    .then(json1 => renderJson(json1))
    .catch(error => console.log(error));

function renderJson(json1) {
    let products = json1;
    console.log(products);

    //fetch currency exchane



    localStorage.setItem('products', JSON.stringify(products));

    productsEl.innerHTML = "";
    for (let i = 0; i < products.length; i++) {
        let productTitle = products[i].title;
        let productImage = products[i].image;
        let description = products[i].description;
        let category = products[i].category;
        //let rate = products[i].rating.rate;
        //let count = products[i].rating.count;

        let price = products[i].price * localStorage.getItem("USD");
        price = price.toFixed(0);
        let productId = products[i].id;
        // console.log("json:",jsonobject);
        // console.log("values: ", values);

        // if (category === "men's clothing") {
        productsEl.innerHTML += `
        <div class="col-6 col-md-6 col-lg-4 mb-3">
        <div class="card h-100">
        <img src="${productImage}" class="productItem card-img"  alt="${productTitle}" style="height: 300px; width: 100%; object-fit: contain;>
        
        <div class="card-img-overlay">
        <img src="add-to-cart.png" class="float-end rounded-circle rounded-circle2 bg-dark-subtle position-absolute top-0 end-0"" id='a1' role="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasWithBothOptions"
         aria-controls="offcanvasWithBothOptions" onclick="addToCart(${productId}); showBasket()">
        <div class="card-body m-0 mb-0">
        <div class="card-title">
        <p class="card-text text-truncate" style="max-width: 150px;"><b>${productTitle}</b></p>
        <div class="d-inline-flex ustify-content-between">
        <p><b>${price} kr.</b></p>
        
         </div>
         </div>
         <a role="button" data-bs-toggle="modal" data-bs-target="#picturemodal${i}">more</a>
        </div>
        
        </div>
        </div>
        </div>
            `;
        // }
        //<div class="col-6 col-md-6 col-lg-4 mb-3">
        // <div class="card h-100">
        //     <a role="button" data-bs-toggle="modal" data-bs-target="#picturemodal${i}">
        //         <img class="m-3" src="${productImage}" alt="${productTitle}" style="height: 300px; width: 100%; object-fit: contain;></a>
            
        //     <div class="card-body m-3 mb-0">
        //         <div class="card-title">
        //             <p class="card-text text-truncate" style="max-width: 150px;"><b>${productTitle}</b></p>
        //             <p><b>${price} kr.</b></p>
        //         </div>
        // </div>
        //    </div > 
        //<div class="card-img-overlay">
        //     <img src="add-to-cart.png" class="float-end rounded-circle rounded-circle2 bg-dark-subtle" id='a1' role="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasWithBothOptions"
        //         aria-controls="offcanvasWithBothOptions" onclick="addToCart(${productId}); showBasket()">
        // </div>
        modalEl.innerHTML +=
            `
        <div class="modal fade" id="picturemodal${i}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="exampleModalLabel">${productTitle}</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <img class= "card-img-top" src="${productImage}" width="100%">
                        <p>${description}</p>
                        
                        
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-light rounded-0" data-bs-dismiss="modal">Close</button>

                    </div>
                </div>
            </div>
        </div>
        `}
}
;


//cart array
let cart = JSON.parse(localStorage.getItem("CART")) || [];
console.log("cart", cart);
console.log("cart.length", cart.length);

if (cart.length < 1) {
    basketEl.className = "invisible";

} else {
    basketEl.className = "";

}
updateCart();
showCartIcon();
//functions

function addToCart(id) {

    let productsLocal = localStorage.getItem("products");
    let products = JSON.parse(productsLocal);
    console.log("products: ", products);
    console.log(id);
    basketEl.scrollIntoView();

    //check if product already exists in cart
    if (cart.some((item) => item.id === id)) {
        alert("Product already in cart")
    }
    else {
        const item = products.find((product) => product.id === id)
        // console.log(item);
        cart.push({
            ...item,
            numberOfUnits: 1,
        });
        console.log(cart);
    }
    updateCart();
}
//update cart
function updateCart() {
    renderCartItems();
    renderSubTotal();
    showCartIcon();


    //sace cart to local storage
    localStorage.setItem("CART", JSON.stringify(cart));
}

// calculate and render subtotal
function renderSubTotal() {
    let totalPrice = 0, totalItems = 0;
    cart.forEach(item => {
        totalPrice += item.price * item.numberOfUnits * localStorage.getItem("USD");
        totalItems += item.numberOfUnits;
    });
    subtotalEl.innerHTML =
        `
    
        <div  class="d-flex align-self-flex-end"><p class="m-0"><b><Em>Subtotal(${totalItems} items): ${totalPrice.toFixed(0)} kr.</em></b></p>
        </div>
        <a href="/checkout.html"><button id="checkoutbutton" class="btn btn-secondary p-1 h-100 w-100 rounded-0"><b><em>Proceed to checkout</em></b></button></a>
        `
    totalItemsInCartEl.innerHTML = totalItems;
};

// render cart items
function renderCartItems() {
    basketlistEl.innerHTML = "";
    cart.forEach((item) => {
        let price = item.price * localStorage.getItem("USD");
        price = price.toFixed(0);
        basketlistEl.innerHTML +=
            `
           <td><img src="${item.image}" alt="${item.title}" onclick="removeItemFromCart(${item.id})" style="max-width: 50px"></td>
            <td>${item.title}</td>
            <td><b>${price} kr.</b></td>
           <td><a id='a1' role="button" class="btn btn-light rounded-circle" onclick="changeNumberOfUnits('minus', ${item.id})">-</a></td>
           <td><b>${item.numberOfUnits}</b></td><td><a id='a1' role="button" 
           class='btn btn-light rounded-circle' onclick="changeNumberOfUnits('plus', ${item.id})">+</a></td>
        `
    });
}
//change number of units for an item

function changeNumberOfUnits(action, id) {
    cart = cart.map((item) => {
        console.log(item.numberOfUnits);
        let numberOfUnits = item.numberOfUnits;
        console.log(numberOfUnits);
        console.log("item.id: ", item.id);
        console.log("id: ", id);
        if (item.id === id) {
            console.log("action: ", action);
            if (action === "minus" && numberOfUnits > 1) {
                numberOfUnits--;
                console.log("numberOfUnits: ", numberOfUnits);
            } else if (action === "plus") {
                numberOfUnits++;
            }
        }
        console.log("item", item);
        return {
            ...item,
            numberOfUnits,
        }
    });

    updateCart();
}
// remove item from cart
function removeItemFromCart(id) {
    console.log("removeItemFromCart");
    cart = cart.filter((item) => item.id !== id);
    if (cart.length === 0) {
        basketEl.className = "invisible"
    }

    updateCart();
    showCartIcon();
    emptyCart();

}
function showBasket() {
    console.log("showBasket");
    basketEl.className = "";

}
function showCartIcon() {

    if (cart.length < 1) {
        carticonEl.className = "visually-hidden";

    } else {
        carticonEl.className = "visible d-flex position-relative";

    }
}
function emptyCart(){
    if(cart.length ===0){
        modalBasketEl.innerHTML = `<p>Your basket is empty</p>`
    }
}