/**
 * This script defines the add, view, and delete operations for Ingredient objects in the Recipe Management Application.
 */

const BASE_URL = "http://localhost:8081"; // backend URL

/* 
 * TODO: Get references to various DOM elements
 * - addIngredientNameInput
 * - deleteIngredientNameInput
 * - ingredientListContainer
 * - searchInput (optional for future use)
 * - adminLink (if visible conditionally)
 */
let addIngredientNameInput = document.getElementById("add-ingredient-name-input");
let backLink = document.getElementById("back-link");
let addIngredientButton = document.getElementById("add-ingredient-submit-button");
let deleteIngredientNameInput = document.getElementById("delete-ingredient-name-input");
let deleteIngredientButton = document.getElementById("delete-ingredient-submit-button");
let ingredientListContainer = document.getElementById("ingredient-list");
/* 
 * TODO: Attach 'onclick' events to:
 * - "add-ingredient-submit-button" → addIngredient()
 * - "delete-ingredient-submit-button" → deleteIngredient()
 */
addIngredientButton.addEventListener("click", addIngredient);
deleteIngredientButton.addEventListener("click", deleteIngredient);

/*
 * TODO: Create an array to keep track of ingredients
 */
let ingredients = [];

/* 
 * TODO: On page load, call getIngredients()
 */
getIngredients()

/**
 * TODO: Add Ingredient Function
 * 
 * Requirements:
 * - Read and trim value from addIngredientNameInput
 * - Validate input is not empty
 * - Send POST request to /ingredients
 * - Include Authorization token from sessionStorage
 * - On success: clear input, call getIngredients() and refreshIngredientList()
 * - On failure: alert the user
 */
async function addIngredient() {
    // Implement add ingredient logic here

    let name = addIngredientNameInput.value.trim();
    
    if(!name){
        alert("Ingredient name is blank");
        return;
    }

    const requestBody = { 
        name: name 
    }; 
    
    const requestOptions = { 
        method: "POST", 
        headers: { 
            "Authorization": "Bearer " + sessionStorage.getItem("auth-token"), 
            "Content-Type": "application/json" 
        }, 
        body: JSON.stringify(requestBody) };


    try{
    let response = await fetch(`${BASE_URL}/ingredients`, requestOptions);
    
    if(response.ok){
        addIngredientNameInput.value = "";
        await getIngredients();
    }else{
        alert("there is an error adding ingredient");
    }

    }catch(error){
        console.error(error);
        alert("there is an error adding ingredient");
    }

}


/**
 * TODO: Get Ingredients Function
 * 
 * Requirements:
 * - Fetch all ingredients from backend
 * - Store result in `ingredients` array
 * - Call refreshIngredientList() to display them
 * - On error: alert the user
 */
async function getIngredients() {
    // Implement get ingredients logic here
    const requestOptions = {
        method: "GET",
        headers: { 
            "Authorization": "Bearer " + sessionStorage.getItem("auth-token"), 
            "Content-Type": "application/json" 
        }
    };

try {
    let response = await fetch(`${BASE_URL}/ingredients`, requestOptions);
    if(response.ok){
        ingredients = await response.json();
        refreshIngredientList();
    }else{
        // alert("error in fetching ingredients");  
        alert(
            "DELETE status: " + response.status +
            " ID: " + id +
            " Name: " + deleteName
        );  
    }
    
} catch (error) {
    console.error(error);
    alert("error in fetching ingredients");
} 


}


/**
 * TODO: Delete Ingredient Function
 * 
 * Requirements:
 * - Read and trim value from deleteIngredientNameInput
 * - Search ingredientListContainer's <li> elements for matching name
 * - Determine ID based on index (or other backend logic)
 * - Send DELETE request to /ingredients/{id}
 * - On success: call getIngredients() and refreshIngredientList(), clear input
 * - On failure or not found: alert the user
 */
async function deleteIngredient() {
    // Implement delete ingredient logic here
    let deleteName = deleteIngredientNameInput.value.trim();

    if(!deleteName){
        alert("empty ingredient name");
        return;
    }

let ingredient = ingredients.find(ing => {
    return ing.name === deleteName
});

if(!ingredient){
alert("ingredient not found");
return;
}

let id = ingredient.id;

const requestOptions = {
    method: "DELETE",
    headers: { 
        "Authorization": "Bearer " + sessionStorage.getItem("auth-token"), 
        "Content-Type": "application/json" 
    }
};

try {
    let response = await fetch(`${BASE_URL}/ingredients/${id}`, requestOptions);

    if(response.ok){
        deleteIngredientNameInput.value = "";
        await getIngredients();
    }else{
        alert("error deleting ingredient");
    }
} catch (error) {
    console.error(error);
    alert("error deleting ingredient");
}

}
/**
 * TODO: Refresh Ingredient List Function
 * 
 * Requirements:
 * - Clear ingredientListContainer
 * - Loop through `ingredients` array
 * - For each ingredient:
 *   - Create <li> and inner <p> with ingredient name
 *   - Append to container
 */

function refreshIngredientList() {
    // Implement ingredient list rendering logic here
    ingredientListContainer.innerHTML = "";

    for(let ing of ingredients){
        let list = document.createElement("li");
        let p = document.createElement("p");
        p.innerText = ing.name;
        list.appendChild(p);
        ingredientListContainer.appendChild(list);
    }

    
}
