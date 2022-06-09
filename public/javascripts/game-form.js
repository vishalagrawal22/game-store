/* global document, Choices, FormData */

const categorySelector = document.querySelector("#categories");
const deviceSelector = document.querySelector("#supported-devices");
const ageRatingSelector = document.querySelector("#age-rating");

const commonConfig = {
  removeItemButton: true,
  allowHTML: false,
  resetScrollPosition: false,
};

new Choices(ageRatingSelector, {
  ...commonConfig,
  removeItemButton: false,
});

const categoryChoices = new Choices(categorySelector, {
  ...commonConfig,
  noChoicesText: "No category left",
  noResultsText: "No category found",
});

const deviceChoices = new Choices(deviceSelector, {
  ...commonConfig,
  noChoicesText: "No device left",
  noResultsText: "No device found",
});

const gameImageFile = document.querySelector("#game-image-file");
const gameImageUrl = document.querySelector("#game-image-url");
const gameImageType = document.querySelector("#game-image-type");
new Choices(gameImageType, {
  ...commonConfig,
  removeItemButton: false,
  searchEnabled: false,
});

gameImageType.addEventListener("change", () => {
  if (gameImageType.value === "url") {
    gameImageFile.style.display = "none";
    gameImageUrl.style.display = "block";
    if (gameImageUrl.checkValidity()) {
      gameImagePreview.src = gameImageUrl.value;
    } else {
      gameImagePreview.src = "";
    }
  } else if (gameImageType.value === "file") {
    gameImageFile.style.display = "block";
    if (gameImageFile.files.length !== 0) {
      gameImagePreview.src = URL.createObjectURL(gameImageFile.files[0]);
    } else {
      gameImagePreview.src = "";
    }
    gameImageUrl.style.display = "none";
  }
});

gameImageUrl.addEventListener("focusout", () => {
  if (gameImageUrl.checkValidity()) {
    gameImagePreview.src = gameImageUrl.value;
  } else {
    gameImagePreview.src = "";
  }
});

const gameImagePreview = document.querySelector("#game-image-preview");
gameImageFile.addEventListener("change", (event) => {
  if (event.target.files.length !== 0) {
    gameImagePreview.src = URL.createObjectURL(event.target.files[0]);
  } else {
    gameImagePreview.src = "";
  }
});

const gameForm = document.querySelector("#game-form");
gameForm.addEventListener("submit", () => {
  const data = new FormData(gameForm);
  data.append("categories", categoryChoices.getValue(true));
  data.append("supportedDevices", deviceChoices.getValue(true));
  return true;
});
