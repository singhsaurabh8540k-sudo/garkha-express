let cart = [];

document.querySelectorAll(".card button").forEach((btn) => {
  btn.addEventListener("click", function () {
    const card = this.parentElement;
    const name = card.querySelector("h3").innerText;
    const price = card.querySelector(".price").innerText;

    cart.push({ name, price });

    document.getElementById("cartCount").innerText = cart.length;

    let items = "";
    let total = 0;

    cart.forEach((item) => {
      items += item.name + " - " + item.price + "<br>";
      total += parseInt(item.price.replace(/[^\d]/g, ""));
    });

    document.getElementById("cartItems").innerHTML = items;
    document.getElementById("total").innerText = total;
  });
});

function toggleCart() {
  const box = document.getElementById("cartBox");
  box.style.display = box.style.display === "block" ? "none" : "block";
}

function sendWhatsApp() {
  let message = "🛒 Garkha Express Order%0A%0A";

  cart.forEach((item) => {
    message += item.name + " - " + item.price + "%0A";
  });

  message += "%0ATotal: ₹" + document.getElementById("total").innerText;

  window.open("https://wa.me/91XXXXXXXXXX?text=" + message, "_blank");
}
