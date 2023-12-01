import "./css/style.css";
import {
  loginButton,
  logoutButton,
  signupButton,
  cart,
  welcomeMessage,
  errorMessageElement,
  formLoginBtn,
  formSignupBtn,
} from "./ui";
import addCart from "./addCart.js";
import { renderCart } from "./shoppingCart.js";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
import {
  getFirestore,
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  query,
  doc,
  where,
  orderBy,
  serverTimestamp,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import emailjs from "@emailjs/browser";
import {
  getAuth,
  connectAuthEmulator,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { getDatabase, ref, set, push } from "firebase/database";
// Init Firebase app
const firebaseApp = initializeApp({
  apiKey: "AIzaSyAtn6YjEQ8-AfXW2UmJN40jSLhCA-RkZq0",
  authDomain: "pokedex-shop-app.firebaseapp.com",
  databaseURL: "https://pokedex-shop-app-default-rtdb.firebaseio.com",
  projectId: "pokedex-shop-app",
  storageBucket: "pokedex-shop-app.appspot.com",
  messagingSenderId: "416207035121",
  appId: "1:416207035121:web:a7144500685f6c84a12750",
  databaseURL: "pokedex-shop-app-default-rtdb.firebaseio.com",
});
emailjs.init("teumzvK_dd_tm2EDs");

// const appCheck = initializeAppCheck(firebaseApp, {
//   provider: new ReCaptchaV3Provider("abcdefghijklmnopqrstuvwxy-1234567890abcd"),

//   // Optional argument. If true, the SDK automatically refreshes App Check
//   // tokens as needed.
//   isTokenAutoRefreshEnabled: true,
// });

// Init Firebase services
const analytics = getAnalytics(firebaseApp);
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);
// connectAuthEmulator(auth, "http://localhost:9899");

console.log("analytics", analytics);

// ***Signup-Login-Logout Flow***
// Login
document.addEventListener("DOMContentLoaded", () => {
  if (formLoginBtn) {
    formLoginBtn.addEventListener("click", loginEmailPassword);
  }
  async function loginEmailPassword(e) {
    e.preventDefault();
    const loginEmail = document.getElementById("email").value;
    const loginPassword = document.getElementById("password").value;

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        loginEmail,
        loginPassword
      );
      const user = userCredential.user;
      console.log("User logged in:", user);
      document.querySelector("form").reset();
      errorMessageElement.textContent = "";
      // Redirect to login or other page if needed
      window.location.href = "shop.html";
    } catch (error) {
      console.error(error.message);
      // Handle specific error messages
      switch (error.code) {
        case "auth/invalid-email":
          errorMessageElement.textContent = "Invalid email address.";
          break;
        case "auth/user-not-found":
          errorMessageElement.textContent = "User not found.";
          break;
        case "auth/wrong-password":
          errorMessageElement.textContent = "Incorrect password.";
          break;
        default:
          errorMessageElement.textContent =
            "An error occurred. Please try again.";
      }
    }
  }
});

// SignUp
document.addEventListener("DOMContentLoaded", () => {
  if (formSignupBtn) {
    formSignupBtn.addEventListener("click", signupUser);
  }
  async function signupUser(e) {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const fullname = document.getElementById("fullname").value;

    // Basic validation
    if (
      !validateEmail(email) ||
      !validatePassword(password) ||
      !validateField(fullname)
    ) {
      errorMessageElement.textContent =
        "Invalid input. Please check your data.";
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // User created successfully
        console.log("User created:", userCredential.user);
        // Reset form and clear error message
        document.querySelector("form").reset();
        errorMessageElement.textContent = "";
        // Redirect to login or other page if needed
        window.location.href = "shop.html";
      })
      .catch((err) => {
        console.error(err.message);
        // Handle specific error messages
        switch (err.code) {
          case "auth/email-already-in-use":
            errorMessageElement.textContent = "Email is already in use.";
            break;
          case "auth/weak-password":
            errorMessageElement.textContent = "Password is too weak.";
            break;
          default:
            errorMessageElement.textContent =
              "An error occurred. Please try again.";
        }
      });
  }
});

function validateEmail(email) {
  const emailRegex = /^[^@]+@\w+(\.\w+)+\w$/;
  return emailRegex.test(email);
}

