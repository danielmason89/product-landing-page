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
} from "firebase/auth";
const toolTips = document.querySelectorAll(".tt");
const clock = document.querySelector(".clock");
const firebaseConfig = {
  apiKey: "AIzaSyAtn6YjEQ8-AfXW2UmJN40jSLhCA-RkZq0",
  authDomain: "pokedex-shop-app.firebaseapp.com",
  projectId: "pokedex-shop-app",
  storageBucket: "pokedex-shop-app.appspot.com",
  messagingSenderId: "416207035121",
  appId: "1:416207035121:web:a7144500685f6c84a12750",
};
const errorMessageElement = document.getElementById("error-message");

// Init Firebase app
const app = initializeApp(firebaseConfig);

// Init Firebase services
const db = getFirestore(app);
const auth = getAuth(app);
// connectAuthEmulator(auth, "http://localhost:9899");

const monitorAuthState = async () => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log(user);
    } else {
    }
  });
};
monitorAuthState();

// ***Signup-Login-Logout Flow***
// SignUp
document.addEventListener("DOMContentLoaded", () => {
  const signupButton = document.getElementById("signup-button");
  if (signupButton) {
    signupButton.addEventListener("click", signupUser);
  }
  function signupUser(e) {
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

// Login
document.addEventListener("DOMContentLoaded", () => {
  const loginbtn = document.getElementById("loginbtn");
  const loginEmailPassword = async (e) => {
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
  };
  loginbtn.addEventListener("click", loginEmailPassword);
});

// Logout

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
