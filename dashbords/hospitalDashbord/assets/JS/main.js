// Tab functionality
document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    // Remove active class from all tabs
    document
      .querySelectorAll(".tab")
      .forEach((t) => t.classList.remove("active"))
    document
      .querySelectorAll(".tab-content")
      .forEach((c) => c.classList.remove("active"))

    // Add active class to clicked tab
    tab.classList.add("active")
    document.getElementById(tab.dataset.tab).classList.add("active")
  })
})

// Notification bell functionality
document
  .querySelector(".notification-bell")
  .addEventListener("click", function () {
    alert("Notifications panel would open here")
  })

document.querySelectorAll(".btn-Confirm").forEach((button) => {
  button.addEventListener("click", function () {
    const row = this.closest(".order-Confirm")

    setTimeout(() => {
      if (row) row.remove()
    }, 3000)
  })
})

document.querySelectorAll(".btn-Cancel").forEach((button) => {
  button.addEventListener("click", function () {
    const row = this.closest(".order-Cancel")

    setTimeout(() => {
      if (row) row.remove()
    }, 3000)
  })
})

document.querySelectorAll(".btn-danger").forEach((button) => {
  button.addEventListener("click", function () {
    const row = this.closest(".order-Delete")

    openPopup()

    setTimeout(() => {
      if (row) row.remove()
    }, 3000)
  })
})

function openPopup() {
  document.getElementById("popupOverlay").style.display = "flex"
}

function closePopup() {
  document.getElementById("popupOverlay").style.display = "none"
}
