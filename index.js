/*
Challenge:
Make it so that when you click the 'Add to cart' button, whatever is written in the input field should be console logged.
*/
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js";

// Firebase configuration settings
const appSettings = {
    databaseURL: "https://mobileapp-93c97-default-rtdb.firebaseio.com/" 
}

const app = initializeApp(appSettings);
const database = getDatabase(app);
const shoppingListInDB = ref(database, "shoppingList");

// Reference HTML elements
const inputFieldEl = document.getElementById("input-field");
const addButtonEl = document.getElementById("add-button");
const shoppingListEl = document.getElementById("shopping-list");

addButtonEl.addEventListener("click", function() {
    let inputValue = inputFieldEl.value.trim();

    if (inputValue !== "") {
        push(shoppingListInDB, inputValue); //Add item to Firebase database
        clearInputEl();//clear input field
    }
});

// Listen for shopping list changes in Firebase
onValue(shoppingListInDB, function(snapshot) {   
    if (snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val());

        clearShoppingListEl();

        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i];
            appendItemToShoppingListEl(currentItem);
        }
    } else {
        shoppingListEl.innerHTML = "No items in list... yet";  // Display message if no items
    }
});

// Clear shopping list display
function clearShoppingListEl() {
    shoppingListEl.innerHTML = "";
}

function clearInputEl() {
    inputFieldEl.value = "";
}

//Function to add a new item to the shopping list.
function appendItemToShoppingListEl(item) {
    let itemID = item[0];
    let itemValue = item[1];

    let newEl = document.createElement("li");

    newEl.textContent = itemValue;

    // Remove item from database on click
    newEl.addEventListener("click", function() {
        let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`);
        remove(exactLocationOfItemInDB);  // Remove item from Firebase database
    });

    shoppingListEl.append(newEl);
}