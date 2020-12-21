// create constant we need.
const rememberDiv = document.querySelector(".remember");
const forgetDiv = document.querySelector(".forget");
const form = document.querySelector("form");
const nameInput = document.querySelector("#entername");
const submitBtn = document.querySelector("#submitname");
const forgetBtn = document.querySelector("#forgetname");

const h1 = document.querySelector("h1");
const personalGreeting = document.querySelector(".personal-greeting");

// stop to send when button is pressed.
form.addEventListener("submit", function(e) {
    e.preventDefault();
})

// run the function when 'say hello' button is clicked.
submitBtn.addEventListener("click", function() {
    // store the name inputed to the web storage.
    localStorage.setItem("name", nameInput.value);
    // arrange the greeting by the name.
    nameDisplayCheck();
})

// run the function when 'forget' button is clicked.
forgetBtn.addEventListener("click", function() {
    localStorage.removeItem("name");
    nameDisplayCheck();
})

function nameDisplayCheck() {
    // check the name in local storage.
    if (localStorage.getItem("name")) {
        let name = localStorage.getItem("name");
        h1.textContent = "Welcome, " + name;
        personalGreeting.textContent = "Welcome to our website, " + name + "We hope you have fun while you are here."
        // hide 'remember' and appear 'forget'
        forgetDiv.style.display = "block";
        rememberDiv.style.display = "none";
    } else {
        // if no name in local storage, choose nomal greeting.
        h1.textContent = "Welcome to our website";
        personalGreeting.textContent = "Welcome to our website, We hope you have fun while you are here."
        // appear 'remember' and hide 'forget'
        forgetDiv.style.display = "none";
        rememberDiv.style.display = "block";
    }
}

document.body.onload = nameDisplayCheck;