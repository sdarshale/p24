/* eslint-disable  no-alert, no-unused-vars */

/* Paypal */
paypal
  .Marks({
    fundingSource: paypal.FUNDING.PAYPAL,
  })
  .render("#paypal-mark");

paypal
  .Buttons({
    fundingSource: paypal.FUNDING.PAYPAL,
    style: {
      label: "pay",
      color: "silver",
    },
    createOrder() {
      return fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // use the "body" param to optionally pass additional order information
        // like product skus and quantities
        body: JSON.stringify({
          cart: [
            {
              sku: "YOUR_PRODUCT_STOCK_KEEPING_UNIT",
              quantity: "YOUR_PRODUCT_QUANTITY",
            },
          ],
        }),
      })
      .then((response) => response.json())
      .then((order) => order.id);
    },
    onApprove(data, actions) {
      return fetch(`/api/orders/${data.orderID}/capture`, {
        method: "post",
      })
        .then((res) => res.json())
        .then((data) => {
          swal(
            "Order Captured!",
            `Id: ${data.id}, ${Object.keys(data.payment_source)[0]}, ${
              data.purchase_units[0].payments.captures[0].amount.currency_code
            } ${data.purchase_units[0].payments.captures[0].amount.value}`,
            "success"
          );
        })
        .catch(console.error);
    },
  })
  .render("#paypal-btn");

/* P24 */
paypal
  .Marks({
    fundingSource: paypal.FUNDING.P24,
  })
  .render("#p24-mark");

paypal
  .PaymentFields({
    fundingSource: paypal.FUNDING.P24,
    style: {},
    fields: {
      name: {
        value: "",
      },
    },
  })
  .render("#p24-container");

paypal.Buttons({
  fundingSource: paypal.FUNDING.P24,
  style: {
    label: "pay",
  },
  createOrder() {
    return fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // use the "body" param to optionally pass additional order information
      // like product skus and quantities
      body: JSON.stringify({
        cart: [
          {
            sku: "YOUR_PRODUCT_STOCK_KEEPING_UNIT",
            quantity: "YOUR_PRODUCT_QUANTITY",
          },
        ],
      }),
    })
    .then((response) => response.json())
    .then((order) => order.id);
  },
  onApprove(data) {
    return fetch(`/api/orders/${data.orderID}/capture`, {
      method: "post",
    })
      .then((res) => res.json())
      .then((data) => {
        swal(
          "Order Captured!",
          `Id: ${data.id}, ${Object.keys(data.payment_source)[0]}, ${
            data.purchase_units[0].payments.captures[0].amount.currency_code
          } ${data.purchase_units[0].payments.captures[0].amount.value}`,
          "success"
        );
      })
      .catch(console.error);
  },
  onCancel(data, actions) {
    swal("Order Canceled", `ID: ${data.orderID}`, "warning");
  },
  onError(err) {
    console.error(err);
  },
})
.render("#p24-btn");


document.getElementById("p24-btn").style.display = "none";
document.getElementById("p24-container").style.display = "none";

/* Radio buttons */
// Listen for changes to the radio buttons
document.querySelectorAll("input[name=payment-option]").forEach((el) => {
  // handle button toggles
  el.addEventListener("change", (event) => {
    switch (event.target.value) {
      case "paypal":
        document.getElementById("p24-container").style.display = "none";
        document.getElementById("p24-btn").style.display = "none";

        document.getElementById("paypal-btn").style.display = "block";

        break;
      case "p24":
        document.getElementById("p24-container").style.display = "block";
        document.getElementById("p24-btn").style.display = "block";

        document.getElementById("paypal-btn").style.display = "none";
        break;

      default:
        break;
    }
  });
});
