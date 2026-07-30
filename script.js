// ===============================
// SUPABASE CONFIG
// ===============================

const SUPABASE_URL = "PASTE_YOUR_SUPABASE_URL_HERE";

const SUPABASE_KEY = "PASTE_YOUR_SUPABASE_PUBLISHABLE_KEY_HERE";

const db = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);


// ===============================
// DELIVERY AREA
// ===============================

// Abhi example ke liye Garkha rakha hai.
// Baad me apne delivery area ke naam add kar sakte ho.

const ALLOWED_DISTRICTS = [
  "saran",
  "chhapra",
  "garkha"
];


// ===============================
// CART
// ===============================

let cart = [];

let latitude = null;
let longitude = null;


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

  alert(name + " cart me add ho gaya ✅");
}


function increaseQty(index){

  cart[index].qty++;

  updateCart();
}


function decreaseQty(index){

  cart[index].qty--;

  if(cart[index].qty <= 0){
    cart.splice(index,1);
  }

  updateCart();
}


function updateCart(){

  const cartCount = cart.reduce(
    (sum,item) => sum + item.qty,
    0
  );

  document.getElementById("cartCount").innerText = cartCount;


  let itemsHTML = "";
  let total = 0;


  if(cart.length === 0){

    itemsHTML = "No items added";

  }else{

    cart.forEach((item,index)=>{

      const itemTotal = item.price * item.qty;

      total += itemTotal;

      itemsHTML += `

        <div class="cartRow">

          <div>
            <b>${item.name}</b>
            <br>
            ₹${item.price} × ${item.qty}
          </div>

          <div class="qty">

            <button onclick="decreaseQty(${index})">
              −
            </button>

            ${item.qty}

            <button onclick="increaseQty(${index})">
              +
            </button>

          </div>

        </div>

      `;

    });

  }


  document.getElementById("cartItems").innerHTML = itemsHTML;

  document.getElementById("total").innerText = total;

}


// ===============================
// CART OPEN/CLOSE
// ===============================

function toggleCart(){

  const box = document.getElementById("cartBox");

  if(box.style.display === "block"){
    box.style.display = "none";
  }else{
    box.style.display = "block";
  }

}


// ===============================
// CHECKOUT
// ===============================

function openCheckout(){

  if(cart.length === 0){

    alert("Pehle grocery cart me add karein.");

    return;
  }

  document.getElementById("checkoutBox").style.display = "block";

}


function closeCheckout(){

  document.getElementById("checkoutBox").style.display = "none";

}


// ===============================
// GPS LOCATION
// ===============================

function getLocation(){

  const status =
    document.getElementById("locationStatus");


  if(!navigator.geolocation){

    status.innerText =
      "Aapke phone me location support nahi hai.";

    return;
  }


  status.innerText =
    "📍 Location mil rahi hai...";


  navigator.geolocation.getCurrentPosition(

    function(position){

      latitude = position.coords.latitude;

      longitude = position.coords.longitude;


      status.innerHTML =
        "✅ Location selected<br>" +
        "Lat: " + latitude.toFixed(5) +
        "<br>" +
        "Lng: " + longitude.toFixed(5);

    },

    function(error){

      status.innerText =
        "❌ Location permission allow karein.";

    },

    {
      enableHighAccuracy:true,
      timeout:10000
    }

  );

}


// ===============================
// PLACE ORDER
// ===============================

async function placeOrder(){

  if(cart.length === 0){

    alert("Cart empty hai.");

    return;
  }


  const name =
    document.getElementById("customerName").value.trim();


  const phone =
    document.getElementById("phone").value.trim();


  const district =
    document.getElementById("district").value
    .trim()
    .toLowerCase();


  const address =
    document.getElementById("address").value.trim();


  // Validation

  if(!name){

    alert("Name enter karein.");

    return;
  }


  if(!phone || phone.length < 10){

    alert("Valid mobile number enter karein.");

    return;
  }


  if(!district){

    alert("District enter karein.");

    return;
  }


  if(!address){

    alert("Delivery address enter karein.");

    return;
  }


  // District check

  if(!ALLOWED_DISTRICTS.includes(district)){

    alert(
      "Sorry! Abhi Garkha Express is area me delivery nahi karta."
    );

    return;
  }


  // GPS check

  if(latitude === null || longitude === null){

    alert(
      "Order place karne se pehle 'Use My Current Location' dabayein."
    );

    return;
  }


  // Calculate total

  let total = 0;

  cart.forEach(item => {

    total += item.price * item.qty;

  });


  // Database order

  const orderData = {

    customer_name:name,

    phone:phone,

    address:address,

    district:district,

    latitude:latitude,

    longitude:longitude,

    items:cart,

    total:total,

    payment_method:"Cash on Delivery",

    status:"New"

  };


  const { data, error } =
    await db
      .from("orders")
      .insert([orderData])
      .select()
      .single();


  if(error){

    console.error(error);

    alert(
      "Order save nahi hua.\n\n" +
      error.message
    );

    return;
  }


  // Order successful

  alert(
    "🎉 Order Successfully Placed!\n\n" +

    "Order ID: #" + data.id +
    "\nTotal: ₹" + total
  );


  // WhatsApp message

  let message =
    "🛒 Garkha Express Order\n\n" +

    "Order ID: #" + data.id +
    "\n" +

    "Customer: " + name +
    "\n" +

    "Phone: " + phone +
    "\n" +

    "Address: " + address +
    "\n" +

    "District: " + district +
    "\n\n";


  cart.forEach(item => {

    message +=
      item.name +
      " x " +
      item.qty +
      " = ₹" +
      (item.price * item.qty) +
      "\n";

  });


  message +=
    "\nTotal: ₹" + total +

    "\n\n📍 Location:" +

    "\nhttps://www.google.com/maps?q=" +

    latitude +
    "," +
    longitude;


  const whatsappNumber =
    "91XXXXXXXXXX";


  window.open(
    "https://wa.me/" +
    whatsappNumber +
    "?text=" +
    encodeURIComponent(message),

    "_blank"
  );


  // Clear

  cart = [];

  updateCart();

  closeCheckout();

  document.getElementById("customerName").value = "";

  document.getElementById("phone").value = "";

  document.getElementById("district").value = "";

  document.getElementById("address").value = "";

  latitude = null;

  longitude = null;

}
