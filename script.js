// Script for navigation bar
const bar = document.getElementById("bar");
const nav = document.getElementById("navbar");
const close = document.getElementById("close");

if (bar) {
    bar.addEventListener("click", () => {
        nav.classList.add("active");
    })
}
if (close) {
    close.addEventListener("click", () => {
        nav.classList.remove("active");
    })
}

function addToCart(product) {
    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];

    const selectedSize = document.querySelector('#selectedSize').value;
    const selectedQuantity = parseInt(document.querySelector('#selectedQuantity').value);

    const cartItem = {
        name: product.name,
        price: product.price,
        size: selectedSize,
        quantity: selectedQuantity,
        image: product.image,
    };

    cartItems.push(cartItem);
    localStorage.setItem('cart', JSON.stringify(cartItems));
}

function updateCartTable() {
    const cartTable = document.querySelector('#cart tbody');
    cartTable.innerHTML = '';

    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];

    cartItems.forEach((product, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><a href="#" onclick="removeFromCart(${index})"><i class="fas fa-trash-can fa-xl"></i></a></td>
            <td><img src="${product.image}" alt=""></td>
            <td>${product.name}</td>
            <td>${product.size}</td>
            <td>Rs.${product.price}</td>
            <td><input type="number" name="" id="" min="1" max="16" value="${product.quantity}" onchange="updateQuantity(${index},this.value)"></td>
            <td>Rs.${product.price * product.quantity}</td>
        `;
        cartTable.appendChild(row);
    });
}

function updateQuantity(index, newQuantity) {
    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];

    if (newQuantity <= 0) {
        removeFromCart(index);
    } else {
        cartItems[index].quantity = parseInt(newQuantity);
        localStorage.setItem('cart', JSON.stringify(cartItems));
        updateCartTable();
        updateCartTotals();
    }
}

function removeFromCart(index) {
    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];

    cartItems.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cartItems));
    updateCartTable();
    updateCartTotals();
}



let couponApplied = false;
let shippingCharge = 0;

function applyCoupon() {
    const enteredCoupon = document.querySelector('#couponInput').value;
    const couponMessage = document.querySelector('#couponMessage');
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    if (cartItems.length === 0) {
        // Cart is empty, set default shipping charge to 0
        localStorage.setItem('shippingCharge', '0');
        updateCartTotals();
        return;
    }

    if (enteredCoupon === 'cara' || enteredCoupon === 'welcometocara') {
        couponMessage.textContent = 'Hurry up! Code is valid.';
        couponApplied=true;

        localStorage.setItem('shippingCharge', '200');
    } else {
        couponMessage.textContent = 'Uff! Invalid code.';

        localStorage.setItem('shippingCharge', '200');
    }
    updateCartTotals();
}

function updateCartTotals() {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    let cartSubtotal = 0;

    cartItems.forEach((product) => {
        cartSubtotal += (product.price * product.quantity) + (product.price * product.quantity * 12)/100 ;
    });

    const cartSubtotalElement = document.querySelector('#cartSubtotal');
    const shippingChargeElement = document.querySelector('#shippingCharge');
    const cartTotalElement = document.querySelector('#cartTotal');

    cartSubtotalElement.textContent = `Rs. ${Math.floor(cartSubtotal)}`;

    shippingCharge = parseInt(localStorage.getItem('shippingCharge')) || 0;
    if(cartSubtotal > 1100){
        localStorage.setItem('shippingCharge', '0');
        shippingCharge = 0;
        shippingChargeElement.textContent = `Rs.0`;
    }
    else{
        localStorage.setItem('shippingCharge', '200');
        shippingCharge = 200;
        shippingChargeElement.textContent = `Rs.200`;
    }

    if (couponApplied) {
        // shippingChargeElement.textContent = 'Free';
        cartSubtotal=cartSubtotal-cartSubtotal*(0.05);
    } else {
        shippingChargeElement.textContent = `Rs. ${shippingCharge}`;
    }

    

    const cartTotal = cartSubtotal + shippingCharge;
    cartTotalElement.textContent = `Rs. ${Math.floor(cartTotal)}`;
}


updateCartTotals();
updateCartTable();

function getCartContents() {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    return cartItems;
}

function updateCartDisplay() {
    const cartBody = document.getElementById("cartBody");
    const empty = document.getElementById("empty");

    const cartContents = getCartContents();
    if (cartContents.length === 0) {
        cartBody.style.display = "none";
        empty.style.display = "block";
    } else {
        cartBody.style.display = "table-row-group";
        empty.style.display = "none";
    }
}

updateCartDisplay();


function redirectToPage(selectElement) {
    var selectedBrand = selectElement.value;
    if (selectedBrand === "puma") {
        window.location.href = "shop.html";
    } else if (selectedBrand === "zara") {
        window.location.href = "shop.html";
    } else if (selectedBrand === "adidas") {
        window.location.href = "shop.html";
    }
}


document.addEventListener('DOMContentLoaded', () => {
    const addressLink = document.querySelector('.address');
    const slidePanel = document.querySelector('.slide-panel');

    addressLink.addEventListener('click', (e) => {
        e.preventDefault();
        slidePanel.classList.toggle('open');
    });
});