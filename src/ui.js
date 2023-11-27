import { AuthErrorCodes } from "firebase/auth";
import emailjs from "@emailjs/browser";

// Clock/Misc UI
export const toolTips = document.querySelectorAll(".tt");
export const clock = document.querySelector(".clock");

// Email JS
emailjs.init("teumzvK_dd_tm2EDs");

// Auth Flow UI
// To get to the auth flow
export const loginButton = document.querySelector("#login-button");
export const logoutButton = document.querySelector("#logout-button");
export const signupButton = document.querySelector("#signup-button");
export const cart = document.querySelector("#cart");
export const welcomeMessage = document.querySelector("#welcome-message");
export const errorMessageElement = document.querySelector("#error-message");
// Going through the Auth Flow
export const formLoginBtn = document.getElementById("login-btn");
export const formSignupBtn = document.getElementById("signup-btn");

export const showLoginState = (user) => {
  lblAuthState.innerHTML = `You're logged in as ${user.displayName} (uid: ${user.uid}, email: ${user.email}) `;
};

// *** Clock Logic***
toolTips.forEach((t) => {
  new bootstrap.Tooltip(t);
});

const tick = () => {
  const now = new Date();

  const html = `
  <span>${dateFns.format(now, "MMMM dddd Do / YY")}</span>
  <span>${dateFns.format(now, "h:mm a")}</span>
  `;

  clock.innerHTML = html;
};

setInterval(tick, 1000);

// ***Quiz Logic***
document.addEventListener("DOMContentLoaded", function () {
  const quizForm = document.querySelector(".quiz-form");
  const correctAnswers = ["B", "B", "B", "B"];
  const result = document.querySelector(".result");
  if (quizForm) {
    quizForm.addEventListener("submit", (e) => {
      e.preventDefault();

      let score = 0;
      const userAnswers = [
        quizForm.q1.value,
        quizForm.q2.value,
        quizForm.q3.value,
        quizForm.q4.value,
      ];
      // Check answer
      userAnswers.forEach((answer, index) => {
        if (answer === correctAnswers[index]) {
          score += 25;
        }
      });
      // show result
      scrollTo(0, 0);

      result.classList.remove("d-none");
      let userResult = 0;
      const timer = setInterval(() => {
        {
          result.querySelector("span").textContent = `${userResult}%`;
          if (userResult === score) {
            clearInterval(timer);
          } else {
            userResult++;
          }
        }
      }, 10);
    });
  }
});

// ***Send Email Logic***
document.addEventListener("DOMContentLoaded", function () {
  const questionForm = document.getElementById("contact-form");

  if (questionForm) {
    questionForm.addEventListener("submit", function (e) {
      e.preventDefault(); // Prevent the default form submission
      sendMail();
    });
  }
});

function validateForm(params) {
  // Add your validation logic here
  // Example: Check if the name, email, and message are not empty
  return params.name && params.email && params.message;
}

function sendMail() {
  let params = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    message: document.getElementById("message").value,
  };
  if (!validateForm(params)) {
    alert("Please fill in all the fields.");
    return; // Stop the function if validation fails
  }
  const serviceID = "service_53r37qr";
  const templateID = "template_3ln9oxq";

  emailjs
    .send(serviceID, templateID, params)
    .then((res) => {
      console.log("success", res.status);
      // Clear the form fields only after successful submission
      document.getElementById("name").value = "";
      document.getElementById("email").value = "";
      document.getElementById("message").value = "";
      alert("Your Message sent successfully");
    })
    .catch((err) => console.log(err));
}

// ***Checkout Form Validation***
export function initializeFormValidation() {
  const form = document.getElementById("checkoutForm");
  const ccNumber = document.getElementById("cc-number");

  if (form && ccNumber) {
    form.addEventListener(
      "submit",
      function (event) {
        handleFormSubmit(event, form, ccNumber);
      },
      false
    );
  }
}

function handleFormSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const ccNumber = document.getElementById("cc-number");

  // Validate Credit Card Number
  if (!validateCreditCardNumber(ccNumber.value)) {
    ccNumber.classList.add("is-invalid");
  } else {
    ccNumber.classList.remove("is-invalid");
  }

  if (form.checkValidity() && validateCreditCardNumber(ccNumber.value)) {
    const orderDetails = getOrderDetails();

    console.log("Order Details:", orderDetails);
    // Prepare form data for email
    const formData = {
      firstName: form.firstName.value,
      lastName: form.lastName.value,
      email: form.email.value,
      address: form.address.value,
      phoneNumber: form.phoneNumber.value,
      ccNumber: ccNumber.value.slice(-4), // Masked CC number
      orderDetails: orderDetails.details, // Get order details
      totalCost: orderDetails.totalCost,
    };

    console.log("FormData:", formData);
    // Send email
    emailjs.send("service_yrwx9x4", "template_tx9keul", formData).then(
      function (response) {
        console.log("SUCCESS!", response.status, response.text);
        // Handle success (show confirmation message, etc.)

        // Clear the form
        form.reset();
        form.classList.remove("was-validated");

        // Empty the cart in local storage
        localStorage.setItem("cartItems", JSON.stringify([]));

        // Redirect to the home page (index.html)
        window.location.href = "index.html";
      },
      function (error) {
        console.log("FAILED...", error);
        // Handle errors (show error message, etc.)
      }
    );
  } else {
    form.classList.add("was-validated"); // Show validation errors
  }
}

function getOrderDetails() {
  let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
  let details = "";
  let totalCost = 0;

  cartItems.forEach((item) => {
    let itemTotal = item.price * item.quantity;
    totalCost += itemTotal;
    details += `${item.title} - Quantity: ${
      item.quantity
    }, Price: $${item.price.toFixed(2)} each, Total: $${itemTotal.toFixed(
      2
    )}\n`;
  });

  return { details, totalCost: totalCost.toFixed(2) };
}

function validateCreditCardNumber(number) {
  const regex = /^[0-9]{16}$/;
  return regex.test(number);
}
