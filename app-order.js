"use strict";
const mainEl = document.getElementById("main");
let userName = localStorage.getItem("USERNAME");
mainEl.innerHTML = 
`
<h1>Thank you for shopping at Online Oasis ${userName}, your order has been placed.</h1>
        <a role="button" class="btn btn-secondary p-1 h-100  rounded-0" id="sendButton" onclick="localStorage.clear()" href="./index.html">Continue shopping</a>

`;