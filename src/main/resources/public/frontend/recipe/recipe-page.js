/**
 * This script defines the CRUD operations for Recipe objects in the Recipe Management Application.
 */

const BASE_URL = "http://localhost:8081"; // backend URL

let recipes = [];

// Wait for DOM to fully load before accessing elements
window.addEventListener("DOMContentLoaded", () => {

    /* 
     * TODO: Get references to various DOM elements
     * - Recipe name and instructions fields (add, update, delete)
     * - Recipe list container
     * - Admin link and logout button
     * - Search input
    */
let adminLink = document.getElementById("admin-link");
let logoutButton = document.getElementById("logout-button");
let searchInput = document.getElementById("search-input");
let searchButton = document.getElementById("search-button");
let recipeList = document.getElementById("recipe-list");
let addRecipeNameInput = document.getElementById("add-recipe-name-input");
let addRecipeInstructionsInput = document.getElementById("add-recipe-instructions-input");
let addRecipeSubmitButton = document.getElementById("add-recipe-submit-input");
let updateRecipeNameInput = document.getElementById("update-recipe-name-input");
let updateRecipeInstructionsInput = document.getElementById("update-recipe-instructions-input");
let updateRecipeSubmitButton = document.getElementById("update-recipe-submit-input");
let deleteRecipeNameInput = document.getElementById("delete-recipe-name-input");
let deleteRecipeSubmitButton = document.getElementById("delete-recipe-submit-input");

addRecipeSubmitButton.addEventListener("click", addRecipe);
updateRecipeSubmitButton.addEventListener("click", updateRecipe);
deleteRecipeSubmitButton.addEventListener("click", deleteRecipe);
logoutButton.addEventListener("click", processLogout);
searchButton.addEventListener("click", searchRecipes);
    /*
     * TODO: Show logout button if auth-token exists in sessionStorage
     */
if(sessionStorage.getItem("auth-token") !== null){
logoutButton.style.display = "block";
}
    /*
     * TODO: Show admin link if is-admin flag in sessionStorage is "true"
     */
if(sessionStorage.getItem("is-admin") === "true"){
    adminLink.style.display = "block";
}

    /*
     * TODO: Attach event handlers
     * - Add recipe button → addRecipe()
     * - Update recipe button → updateRecipe()
     * - Delete recipe button → deleteRecipe()
     * - Search button → searchRecipes()
     * - Logout button → processLogout()
     */

    /*
     * TODO: On page load, call getRecipes() to populate the list
     */
getRecipes();

    /**
     * TODO: Search Recipes Function
     * - Read search term from input field
     * - Send GET request with name query param
     * - Update the recipe list using refreshRecipeList()
     * - Handle fetch errors and alert user
     */
    async function searchRecipes() {
        // Implement search logic here
        let input = searchInput.value;
        
        const requestOptions = {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + sessionStorage.getItem("auth-token")
              }
        };
        try{
        let response = await fetch(`${BASE_URL}/recipes${encodeURIComponent(input)}`, requestOptions);
        if(response.status === 200){
            recipes = await response.json();
            refreshRecipeList();
        }else{
            alert("error in recipe search");
        }
        }catch(error){
            console.error(error);
            alert("There is an error searching recipe");
        }
        
    }

    /**
     * TODO: Add Recipe Function
     * - Get values from add form inputs
     * - Validate both name and instructions
     * - Send POST request to /recipes
     * - Use Bearer token from sessionStorage
     * - On success: clear inputs, fetch latest recipes, refresh the list
     */
    async function addRecipe() {
        // Implement add logic here
        let add = addRecipeNameInput.value.trim();
        let add2 = addRecipeInstructionsInput.value.trim();
        
        if(!add || !add2){
            alert("name or recipe is empty!");
            return;
        }

        const requestBody = {
            name: add,
            instructions: add2
        };

        const requestOptions = {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Authorization": "Bearer " + sessionStorage.getItem("auth-token"),
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*"
            },
            redirect: "follow",
            referrerPolicy: "no-referrer",
            body: JSON.stringify(requestBody)
        };

        try {
            let response = await fetch(`${BASE_URL}/recipes`,requestOptions);
            if(response.status === 200){
                addRecipeNameInput.value = "";
                addRecipeInstructionsInput.value = "";
                refreshRecipeList();    
            } 
            
        } catch (error) {
            console.error(error);
            alert("error adding recipe!");
        }
    }

    /**
     * TODO: Update Recipe Function
     * - Get values from update form inputs
     * - Validate both name and updated instructions
     * - Fetch current recipes to locate the recipe by name
     * - Send PUT request to update it by ID
     * - On success: clear inputs, fetch latest recipes, refresh the list
     */
    async function updateRecipe() {
        // Implement update logic here
        let updateName = updateRecipeNameInput.value;
        let updateInstr = updateRecipeInstructionsInput.value;

        if(!updateName || !updateInstr){
            alert("update name or instructions are empty");
            return;
        }

        try {
            let recipe = recipes.find(recipe => recipe.name === updateName);
            if (!recipe) {
                alert("Recipe not found.");
                return;
            }
            let recipeId = recipe.id;

            const requestBody = {
                id: recipe.id,
                name: updateName,
                instructions: updateInstr,
                author: recipe.author,
                ingredients: recipe.ingredients
            }

            const requestOptions = {
                method: "PUT",
                mode: "cors",
                cache: "no-cache",
                credentials: "same-origin",
                headers: {
                    "Authorization": "Bearer " + sessionStorage.getItem("auth-token"),
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Headers": "*"
                },
                redirect: "follow",
                referrerPolicy: "no-referrer",
                body: JSON.stringify(requestBody)
            };


            let response = await fetch(`${BASE_URL}/recipes/${recipeId}`, requestOptions);
            if(response.status === 200){
                updateRecipeNameInput.value = "";
                updateRecipeInstructionsInput.value = "";
                getRecipes();
                refreshRecipeList();
            }

            
        } catch (error) {
            console.error(error);
            alert("there is an error updating recipe");
        }
    }

    /**
     * TODO: Delete Recipe Function
     * - Get recipe name from delete input
     * - Find matching recipe in list to get its ID
     * - Send DELETE request using recipe ID
     * - On success: refresh the list
     */
    async function deleteRecipe() {
        // Implement delete logic here
        let deleteName = deleteRecipeNameInput.value;

        if(!deleteName){
            alert("delete name is empty");
            return;
        }

        try {
            let recipe = recipes.find(recipe => recipe.name === deleteName);
            if (!recipe) {
                alert("Recipe not found.");
                return;
            }
            let recipeId = recipe.id;

            const requestOptions = {
                method: "DELETE",
                mode: "cors",
                cache: "no-cache",
                credentials: "same-origin",
                headers: {
                    "Authorization": "Bearer " + sessionStorage.getItem("auth-token"),
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Headers": "*"
                },
                redirect: "follow",
                referrerPolicy: "no-referrer",
            };


            let response = await fetch(`${BASE_URL}/recipes/${recipeId}`, requestOptions);
            if(response.status === 200){
                deleteRecipeNameInput.value = "";
                getRecipes();
                refreshRecipeList();
            }

            
        } catch (error) {
            console.error(error);
            alert("there is an error deleting recipe");
        }
    }

    /**
     * TODO: Get Recipes Function
     * - Fetch all recipes from backend
     * - Store in recipes array
     * - Call refreshRecipeList() to display
     */
    async function getRecipes() {
        // Implement get logic here
        const requestOptions = {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + sessionStorage.getItem("auth-token")
              }
        };
        try{
        let response = await fetch(`${BASE_URL}/recipes`, requestOptions);
        if(response.status === 200){
            recipes = await response.json();
            refreshRecipeList();
        }else{
            alert("error in recipe search");
        }
        }catch(error){
            console.error(error);
            alert("There is an error searching recipe");
        }
        
    }

    /**
     * TODO: Refresh Recipe List Function
     * - Clear current list in DOM
     * - Create <li> elements for each recipe with name + instructions
     * - Append to list container
     */
    function refreshRecipeList() {
        // Implement refresh logic here
        recipeList.innerHTML = "";
        for(let r of recipes){
            let ele = document.createElement("li");
            ele.textContent = `${r.name} : Instructions: ${r.instructions}`;
            recipeList.append(ele);
        }
    }

    /**
     * TODO: Logout Function
     * - Send POST request to /logout
     * - Use Bearer token from sessionStorage
     * - On success: clear sessionStorage and redirect to login
     * - On failure: alert the user
     */
    async function processLogout() {
        // Implement logout logic here


        const requestOptions = {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Authorization": "Bearer " + sessionStorage.getItem("auth-token"),
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*"
            },
            redirect: "follow",
            referrerPolicy: "no-referrer",
        };

        try {
            let response = await fetch(`${BASE_URL}/logout`,requestOptions);
            if(response.status === 200){
                sessionStorage.removeItem("auth-token", null);
                sessionStorage.removeItem("is-admin", null);
                window.location.href = "../login/login-page.html";
            } 
            
        } catch (error) {
            console.error(error);
            alert("error in logout!");
        }
    }

});
