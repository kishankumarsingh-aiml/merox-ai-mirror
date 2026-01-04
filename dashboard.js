// Select all filter buttons
const filters = document.querySelectorAll(".filter");

// Select status text
const statusText = document.querySelector(".status-text");

filters.forEach(filter => {
  filter.addEventListener("click", () => {

    // Remove active class from all
    filters.forEach(btn => btn.classList.remove("active"));

    // Add active class to clicked button
    filter.classList.add("active");

    const mode = filter.dataset.mode;

    switch (mode) {
      case "skin":
        statusText.innerText = "Skin Mode Activated";
        break;

      case "fitness":
        statusText.innerText = "Fitness Mode Activated";
        break;

      case "goggles":
        statusText.innerText = "Goggles Mode Activated";
        break;

      case "clothes":
        statusText.innerText = "Clothes Mode Activated";
        break;
    }
  });
});
