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
import { updateCartTotal } from "./updateCartTotal";
import { renderCart, clearCart } from "./shoppingCart.js";
import { initializeApp } from "firebase/app";
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
import {
  getAuth,
  connectAuthEmulator,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
// Init Firebase app
const firebaseApp = initializeApp({
  apiKey: "AIzaSyAtn6YjEQ8-AfXW2UmJN40jSLhCA-RkZq0",
  authDomain: "pokedex-shop-app.firebaseapp.com",
  projectId: "pokedex-shop-app",
  storageBucket: "pokedex-shop-app.appspot.com",
  messagingSenderId: "416207035121",
  appId: "1:416207035121:web:a7144500685f6c84a12750",
});

// Init Firebase services
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);
// connectAuthEmulator(auth, "http://localhost:9899");

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

$(document).ready(function () {
  $("#clearCartButton").click(function () {
    clearCart(updateCartTotal, renderCart);
  });
});
// Collection ref
const colRef = collection(db, "pokedex");

// queries
const q = query(colRef, orderBy("createdAt"));

// Get Collection Data - real time collection data,(subscription)
onSnapshot(colRef, (snapshot) => {
  let pokedex = [];
  snapshot.docs.forEach((doc) => {
    pokedex.push({ ...doc.data(), id: doc.id });
  });
  console.log(pokedex);
});

// Get Collection Data - real time collection data,(subscription) - query
onSnapshot(q, (snapshot) => {
  let pokedex = [];
  snapshot.docs.forEach((doc) => {
    pokedex.push({ ...doc.data(), id: doc.id });
  });
  console.log(pokedex);
});

// Adding documents - real time collection data
// const addBookForm = document.querySelector(".add");
// addBookForm.addEventListener("submit", (e) => {
//   e.preventDefault;
//   addDoc(colRef, {
//     model: addPokedexForm.model.value,
//     version: addPokedexForm.version.value,
//     createdAt: serverTimestamp(),
//   }).then(() => {
//     addBookForm.reset();
//   });
// });

// Delete documents
// const deleteBookForm = document.querySelector(".delete");
// deleteBookForm.deleteEventListener("submit", (e) => {
//   e.preventDefault;
//   const docRef = doc(db, "pokedex", deleteBookForm.id.value);
//   deleteDoc(docRef).then(() => {
//     deleteBookForm.requestFullscreen();
//   });
// });

// Get a single id document
const docRef = doc(db, "pokedex", "2X3qaNxZ7DN7WDsf9FNK");

// getDoc(docRef).then((doc) => {
//   console.log(doc.data(), doc.id);
// });

// Realtime listener
onSnapshot(docRef, (doc) => {
  console.log(doc.data(), doc.id);
});

// Update a document
// const updateForm = document.querySelector(".update");
// updateForm.addEventListener("submit", (e) => {
//   e.preventDefault();

//   const docRef = doc(db, "pokedex", updateForm.id.value);
//   updateDoc(docRef, {
//     version: "updated title",
//   }).then(() => {
//     updateForm.reset();
//   });
// });
