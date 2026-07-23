const exploreButton =
  document.getElementById("exploreButton");

const categorySection =
  document.getElementById("categories");

if (exploreButton && categorySection) {

  exploreButton.addEventListener("click", () => {

    categorySection.scrollIntoView({
      behavior: "smooth"
    });

  });

}

/* =========================
   思念角落
========================= */

const petNameInput = document.getElementById("petName");
const memoryMessageInput = document.getElementById("memoryMessage");
const memorySubmitButton =
  document.getElementById("memorySubmitButton");
const memoryBoard = document.getElementById("memoryBoard");
const memoryFormMessage =
  document.getElementById("memoryFormMessage");
const memoryColorButtons =
  document.querySelectorAll(".memory-color");

let selectedMemoryColor = "yellow";

const memoryColorClass = {
  yellow: "note-yellow",
  pink: "note-pink",
  green: "note-green",
  blue: "note-blue"
};

function getSavedMemories() {
  const savedMemories =
    localStorage.getItem("catCompanionMemories");

  if (!savedMemories) {
    return [];
  }

  try {
    return JSON.parse(savedMemories);
  } catch (error) {
    console.error("讀取思念便條失敗：", error);
    return [];
  }
}

function saveMemories(memories) {
  localStorage.setItem(
    "catCompanionMemories",
    JSON.stringify(memories)
  );
}

function createMemoryNote(memory) {
  const note = document.createElement("article");

  note.classList.add(
    "memory-note",
    memoryColorClass[memory.color] || "note-yellow",
    "memory-note-new"
  );

  note.dataset.id = memory.id;

  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.className = "memory-delete-button";
  deleteButton.textContent = "×";
  deleteButton.setAttribute(
    "aria-label",
    `刪除給 ${memory.petName} 的便條`
  );

  deleteButton.addEventListener("click", () => {
    const confirmDelete = window.confirm(
      `確定要刪除給 ${memory.petName} 的思念便條嗎？`
    );

    if (!confirmDelete) {
      return;
    }

    const savedMemories = getSavedMemories();

    const updatedMemories = savedMemories.filter(
      (savedMemory) => savedMemory.id !== memory.id
    );

    saveMemories(updatedMemories);

    note.classList.add("memory-note-removing");

    setTimeout(() => {
      note.remove();
    }, 300);

    showMemoryMessage(
      "思念便條已刪除。",
      "normal"
    );
  });

  const pin = document.createElement("span");
  pin.className = "memory-pin";
  pin.textContent = "●";

  const noteTo = document.createElement("p");
  noteTo.className = "memory-note-to";
  noteTo.textContent = `給 ${memory.petName}`;

  const noteMessage = document.createElement("p");
  noteMessage.className = "memory-note-message";
  noteMessage.textContent = memory.message;

  const noteSymbol = document.createElement("p");
  noteSymbol.className = "memory-note-symbol";
  noteSymbol.textContent = "♡";

  note.appendChild(deleteButton);
  note.appendChild(pin);
  note.appendChild(noteTo);
  note.appendChild(noteMessage);
  note.appendChild(noteSymbol);

  return note;
}

function displaySavedMemories() {
  if (!memoryBoard) {
    return;
  }

  const savedMemories = getSavedMemories();

  savedMemories.forEach((memory) => {
    const note = createMemoryNote(memory);
    note.classList.remove("memory-note-new");
    memoryBoard.appendChild(note);
  });
}

function showMemoryMessage(message, type = "normal") {
  if (!memoryFormMessage) {
    return;
  }

  memoryFormMessage.textContent = message;

  memoryFormMessage.classList.remove(
    "memory-message-success",
    "memory-message-error"
  );

  if (type === "success") {
    memoryFormMessage.classList.add(
      "memory-message-success"
    );
  }

  if (type === "error") {
    memoryFormMessage.classList.add(
      "memory-message-error"
    );
  }
}

if (
  petNameInput &&
  memoryMessageInput &&
  memorySubmitButton &&
  memoryBoard
) {
  memoryColorButtons.forEach((button) => {
    button.addEventListener("click", () => {
      memoryColorButtons.forEach((colorButton) => {
        colorButton.classList.remove("selected");
      });

      button.classList.add("selected");

      selectedMemoryColor =
        button.dataset.color || "yellow";
    });
  });

  memorySubmitButton.addEventListener("click", () => {
    const petName = petNameInput.value.trim();
    const message = memoryMessageInput.value.trim();

    if (!petName || !message) {
      showMemoryMessage(
        "請先填寫毛孩名字和想說的話。",
        "error"
      );
      return;
    }

    if (petName.length > 20) {
      showMemoryMessage(
        "毛孩名字請控制在 20 個字以內。",
        "error"
      );
      return;
    }

    if (message.length > 200) {
      showMemoryMessage(
        "便條內容請控制在 200 個字以內。",
        "error"
      );
      return;
    }

    const newMemory = {
      id: Date.now(),
      petName: petName,
      message: message,
      color: selectedMemoryColor
    };

    const savedMemories = getSavedMemories();
    savedMemories.push(newMemory);
    saveMemories(savedMemories);

    const newNote = createMemoryNote(newMemory);
    memoryBoard.appendChild(newNote);

    petNameInput.value = "";
    memoryMessageInput.value = "";

    showMemoryMessage(
      "你的思念便條已經貼上了 ♡",
      "success"
    );

    newNote.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  });

  displaySavedMemories();
}