function validatePassword(password) {
  return password.length >= 6;
}

function validateField(field) {
  return field != null && field.trim().length > 0;
}

// Logout
document.addEventListener("DOMContentLoaded", () => {
  if (logoutButton) {
    logoutButton.addEventListener("click", logout);
  }
  async function logout() {
    await signOut(auth);
  }
});

// Function to hide an element
function hideElement(element) {
  element.classList.add("hidden");
}

// Function to show an element
function showElement(element) {
  element.classList.remove("hidden");
}

// Function to hide UI elements
function hideElements() {
  if (loginButton) hideElement(loginButton);
  if (signupButton) hideElement(signupButton);
  if (welcomeMessage) showElement(welcomeMessage);
  if (logoutButton) showElement(logoutButton);
  if (cart) showElement(cart);
}

// Function to show UI elements
function showElements() {
  if (loginButton) showElement(loginButton);
  if (signupButton) showElement(signupButton);
  if (welcomeMessage) hideElement(welcomeMessage);
  if (logoutButton) hideElement(logoutButton);
  if (cart) hideElement(cart);
}

const monitorAuthState = async () => {
  onAuthStateChanged(auth, (user) => {
    const loginButton = document.getElementById("login-button");
    const logoutButton = document.getElementById("logout-button");
    if (user) {
      hideElements();
      console.log(user);
    } else {
      showElements();
    }
  });
};
monitorAuthState();

// Update the onAuthStateChanged callback
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in
    if (logoutButton) logoutButton.style.display = "block"; // Show the logout button
    if (loginButton) loginButton.style.display = "none"; // Hide the login button
    if (signupButton) signupButton.style.display = "none"; // Hide the signup button
  } else {
    // User is signed out
    if (logoutButton) logoutButton.style.display = "none"; // Hide the logout button
    if (loginButton) loginButton.style.display = "block"; // Show the login button
    if (signupButton) signupButton.style.display = "block"; // Show the signup button
  }
});

// ***Shop Functionality***
// Adding an item to the cart
$(document).ready(function () {
  addCart();

  $("#exampleModal").on("show.bs.modal", function () {
    renderCart();
  });
});

// Rendering an items in the cart
$("#exampleModal").on("show.bs.modal", function () {
  console.log("Modal is being shown. Calling renderCart...");
  renderCart();
});

$(document).ready(function () {
  // Assuming renderCart is imported or defined in this scope
  renderCart();
});

// *** Firebase Realtime Database logic
// Collection ref
const realtimeDatabase = getDatabase();
console.log("realtimeData:", realtimeDatabase);
// const reference = ref(realtimeDatabase, "users/" + userId);

// function writeUserData(userId, email) {
//   set(reference, {
//     email: email,
//   });
// }

// ***Checkout Form Validation & Firebase Realtime Database Implementation***
function initializeFormValidation() {
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

// Checkout Form Validation
document.addEventListener("DOMContentLoaded", function () {
  initializeFormValidation();
});

function savePurchaseToDatabase(userId, formData) {
  const db = getDatabase();
  const purchaseRef = ref(db, "purchases/" + userId);
  console.log("purchaseRef:", purchaseRef);
  const newPurchaseRef = push(purchaseRef);
  return set(newPurchaseRef, formData);
}

function checkFormValidity() {
  const form = document.getElementById("checkoutForm");

  // Individual field validation
  const isValidFirstName = form.firstName.value.trim() !== "";
  const isValidLastName = form.lastName.value.trim() !== "";
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.value);
  const isValidPhoneNumber = /^\+?\d{10,15}$/.test(form.phoneNumber.value); // Adjust regex according to phone number format you expect
  const isValidAddress = form.address.value.trim() !== "";
  const isValidCCName = form["cc-name"].value.trim() !== "";
  const isValidCCNumber = validateCreditCardNumber(form["cc-number"].value);
  const isValidCCExpiration = validateExpirationDate(
    form["cc-expiration"].value
  );
  const isValidCCCVV = /^\d{3,4}$/.test(form["cc-cvv"].value); // 3 or 4 digits CVV

  // Mark fields as invalid if necessary
  updateFieldValidity(form.firstName, isValidFirstName);
  updateFieldValidity(form.lastName, isValidLastName);
  updateFieldValidity(form.email, isValidEmail);
  updateFieldValidity(form.phoneNumber, isValidPhoneNumber);
  updateFieldValidity(form.address, isValidAddress);
  updateFieldValidity(form["cc-name"], isValidCCName);
  updateFieldValidity(form["cc-number"], isValidCCNumber);
  updateFieldValidity(form["cc-expiration"], isValidCCExpiration);
  updateFieldValidity(form["cc-cvv"], isValidCCCVV);

  // Return overall form validity
  return (
    isValidFirstName &&
    isValidLastName &&
    isValidEmail &&
    isValidPhoneNumber &&
    isValidAddress &&
    isValidCCName &&
    isValidCCNumber &&
    isValidCCExpiration &&
    isValidCCCVV
  );
}

