let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Toggle cart display
function toggleCart() {
  document.getElementById("cart-container").classList.toggle("open");
}

// Update total item count in cart button
function updateItemCount() {
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  document.getElementById("item-count").textContent = totalItems;
}

// Add item to cart
function addToCart(name, price) {
  const existingItem = cart.find((item) => item.name === name);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ name, price, quantity: 1 });
  }
  saveCart();
  updateCartDisplay();
  updateItemCount();
  showToast(`${name} added to cart`);
}

// Remove item from cart
function removeItem(name) {
  cart = cart.filter((item) => item.name !== name);
  saveCart();
  updateCartDisplay();
  updateItemCount();
  showToast(`${name} removed from cart`);
}

// Empty the cart with confirmation
function emptyCart() {
  if (confirm("Are you sure you want to empty the cart?")) {
    cart = [];
    saveCart();
    updateCartDisplay();
    updateItemCount();
    showToast("Cart has been emptied.");
  }
}

// Save cart to local storage
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Display updated cart content
function updateCartDisplay() {
  const cartContent = document.getElementById("cart-content");
  cartContent.innerHTML =
    cart.length > 0
      ? cart
          .map(
            (item) =>
              `<div>${item.name} x ${item.quantity} - $${item.price}
            <button onclick="removeItem('${item.name}')">Remove</button>
        </div>`
          )
          .join("")
      : "Cart is empty";
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

// Show cart summary on hover
function showCartSummary() {
  const summaryDiv = document.getElementById("cart-summary");
  summaryDiv.innerHTML =
    cart.length > 0
      ? cart.map((item) => `${item.name} x ${item.quantity}`).join("<br>")
      : "Cart is empty";
  summaryDiv.style.display = "block";
}

// Hide cart summary on mouse out
function hideCartSummary() {
  document.getElementById("cart-summary").style.display = "none";
}

document.getElementById("cart-button").addEventListener("click", toggleCart);
document
  .getElementById("cart-button")
  .addEventListener("mouseover", showCartSummary);
document
  .getElementById("cart-button")
  .addEventListener("mouseout", hideCartSummary);

// Initialize cart display and item count on page load
updateCartDisplay();
updateItemCount();
