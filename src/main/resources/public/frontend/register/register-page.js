/**
 * This script defines the registration functionality for the Registration page in the Recipe Management Application.
 */

const BASE_URL = "http://localhost:8081"; // backend URL

/* 
 * TODO: Get references to various DOM elements
 * - usernameInput, emailInput, passwordInput, repeatPasswordInput, registerButton
 */
let usernameInput = document.getElementById("username-input");
let emailInput = document.getElementById("email-input");
let passwordInput = document.getElementById("password-input");
let repeatPasswordInput = document.getElementById("repeat-password-input");
let registerButton = document.getElementById("register-button");


/* 
 * TODO: Ensure the register button calls processRegistration when clicked
 */
registerButton.addEventListener("click", processRegistration);

/**
 * TODO: Process Registration Function
 * 
 * Requirements:
 * - Retrieve username, email, password, and repeat password from input fields
 * - Validate all fields are filled
 * - Check that password and repeat password match
 * - Create a request body with username, email, and password
 * - Define requestOptions using method POST and proper headers
 * 
 * Fetch Logic:
 * - Send POST request to `${BASE_URL}/register`
 * - If status is 201:
 *      - Redirect user to login page
 * - If status is 409:
 *      - Alert that user/email already exists
 * - Otherwise:
 *      - Alert generic registration error
 * 
 * Error Handling:
 * - Wrap in try/catch
 * - Log error and alert user
 */
async function processRegistration() {
    // Implement registration logic here
try{
    let username = usernameInput.value;
    let email = emailInput.value;
    let password = passwordInput.value;
    let repeatPassword = repeatPasswordInput.value;

    if(!username || !email || !password || !repeatPassword){
        alert("please fill all the values");
        return;
    }

    if (password !== repeatPassword) {
        alert("Confirm Password do not match");
        return;
    }

    const registerBody = {
        username: this.username,
        email: this.email,
        password: this.password
    }

    // Example placeholder:
    // const registerBody = { username, email, password };
const requestOptions = {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*"
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
        body: JSON.stringify(registerBody)
    };
    // await fetch(...)

    let response = await fetch(`${BASE_URL}/register`,requestOptions);

    if(response.status === 201){
        window.location.href = "../login/login-page.html";
    }else if(response.status === 409){
        alert("User already exist");
    }{
        alert("Registration failed");
    }
}catch(error){
    console.error(error);
    alert("There is an error");
}
    


}
