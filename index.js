// Load cart from local storage if it exists
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Function to add items to the cart
function addToCart(name, price) {
  const existingItem = cart.find((item) => item.name === name);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ name, price, quantity: 1 });
  }
  saveCart(); // Save to local storage
  updateCartDisplay();
  updateItemCount();
  showToast(`${name} added to cart`);
}

// Function to increase quantity
function increaseQuantity(name) {
  const item = cart.find((item) => item.name === name);
  if (item) {
    item.quantity += 1;
    saveCart();
    updateCartDisplay();
    updateItemCount();
  }
}

// Function to decrease quantity
function decreaseQuantity(name) {
  const item = cart.find((item) => item.name === name);
  if (item && item.quantity > 1) {
    item.quantity -= 1;
  } else {
    cart = cart.filter((cartItem) => cartItem.name !== name); // Remove item if quantity is 0
  }
  saveCart();
  updateCartDisplay();
  updateItemCount();
}

// Function to remove an item directly from the cart
function removeItem(name) {
  cart = cart.filter((item) => item.name !== name);
  saveCart();
  updateCartDisplay();
  updateItemCount();
  showToast(`${name} removed from cart`);
}

// Function to empty the cart
function emptyCart() {
  if (confirm("Are you sure you want to empty the cart?")) {
    cart = [];
    saveCart();
    updateCartDisplay();
    updateItemCount();
    showToast("Cart has been emptied.");
  }
}

// Function to save the cart to local storage
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Function to display items in the cart
function updateCartDisplay() {
  const cartItemsDiv = document.getElementById("cart-items");
  cartItemsDiv.innerHTML = ""; // Clear previous content
  const emptyButton = document.getElementById("cart-empty-button");
  emptyButton.style.display = "inline-block";

  if (cart.length === 0) {
    cartItemsDiv.innerHTML = "<p>Your cart is empty.</p>";
    emptyButton.style.display = "none";
    return;
  }

  // Display each item in the cart
  cart.forEach((item) => {
    const itemDiv = document.createElement("div");
    itemDiv.classList.add("cart-item");
    itemDiv.innerHTML = `
            <span>${item.name} - N${item.price} x ${item.quantity}</span>
            <div class="cart-controls">
                <button onclick="increaseQuantity('${item.name}')">+</button>
                <button onclick="decreaseQuantity('${item.name}')">-</button>
                <button onclick="removeItem('${item.name}')">🗑️</button>
            </div>
        `;
    cartItemsDiv.appendChild(itemDiv);
  });

  // Calculate total price
  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalDiv = document.createElement("div");
  totalDiv.textContent = `Total: N${total}`;
  cartItemsDiv.appendChild(totalDiv);
}

// Toast notification
function showToast(message) {
  const toastContainer = document.getElementById("toast-container");
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  toastContainer.appendChild(toast);
  setTimeout(() => {
    toast.classList.add("fade-out");
    toast.addEventListener("transitionend", () => toast.remove());
  }, 2000);
}

// Sync cart state across tabs
window.addEventListener("storage", (event) => {
  if (event.key === "cart") {
    cart = JSON.parse(event.newValue) || [];
    updateCartDisplay();
    updateItemCount();
  }
});

// Update item count displayed on the cart button
function updateItemCount() {
  // const itemCount = cart.length;
  // document.getElementById("item-count").textContent = itemCount;
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  document.getElementById("item-count").textContent = totalItems;
}

// Toggle cart visibility
function toggleCart() {
  const cartDiv = document.getElementById("cart");
  cartDiv.classList.toggle("active");
  const emptyButton = document.getElementById("cart-empty-button");
  cart.length == 0
    ? (emptyButton.disabled = true)
    : (emptyButton.disabled = false);
}

// Display the cart on page load and set item count
updateCartDisplay();
updateItemCount();
