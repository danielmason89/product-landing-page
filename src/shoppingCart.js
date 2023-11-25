import { updateCartTotal } from "./updateCartTotal";

export function renderCart() {
  let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
  let $shoppingCart = $("#shoppingCart");
  $shoppingCart.empty();

  cartItems.forEach((item) => {
    const $cartItem = $(`
        <div class="cart-item d-flex py-2 px-2">
          <img src="${item.images[0]}" alt="${item.title}" class="rounded cart-item-img me-4" style="max-width: 25%; height: auto">
          <section class="cart-item-details">
            <h5>${item.title}</h5>
            <p>Price: ${item.price}</p>
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
  updateCartTotal(cartItems);
}

export function clearCart() {
  let cartItems = [];
  localStorage.setItem("cartItems", JSON.stringify(cartItems));
  updateCartTotal(cartItems); // Update the cart total
  renderCart(); // Update the UI to reflect the empty cart
}
