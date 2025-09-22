/* ---------- navbar --------------*/

// JavaScript for mobile menu toggle
document.getElementById("navbarToggle").addEventListener("click", function () {
  document.getElementById("navbarMenu").classList.toggle("active");
});

// Make dropdowns work on mobile
const dropdowns = document.querySelectorAll(".dropdown");
dropdowns.forEach((dropdown) => {
  dropdown.addEventListener("click", function (e) {
    if (window.innerWidth <= 992) {
      e.preventDefault();
      this.classList.toggle("active");
    }
  });
});

// Close menu when clicking outside (for mobile)
document.addEventListener("click", function (e) {
  if (window.innerWidth <= 992) {
    if (
      !e.target.closest(".navbar-menu") &&
      !e.target.closest(".navbar-toggle")
    ) {
      document.getElementById("navbarMenu").classList.remove("active");
    }
  }
});

/*-----------------------------------------------------------------------------------------*/
/*-----------------------------------------------------------------------------------------*/
/*-----------------------------------------------------------------------------------------*/
/*-----------------------------------------------------------------------------------------*/
/*-----------------------------------------------------------------------------------------*/
/*-----------------------------------------------------------------------------------------*/

/* ------------- footer ----------*/
// Back to top button
window.addEventListener("scroll", function () {
  var backToTop = document.getElementById("backToTop");
  if (window.pageYOffset > 300) {
    backToTop.classList.add("show");
  } else {
    backToTop.classList.remove("show");
  }
});

document.getElementById("backToTop").addEventListener("click", function (e) {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: "smooth" });
});

/*-----------------------------------------------------------------------------------------*/
/*-----------------------------------------------------------------------------------------*/
/*-----------------------------------------------------------------------------------------*/
/*-----------------------------------------------------------------------------------------*/
/*-----------------------------------------------------------------------------------------*/
/*-----------------------------------------------------------------------------------------*/
// ======================
// عناصر Navbar
// ======================
const dashboardItem = document.getElementById('dashboard-item');
const dashboardLink = document.getElementById('dashboard-link');
const loginMenu = document.getElementById('login-menu');

// ======================
// عرض Dashboard إذا المستخدم مسجّل دخول
// ======================
const userType = localStorage.getItem('userType');
const username = localStorage.getItem('username'); // معرف المستخدم (مثلاً البريد)
if (userType && username) {
  dashboardItem.style.display = 'block';
  if (loginMenu) loginMenu.style.display = 'none';

  switch(userType) {
    case 'client':
      dashboardLink.href = '../dashboard/client-dashboard.html';
      break;
    case 'hospital':
      dashboardLink.href = '../dashboard/hospital-dashboard.html';
      break;
    case 'pharmacy':
      dashboardLink.href = '../dashboard/pharmacy-dashboard.html';
      break;
    case 'admin':
      dashboardLink.href = '../dashboard/admin-dashboard.html';
      break;
  }
}

// ======================
// إرسال طلب تسجيل الدخول
// ======================
function handleLogin(userType, username) {
  let loginRequests = JSON.parse(localStorage.getItem("loginRequests")) || [];

  // إضافة طلب جديد
  loginRequests.push({
    username: username,
    type: userType,
    status: "pending"
  });

  localStorage.setItem("loginRequests", JSON.stringify(loginRequests));

  // تخزين بيانات الجلسة
  localStorage.setItem("userType", userType);
  localStorage.setItem("username", username);

  // إظهار رسالة داخل صفحة Login
  const loginForm = document.getElementById("login-form");
  if(loginForm) {
    loginForm.innerHTML = `<p>تم إرسال طلب الموافقة من قبل Admin.</p>`;
  }
}

// ======================
// تحقق عند فتح صفحة Login إذا تمت الموافقة
// ======================
window.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById("login-form");
  const username = localStorage.getItem("username");

  if (!loginForm || !username) return;

  const loginRequests = JSON.parse(localStorage.getItem("loginRequests")) || [];
  const approvedRequest = loginRequests.find(req => req.username === username && req.status === "approved");

  if (approvedRequest) {
    loginForm.innerHTML = `
      <p style="color: green; font-weight: bold;">تمت الموافقة على طلبك!</p>
      <button onclick="window.location.href='../index.html'">العودة إلى الصفحة الرئيسية</button>
    `;
  }
});

// ======================
// Admin Dashboard: عرض الطلبات المعلقة والموافقة عليها
// ======================
function renderAdminRequests() {
  const requestsContainer = document.getElementById("requests-container");
  if(!requestsContainer) return;

  let loginRequests = JSON.parse(localStorage.getItem("loginRequests")) || [];
  requestsContainer.innerHTML = "";

  loginRequests.forEach((req, index) => {
    if(req.status === "pending") {
      const div = document.createElement("div");
      div.innerHTML = `
        <p>${req.username} (${req.type}) طلب تسجيل دخول</p>
        <button onclick="approveRequest(${index})">موافقة</button>
      `;
      requestsContainer.appendChild(div);
    }
  });
}

// ======================
// دالة الموافقة على طلب Admin
// ======================
function approveRequest(index) {
  let loginRequests = JSON.parse(localStorage.getItem("loginRequests")) || [];
  loginRequests[index].status = "approved";
  localStorage.setItem("loginRequests", JSON.stringify(loginRequests));
  alert(`تمت الموافقة على طلب ${loginRequests[index].username}`);
  renderAdminRequests(); // تحديث قائمة الطلبات
}

// عند فتح صفحة Admin Dashboard
document.addEventListener('DOMContentLoaded', () => {
  renderAdminRequests();
});
