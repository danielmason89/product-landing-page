import { renderCart } from "./shoppingCart";

export default function addCart() {
  $(document).ready(function () {
    let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

    $(".addItemBtn").click(function () {
      const card = $(this).closest(".card");
      const itemImages = card
        .find("img")
        .map(function () {
          return $(this).attr("src");
        })
        .get();

      const itemTitle = card
        .closest(".container")
        .prev("header")
        .find("h1")
        .text()
        .trim();
      let itemPrice = card.find(".card-text").text();

      // Extract the numeric part from the price string
      const priceNumeric = itemPrice.replace(/[^0-9.]/g, "");
      itemPrice = parseFloat(priceNumeric);

      let existingItem = cartItems.find((item) => item.title === itemTitle);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cartItems.push({
          title: itemTitle,
          images: itemImages,
          price: itemPrice,
          quantity: 1,
        });
      }

      console.log("Items after adding to cart:", cartItems);
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      updateCartTotal(cartItems);
      renderCart();
      // Show toast notification
      const cartToast = new bootstrap.Toast($("#cartToast")[0]);
      cartToast.show();
    });

    function updateCartTotal(cartItems) {
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
  });
}
