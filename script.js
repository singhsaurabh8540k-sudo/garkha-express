let cart = [];

function addToCart(name, price){

    const existing = cart.find(item => item.name === name);

    if(existing){
        existing.qty++;
    }else{
        cart.push({
            name:name,
            price:price,
            qty:1
        });
    }

    updateCart();

    alert(name + " cart me add ho gaya 🛒");
}

function updateCart(){

    const cartCount = document.getElementById("cartCount");
    const cartItems = document.getElementById("cartItems");
    const totalElement = document.getElementById("total");

    let total = 0;
    let count = 0;

    cart.forEach(item => {

        total += item.price * item.qty;
        count += item.qty;

    });

    cartCount.innerText = count;

    if(cart.length === 0){

        cartItems.innerHTML =
        '<p class="empty">Your cart is empty</p>';

    }else{

        let html = "";

        cart.forEach((item,index) => {

            html += `
            <div class="cart-item">

                <div>
                    <b>${item.name}</b><br>
                    ₹${item.price} × ${item.qty}
                </div>

                <div class="qty">

                    <button onclick="decrease(${index})">−</button>

                    <span>${item.qty}</span>

                    <button onclick="increase(${index})">+</button>

                </div>

            </div>
            `;

        });

        cartItems.innerHTML = html;
    }

    totalElement.innerText = total;
}

function increase(index){

    cart[index].qty++;

    updateCart();
}

function decrease(index){

    cart[index].qty--;

    if(cart[index].qty <= 0){
        cart.splice(index,1);
    }

    updateCart();
}

function toggleCart(){

    const box = document.getElementById("cartBox");

    if(box.style.display === "block"){
        box.style.display = "none";
    }else{
        box.style.display = "block";
    }
}

function searchProducts(){

    const search =
    document.getElementById("searchInput").value.toLowerCase();

    const products =
    document.querySelectorAll(".card");

    products.forEach(card => {

        const name =
        card.getAttribute("data-name").toLowerCase();

        if(name.includes(search)){
            card.style.display = "";
        }else{
            card.style.display = "none";
        }

    });
}

function sendWhatsApp(){

    if(cart.length === 0){

        alert("Pehle cart me product add karein 🛒");

        return;
    }

    let message =
    "🛒 *Garkha Express Order*%0A%0A";

    cart.forEach(item => {

        message +=
        "• " +
        item.name +
        " × " +
        item.qty +
        " = ₹" +
        (item.price * item.qty) +
        "%0A";

    });

    const total =
    cart.reduce(
        (sum,item) =>
        sum + item.price * item.qty,
        0
    );

    message +=
    "%0A💰 *Total: ₹" +
    total +
    "*%0A%0A";

    message +=
    "📍 Delivery Address: ";

    /*
    IMPORTANT:
    XXXXXXXXXX ko apne WhatsApp number se replace karein.
    Example: 919876543210
    */

    const phone = "91XXXXXXXXXX";

    window.open(
        "https://wa.me/" +
        phone +
        "?text=" +
        message,
        "_blank"
    );
}
