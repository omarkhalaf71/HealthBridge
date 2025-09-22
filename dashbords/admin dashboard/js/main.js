// JavaScript for responsive sidebar
document.addEventListener("DOMContentLoaded", function () {
  const sidebar = document.getElementById("sidebar")
  const sidebarToggle = document.getElementById("sidebarToggle")
  const mainContent = document.querySelector(".main-content")

  // Toggle sidebar on button click
  sidebarToggle.addEventListener("click", function () {
    sidebar.classList.toggle("active")
  })

  // Close sidebar when clicking outside on mobile
  document.addEventListener("click", function (event) {
    if (
      window.innerWidth <= 992 &&
      !sidebar.contains(event.target) &&
      !sidebarToggle.contains(event.target) &&
      sidebar.classList.contains("active")
    ) {
      sidebar.classList.remove("active")
    }
  })

  // Button interactions
  const buttons = document.querySelectorAll("button")
  buttons.forEach((button) => {
    button.addEventListener("click", function () {
      const action = this.textContent

      if (action.includes("Approve")) {
        const row = this.closest("tr")
        row.style.opacity = "0.5"
        setTimeout(() => {
          row.remove()
        }, 3000)
      } else if (action.includes("Reject")) {
        const row = this.closest("tr")
        row.style.opacity = "0.5"
        setTimeout(() => {
          row.remove()
        }, 3000)
      } else if (action.includes("Logout")) {
        alert("You have been logged out successfully")
      }
    })
  })
})

function openPopup() {
  document.getElementById("popupOverlay").style.display = "flex"
}

function deletItem() {
  closePopup()
}

function closePopup() {
  document.getElementById("popupOverlay").style.display = "none"
}


/*------------------------------------------------------------*/
/*------------------------------------------------------------*/
/*------------------------------------------------------------*/
/*------------------------------------------------------------*/
/*------------------------------------------------------------*/
/*------------------------------------------------------------*/

// عرض الطلبات المعلقة
const requestsContainer = document.getElementById("requests-container");
let loginRequests = JSON.parse(localStorage.getItem("loginRequests")) || [];

function renderRequests() {
  requestsContainer.innerHTML = "";
  loginRequests.forEach((req, index) => {
    if (req.status === "pending") {
      const div = document.createElement("div");
      div.innerHTML = `
        <p>${req.username} (${req.type}) طلب تسجيل دخول</p>
        <button onclick="approveRequest(${index})">موافقة</button>
      `;
      requestsContainer.appendChild(div);
    }
  });
}

// الموافقة على الطلب
function approveRequest(index) {
  loginRequests[index].status = "approved";
  localStorage.setItem("loginRequests", JSON.stringify(loginRequests));
  alert(`تمت الموافقة على طلب ${loginRequests[index].username}`);
  renderRequests(); // تحديث قائمة الطلبات
}

renderRequests();