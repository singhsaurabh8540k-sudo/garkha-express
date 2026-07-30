let cart = [];

function addToCart(name, price) {

    let item = cart.find(product => product.name === name);

    if (item) {
        item.qty++;
    } else {
        cart.push({
            name: name,
            price: price,
            qty: 1
        });
    }

    updateCart();

    document.getElementById("cartBox").style.display = "block";
}


function updateCart() {

    let count = 0;
    let total = 0;
    let html = "";

    cart.forEach((item, index) => {

        count += item.qty;

        let itemTotal = item.price * item.qty;

        total += itemTotal;

        html += `
        <div class="cartRow">

            <div>
                <b>${item.name}</b><br>
                ₹${item.price} × ${item.qty}
            </div>

            <div>
                <button onclick="decreaseQty(${index})">−</button>
                ${item.qty}
                <button onclick="increaseQty(${index})">+</button>
            </div>

        </div>
        `;
    });


    if (cart.length === 0) {
        html = "Cart empty hai";
    }


    document.getElementById("cartItems").innerHTML = html;

    document.getElementById("cartCount").innerText = count;

    document.getElementById("total").innerText = total;
}


function increaseQty(index) {

    cart[index].qty++;

    updateCart();
}


function decreaseQty(index) {

    cart[index].qty--;

    if (cart[index].qty <= 0) {
        cart.splice(index, 1);
    }

    updateCart();
}


function toggleCart() {

    let box = document.getElementById("cartBox");

    if (box.style.display === "block") {
        box.style.display = "none";
    } else {
        box.style.display = "block";
    }
}


function openCheckout() {

    if (cart.length === 0) {
        alert("Pehle saman cart me add karein.");
        return;
    }

    document.getElementById("checkoutBox").style.display = "block";
}


function closeCheckout() {

    document.getElementById("checkoutBox").style.display = "none";
}
