"use strict";
fetch('https://fakestoreapi.com/products')
    .then(res => res.json())
    .then(json => console.log(json))

const usernameEl = document.getElementById("username");
const emailEl = document.getElementById("email");
const adress1El = document.getElementById("adress1");
const adress2El = document.getElementById("adress2");
const adress3El = document.getElementById("adress3");
const adress4El = document.getElementById("adress4");
const bodyEl = document.getElementById("body");

const h1El = document.getElementById("h1");
const basketEl = document.getElementById("basketlist");
const subtotalEl = document.getElementById("subtotal");
const totalItemsInCartEl = document.getElementById("totalitemsincart");

const fraktEl = document.getElementById("radio")
const sendButtonEl = document.getElementById("sendButton");


// let productId = localStorage.getItem("id");
// let productTitle = localStorage.getItem("title");
// let productPrice = localStorage.getItem("price");
// console.log("id: ", productId);
// console.log("title: ", productTitle);
// console.log("price: ", productPrice);

let cart = JSON.parse(localStorage.getItem("CART")) || [];
updateCart();

console.log(cart);

if (cart.length <1) {
    bodyEl.innerHTML =
`<h1 class="text-center">Your basket is empty</h1>
<a href="/index.html"><button class="btn btn-success">Return to the webbshop</button></a>`
}
//functions

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

function addToCart(id) {
    let productsLocal = localStorage.getItem("products");
    let products = JSON.parse(productsLocal);
    console.log("products: ", products);
    console.log(id);

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
        `
    totalItemsInCartEl.innerHTML = totalItems;
};

// render cart items
function renderCartItems() {
    basketEl.innerHTML = "";
    cart.forEach((item) => {
        let price = item.price * localStorage.getItem("USD");
        price = price.toFixed(0);
        basketEl.innerHTML +=
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

//add total price to cart

function totalPrice() {
    let totalPrice = 0, totalItems = 0;
    cart.forEach(item => {
        totalPrice += item.price * item.numberOfUnits;
        totalItems += item.numberOfUnits;
    });
    cart.push({ orderTotalPrice: totalPrice })
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
    cart = cart.filter((item) => item.id !== id);

    updateCart();
}


//Eventlistener
sendButtonEl.addEventListener('click', function sendOrder() {
    console.log("sendOrder körs");
    console.log("cart.length", cart.length);
    if (cart.length < 1) {
        alert("Your basket is empty")
        return
    }
    console.log("cart: ", cart);

    totalPrice();

    let index = (cart.length - 1);
    console.log("index", index);
    let orderTotalPrice = cart.at((index));
    console.log("orderTotalPrice: ", orderTotalPrice.orderTotalPrice);
    orderTotalPrice = JSON.stringify(orderTotalPrice.orderTotalPrice);
    console.log("orderTotalPrice:", orderTotalPrice);
    cart = cart.slice(0, index);

    console.log("cart: ", cart);
    let cartIds = "";
    for (let i = 0; i < cart.length; i++) {
        cartIds += cart[i].id + ", ";

    }
    console.log("cart.id", cartIds);
    // cart = JSON.stringify(cart);

    //HÄMTA IN DATA FRÅN FORMULÄRFÄLTEN
    let frakt;
    frakt = document.querySelector('input[name="flexRadioDefault"]:checked').value;
    // if (!frakt) {
    //     alert("Ange fraktmetod")
    // }

    // let orderTime = Timestamp.fromDate(new Date());
    let orderTime = new Date();
    let username = usernameEl.value;
    let email = emailEl.value;
    let adress = adress1El.value + ", " + adress2El.value + ", " + adress3El.value + ", " + adress4El.value;
    console.log("username: ", username);
    console.log("orderTime: ", orderTime);
    console.log("frakt: ", frakt);
    console.log("email: ", email);
    console.log("adress: ", adress);

    console.log("cart: ", cart);
    
localStorage.setItem("USERNAME", username);

    if (!username || !frakt || !email || !adress) {
        alert("Please enter the required fields to place the order")
        return
    }
    //SÄTT SAMANANVÄNDARENS VÄRDEN TILL JSON-OBJEKT
    const body = JSON.stringify({
        "fields": {
            "products": {
                "stringValue": cartIds
            },
            "date": {
                "timestampValue": orderTime
            },
            "email": {
                "stringValue": email
            },
            "orderTotalPrice": {
                "stringValue": orderTotalPrice
            },
            "adress": {
                "stringValue": adress
            },
            "userName": {
                "stringValue": username
            },
            "shippingMethod": {
                "stringValue": frakt
            }
        }
    });

    //SKICKA FETCH-ANROP
    fetch("https://firestore.googleapis.com/v1/projects/online-oasis-orders/databases/(default)/documents/orders", {
        method: 'POST',
        headers: {
            'content-Type': 'application/json'
        },
        body: body
    })
        .then(res => res.json())
        .then(data => console.log(data));
    setTimeout(finnishOrder, 2000);
});


// function reload() {
//     console.log("reload() körs");
//     location.reload();
// }
function finnishOrder() {
    location.assign("/order.html");
        // localStorage.clear();

}
