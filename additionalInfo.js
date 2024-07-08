export function addAdditionalInfoEventListener() {
  const container = document.getElementById("additional-info-container");

  const infoDiv = document.createElement("div");
  const infoInput = document.createElement("input");
  const addButton = document.createElement("button");
  addButton.innerText = "Dodaj";

  addButton.addEventListener("click", () => {
    const newInfo = document.createElement("p");
    newInfo.classList.add("additional-info");
    newInfo.innerText = infoInput.value;

    const editButton = document.createElement("button");
    editButton.innerText = "Edytuj";
    editButton.addEventListener("click", () => {
      const newValue = prompt("Edytuj informację:", newInfo.innerText);
      if (newValue !== null) {
        newInfo.innerText = newValue;
      }
    });

    const deleteButton = document.createElement("button");
    deleteButton.innerText = "Usuń";
    deleteButton.addEventListener("click", () => {
      container.removeChild(newInfoDiv);
    });

    const newInfoDiv = document.createElement("div");
    newInfoDiv.classList.add("d-f-sb");
    const divContainer = document.createElement("div");

    newInfoDiv.appendChild(newInfo);
    divContainer.appendChild(editButton);
    divContainer.appendChild(deleteButton);
    newInfoDiv.appendChild(divContainer);
    container.appendChild(newInfoDiv);

    infoDiv.remove();
  });

  infoDiv.appendChild(infoInput);
  infoDiv.appendChild(addButton);
  container.appendChild(infoDiv);
}
