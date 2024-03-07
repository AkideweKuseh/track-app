import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";
const appSettings = {
  databaseURL: "https://inventory-database-96fa5-default-rtdb.firebaseio.com/",
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const inventoryInDB = ref(database, "inventory");

const inputElement = document.getElementById("input-field");
const btnAdd = document.getElementById("add-btn");
const list = document.querySelector("ul");

onValue(inventoryInDB, function (snapshot) {
  if (snapshot.exists()) {
    let itemArray = Object.entries(snapshot.val());
    //clear the list
    clearList();
    //fetch and display data from db
    for (let i = 0; i < itemArray.length; i++) {
      let currentItem = itemArray[i];
      // let currentItemID = currentItem[0];
      // let currentItemValue = currentItem[1];

      addItemToList(currentItem);
    }
  } else {
    list.innerHTML = "no items yet...";
  }
});

btnAdd.addEventListener("click", function () {
  let inputValue = inputElement.value;
  //   pusinging to remote database
  push(inventoryInDB, inputValue);

  //Clearing the input Field
  clearInputField();

  //Adding inputed item to the list: was used initially to add items directly without a database
  //addItemToList(inputValue);
});

function clearInputField() {
  inputElement.value = "";
}

function addItemToList(item) {
  //   list.innerHTML += `<li>${item}</li>`; refactored code
  let newEl = document.createElement("li");
  let itemID = item[0];
  let itemValue = item[1];

  newEl.textContent = `${itemValue}`;

  newEl.addEventListener("dblclick", function () {
    let selectedItem = ref(database, `inventory/${itemID}`);

    remove(selectedItem);
  });

  list.append(newEl);
}

function clearList() {
  list.innerHTML = "";
}
