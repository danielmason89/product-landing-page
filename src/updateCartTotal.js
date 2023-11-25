export function updateCartTotal(cartItems) {
  if (cartItems.length === 0) {
    // If there are no items in the cart, display nothing or 0
    $("#cartTotal").text("");
  } else {
    // If there are items in the cart, calculate the total quantity
    let totalQuantity = cartItems.reduce(
      (total, item) => total + item.quantity,
      0
    );
    $("#cartTotal").text(totalQuantity);
  }
}