function updateFieldValidity(field, isValid) {
  if (isValid) {
    field.classList.remove("is-invalid");
  } else {
    field.classList.add("is-invalid");
  }
}

// Validate Credit Card Number
function validateCreditCardNumber(number) {
  const regex = /^[0-9]{16}$/;
  return regex.test(number);
}

// Validate Expiration Date
function validateExpirationDate(date) {
  const regex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
  const isValidFormat = regex.test(date);

  if (!isValidFormat) return false;

  const currentDate = new Date();
  const [month, year] = date.split("/").map((num) => parseInt(num, 10));
  const expirationDate = new Date(`20${year}`, month - 1);

  return expirationDate > currentDate;
}

async function handleFormSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const ccNumber = document.getElementById("cc-number");
  const ccExpiration = document.getElementById("cc-expiration");

  let isValid = true;

  // Validate Credit Card Number
  if (!validateCreditCardNumber(ccNumber.value)) {
    ccNumber.classList.add("is-invalid");
    isValid = false;
  } else {
    ccNumber.classList.remove("is-invalid");
  }

  // Validate Expiration Date
  if (!validateExpirationDate(ccExpiration.value)) {
    ccExpiration.classList.add("is-invalid");
    isValid = false;
  } else {
    ccExpiration.classList.remove("is-invalid");
  }

  if (checkFormValidity() && validateCreditCardNumber(ccNumber.value)) {
    const orderDetails = getOrderDetails();
    const userId = auth.currentUser ? auth.currentUser.uid : null;
    if (!userId) {
      // Handle the case where the user is not logged in
      console.error("User is not authenticated");
      return;
    }

    if (!checkFormValidity() || !isValid) {
      return;
    }

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
      timestamp: serverTimestamp(), // Firebase server timestamp
    };

    // Save to database
    savePurchaseToDatabase(userId, formData)
      .then(() => {
        console.log("Purchase data saved successfully");
        // Continue with email sending and form reset
        emailjs
          .send("service_yrwx9x4", "template_tx9keul", formData)
          .then((response) => {
            console.log("Email sent successfully", response);
            form.reset();
            localStorage.setItem("cartItems", JSON.stringify([]));
            // Inside your handleFormSubmit function, after the email sending promise is resolved
            window.location.href = "index.html?purchase=success";
          })
          .catch((error) => console.error("Email sending failed", error));
      })
      .catch((error) => console.error("Error saving purchase data:", error));
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

// // ***Firestore Database Logic-Testing
// // Collection ref
// const colRef = collection(db, "pokedex");

// // queries
// const q = query(colRef, orderBy("createdAt"));

// // Get Collection Data - real time collection data,(subscription)
// onSnapshot(colRef, (snapshot) => {
//   let pokedex = [];
//   snapshot.docs.forEach((doc) => {
//     pokedex.push({ ...doc.data(), id: doc.id });
//   });
//   console.log(pokedex);
// });

// // Get Collection Data - real time collection data,(subscription) - query
// onSnapshot(q, (snapshot) => {
//   let pokedex = [];
//   snapshot.docs.forEach((doc) => {
//     pokedex.push({ ...doc.data(), id: doc.id });
//   });
//   console.log(pokedex);
// });

// // Get a single id document
// const docRef = doc(db, "pokedex", "2X3qaNxZ7DN7WDsf9FNK");

// // Realtime listener
// onSnapshot(docRef, (doc) => {
//   console.log(doc.data(), doc.id);
// });
