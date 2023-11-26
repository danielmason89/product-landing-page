import { updateCartTotal } from "./updateCartTotal";

export function renderCart() {
  let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
  console.log("Rendering cart, items:", cartItems);
  let $shoppingCart = $("#shoppingCart");
  $shoppingCart.empty();

  let totalCost = 0; // Initialize total cost

  cartItems.forEach((item) => {
    // Calculate the cost for each item (price * quantity)
    let itemCost = parseFloat(item.price) * item.quantity;
    totalCost += itemCost; // Add to total cost

    const $cartItem = $(`
        <div class="cart-item d-flex py-2 px-2">
          <img src="${item.images[0]}" alt="${item.title}" class="rounded cart-item-img me-4" style="max-width: 25%; height: auto">
          <section class="cart-item-details">
            <h5>${item.title}</h5>
            <p>Price: $${item.price}</p>
            <p>Total Quantity: <span class="item-quantity">${item.quantity}</span></p>
            <button class="btn btn-md btn-secondary decrease-quantity" data-title="${item.title}">-</button>
            <button class="btn btn-md btn-primary increase-quantity" data-title="${item.title}">+</button>
          </section>
        </div>
      `);

    $cartItem.find(".increase-quantity").click(function () {
      item.quantity++;
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      renderCart();
      updateCartTotal(cartItems);
    });

    $cartItem.find(".decrease-quantity").click(function () {
      if (item.quantity > 1) {
        item.quantity--;
      } else {
        cartItems = cartItems.filter((i) => i.title !== item.title);
      }
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      renderCart();
      updateCartTotal(cartItems);
    });

    $shoppingCart.append($cartItem);
  });
  $("#totalCost").text(`Total Cost: $${totalCost.toFixed(2)}`);
  updateCartTotal(cartItems);
}

export function clearCart(updateCartTotal) {
  let cartItems = [];
  localStorage.setItem("cartItems", JSON.stringify(cartItems));
  console.log("Cart cleared, current items:", cartItems);
  updateCartTotal(cartItems);
  // Also, ensure to re-render the cart to reflect the changes
  renderCart();
}

export function renderCheckoutCart() {
  let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
  let $checkoutCart = $("#checkoutCart"); // Assume this is the ID of your cart container on the checkout page
  let $totalItemsBadge = $(".total-items-badge");

  let totalCost = 0;
  let totalQuantity = 0;

  cartItems.forEach((item) => {
    let itemCost = item.price * item.quantity;
    totalCost += itemCost;
    totalQuantity += item.quantity;

    const $cartItem = $(`
        <li class="list-group-item d-flex justify-content-between lh-sm">
          <div>
            <h6 class="my-0">${item.title}</h6>
            <small class="text-body-secondary">Quantity: ${
              item.quantity
            }</small>
          </div>
          <span class="text-body-secondary">$${(
            item.price * item.quantity
          ).toFixed(2)}</span>
        </li>
      `);

    $checkoutCart.append($cartItem);
    // Update the total items badge
    $totalItemsBadge.text(totalQuantity);
  });

  // Append the total cost
  $checkoutCart.append(`
      <li class="list-group-item d-flex justify-content-between">
        <span>Total (USD)</span>
        <strong>$${totalCost.toFixed(2)}</strong>
      </li>
    `);
}

// Call this function on page load or when the checkout page is rendered
$(document).ready(function () {
  renderCheckoutCart();
});
