function upadteStorage() {
  let list = document.getElementById("list");
  let itemDivs = Array.from(list.children);
  itemsDataList = [];
  itemDivs.forEach((item) => {
    itemData = new Object();
    itemData.content = item.querySelector("#item-content").textContent;
    itemData.progress = item.querySelector("#item-done").checked;
    itemsDataList.push(itemData);
  });
  localStorage.toDoList = JSON.stringify(itemsDataList);
}
function checkTaskProgress(element, progress) {
  let itemContent = element.querySelector("#item-content");
  if (progress) {
    itemContent.style.textDecoration = "line-through";
  } else {
    itemContent.style.textDecoration = "none";
  }
}
function deleteItem(copy) {
  let list = document.getElementById("list");
  list.removeChild(copy);
}
function moveUpItem(element) {
  let list = document.getElementById("list");
  let currentElement = element;
  let previousElement = element.previousElementSibling;
  list.insertBefore(currentElement, previousElement);
}
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
      deleteItem(element);
      upadteStorage();
    });
    moveUpMe.addEventListener("click", () => {
      moveUpItem(element);
      upadteStorage();
    });
    moveDownMe.addEventListener("click", () => {
      moveDownItem(element);
      upadteStorage();
    });
  }
}
function addItem(text, progress) {
  let item = document.getElementById("item");
  if (text === "") {
    return alert("unable to add empty item");
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
    upadteStorage();
  });
  if (progress) {
    checkTaskProgress(copy, progress);
    copy.querySelector("#item-done").checked = "true";
  }
  let taskDone = copy.querySelector("#item-done");
  taskDone.addEventListener("change", () => {
    let progress = copy.querySelector("#item-done").checked;
    checkTaskProgress(copy, progress);
    upadteStorage();
  });
  text.value = "";
}
document.getElementById("add").addEventListener("click", () => {
  let text = document.querySelector("input").value;
  document.querySelector("input").value = "";
  addItem(text, false);
  upadteStorage();
});
document.getElementById("clear").addEventListener("click", () => {
  localStorage.clear();
  location.reload();
});
if (!localStorage.toDoList) {
  localStorage.toDoList = [];
} else {
  let itemsList = JSON.parse(localStorage.toDoList).slice(1);
  itemsList.forEach((item) => {
    let text = item.content;
    let progress = item.progress;
    if (text) {
      addItem(text, progress);
    }
  });
}
