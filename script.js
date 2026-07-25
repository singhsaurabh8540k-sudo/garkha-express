
let cartCount = 0;

// Cart counter बनाएं
const cart = document.createElement("div");
cart.innerHTML = "🛒 Cart (0)";
cart.style.position = "fixed";
cart.style.top = "10px";
cart.style.right = "10px";
cart.style.background = "#16a34a";
cart.style.color = "white";
cart.style.padding = "10px 15px";
cart.style.borderRadius = "10px";
cart.style.fontWeight = "bold";
document.body.appendChild(cart);

// सभी Add to Cart बटन पर काम करें
document.querySelectorAll("button").forEach(button => {
  button.addEventListener("click", () => {
    cartCount++;
    cart.innerHTML = "🛒 Cart (" + cartCount + ")";
    alert("✅ Product Added to Cart");
  });
});
