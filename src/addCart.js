export default function addCart() {
  $(document).ready(function () {
    let itemCount = localStorage.getItem("itemCount") || 0;
    updateCartTotal(itemCount);

    $(".addItemBtn").click(function () {
      itemCount++;
      updateCartTotal(itemCount);
      localStorage.setItem("itemCount", itemCount);

      const cartToast = new bootstrap.Toast($("#cartToast")[0]);
      cartToast.show();
    });

    $("#clearCartButton").click(function () {
      itemCount = 0;
      updateCartTotal(itemCount);
      localStorage.setItem("itemCount", itemCount);
    });

    function updateCartTotal(count) {
      $("#cartTotal").text(count);
    }
  });
}
