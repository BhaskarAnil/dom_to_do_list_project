// function to update storage for every event
function updateStorage() {
  let list = document.getElementById("list");
  let itemDivs = Array.from(list.children);
  let itemsDataList = [];
  itemDivs.forEach((item) => {
    let itemData = new Object();
    itemData.content = item.querySelector("#item-content").textContent;
    itemData.progress = item.querySelector("#item-done").checked;
    itemsDataList.push(itemData);
  });
  localStorage.toDoList = JSON.stringify(itemsDataList);
}
// function to check task progress and update to do list
function checkTaskProgress(element, progress) {
  let itemContent = element.querySelector("#item-content");
  if (progress) {
    itemContent.style.textDecoration = "line-through";
  } else {
    itemContent.style.textDecoration = "none";
  }
}
// function to delete an item from to do list
function deleteItem(copy) {
  let list = document.getElementById("list");
  list.removeChild(copy);
}
// function to move an item upwards
function moveUpItem(element) {
  let list = document.getElementById("list");
  let currentElement = element;
  let previousElement = element.previousElementSibling;
  list.insertBefore(currentElement, previousElement);
}
// function to move an item downwards
function moveDownItem(element) {
  let list = document.getElementById("list");
  let nextElement = element.nextElementSibling;
  let currentElement = element;
  if (!nextElement) {
    nextElement = list.children[1];
    list.insertBefore(currentElement, nextElement);
  } else {
    list.insertBefore(nextElement, currentElement);
  }
}
// function to show the modification options when user click's modify button
function modify(element) {
  if (element.querySelector("#modify").textContent === "X") {
    element.querySelector("#modify").textContent = "☰";
    element.querySelector("#item-options").style.display = "none";
    element.querySelector("#item-container").style.display = "flex";
  } else {
    element.querySelector("#modify").textContent = "X";
    element.querySelector("#item-container").style.display = "none";
    element.querySelector("#item-options").style.display = "flex";
    let deleteMe = element.querySelector("#delete");
    let moveUpMe = element.querySelector("#up");
    let moveDownMe = element.querySelector("#down");
    deleteMe.addEventListener("click", () => {
      deleteItem(element); // calling deleteItem function
      updateStorage(); // update to do list after deletion
    });
    moveUpMe.addEventListener("click", () => {
      moveUpItem(element); // calling moveUpItem function
      updateStorage(); // update to do list after changing position
    });
    moveDownMe.addEventListener("click", () => {
      moveDownItem(element); // calling moveDownItem function
      updateStorage(); // update to do list after changing position
    });
  }
}
// function to add item to to list
function addItem(text, progress) {
  let item = document.getElementById("item");
  if (text === "") {
    return alert("Unable to add an empty item.");
  }
  document.getElementById("item-content").textContent = text;
  item.style.display = "flex";
  let list = document.getElementById("list");
  let copy = item.cloneNode(true);
  item.style.display = "none";
  list.appendChild(copy);
  let modifyMe = copy.querySelector("#modify");
  modifyMe.addEventListener("click", () => {
    modify(copy);
    updateStorage();
  });
  if (progress) {
    checkTaskProgress(copy, progress);
    copy.querySelector("#item-done").checked = true;
  }
  let taskDone = copy.querySelector("#item-done");
  taskDone.addEventListener("change", () => {
    let progress = copy.querySelector("#item-done").checked;
    checkTaskProgress(copy, progress); // calling checkTaskProgress function when user click's checkbox
    updateStorage();
  });
  text.value = "";
}
document.getElementById("add").addEventListener("click", () => {
  let text = document.querySelector("input").value;
  document.querySelector("input").value = "";
  addItem(text, false); // calling addItem function when user clicks add button
  updateStorage();
});
document.getElementById("clear").addEventListener("click", () => {
  localStorage.clear(); // clear the local storage by clicking the clear button
  location.reload();
});
// local storage
if (!localStorage.toDoList) {
  localStorage.toDoList = []; // adding toDoList key and empty list value as item to local storage
} else {
  let itemsList = JSON.parse(localStorage.toDoList).slice(1);
  itemsList.forEach((item) => {
    let text = item.content;
    let progress = item.progress;
    if (text) {
      addItem(text, progress); // update the list div with local storage data when the user refreshes the page
    }
  });
}
