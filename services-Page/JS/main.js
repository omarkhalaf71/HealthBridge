// Filter functionality
document.addEventListener("DOMContentLoaded", function () {
  const filterButtons = document.querySelectorAll(".filter-btn");
  const serviceCards = document.querySelectorAll(".service-card");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Remove active class from all buttons
      filterButtons.forEach((btn) => btn.classList.remove("active"));

      // Add active class to clicked button
      button.classList.add("active");

      const filter = button.getAttribute("data-filter");

      // Show/hide cards based on filter
      serviceCards.forEach((card) => {
        if (filter === "all") {
          card.style.display = "flex";
        } else if (
          filter === "hospital" &&
          card.classList.contains("hospital-service")
        ) {
          card.style.display = "flex";
        } else if (
          filter === "pharmacy" &&
          card.classList.contains("pharmacy-service")
        ) {
          card.style.display = "flex";
        } else {
          card.style.display = "none";
        }
      });
    });
  });
});
