// نظام إدارة المستخدمين والطلبات
class UserManagementSystem {
  constructor() {
    this.pendingRequests =
      JSON.parse(localStorage.getItem("pendingRequests")) || [];
    this.approvedUsers =
      JSON.parse(localStorage.getItem("approvedUsers")) || [];
  }

  // إرسال طلب تسجيل جديد
  submitRegistrationRequest(userData) {
    const request = {
      id: Date.now(),
      role: userData.role,
      timestamp: new Date().toISOString(),
      status: "pending",
      ...userData,
    };

    this.pendingRequests.push(request);
    this.saveToLocalStorage();

    return request;
  }

  // الموافقة على طلب
  approveRequest(requestId) {
    const requestIndex = this.pendingRequests.findIndex(
      (req) => req.id === requestId
    );

    if (requestIndex !== -1) {
      const approvedRequest = this.pendingRequests[requestIndex];
      approvedRequest.status = "approved";
      approvedRequest.approvedAt = new Date().toISOString();

      this.approvedUsers.push(approvedRequest);
      this.pendingRequests.splice(requestIndex, 1);

      this.saveToLocalStorage();
      return approvedRequest;
    }
    return null;
  }

  // الحفظ في localStorage
  saveToLocalStorage() {
    localStorage.setItem(
      "pendingRequests",
      JSON.stringify(this.pendingRequests)
    );
    localStorage.setItem("approvedUsers", JSON.stringify(this.approvedUsers));
  }

  // التحقق إذا كان المستخدم موافق عليه
  isUserApproved(email, role) {
    return this.approvedUsers.some(
      (user) =>
        user.email === email && user.role === role && user.status === "approved"
    );
  }

  // الحصول على الطلبات المعلقة حسب الدور
  getPendingRequestsByRole(role) {
    return this.pendingRequests.filter(
      (req) => req.role === role && req.status === "pending"
    );
  }
}

// إنشاء instance من النظام
const userSystem = new UserManagementSystem();

// دالة معالجة اللوجن الموحدة
function handleLogin(event, role) {
  event.preventDefault();

  const form = event.target;
  const formData = new FormData(form);

  // جمع بيانات المستخدم حسب الدور
  let userData = { role: role };

  if (role === "hospital") {
    userData = {
      role: role,
      hospitalName: form.querySelector("#hospitalName").value,
      phone: form.querySelector("#phone").value,
      email: form.querySelector("#email").value,
      password: form.querySelector("#password").value,
    };
  } else {
    userData = {
      role: role,
      firstName: form.querySelector("#firstName")?.value || "",
      lastName: form.querySelector("#lastName")?.value || "",
      phone: form.querySelector("#phone").value,
      email: form.querySelector("#email").value,
      password: form.querySelector("#password").value,
    };
  }

  // التحقق إذا كان المستخدم موافق عليه مسبقاً
  if (userSystem.isUserApproved(userData.email, role)) {
    // إذا موافق عليه، تسجيل الدخول مباشرة
    localStorage.setItem("currentUser", JSON.stringify(userData));
    window.location.href = "../dashboard/dashboard.html";
    return;
  }

  // إذا ليس موافق عليه، إرسال طلب جديد
  const request = userSystem.submitRegistrationRequest(userData);

  // إظهار رسالة الانتظار وإخفاء الفورم
  showPendingApprovalMessage(request.id, role);
}

// إظهار رسالة انتظار الموافقة
function showPendingApprovalMessage(requestId, role) {
  const form = document.querySelector("form");
  form.style.display = "none";

  const messageDiv = document.createElement("div");
  messageDiv.className = "pending-approval-message";
  messageDiv.innerHTML = `
        <div class="message-content">
            <ion-icon name="time-outline" class="message-icon"></ion-icon>
            <h2>Registration Submitted Successfully!</h2>
            <p>Your registration request has been sent to the administrator for approval.</p>
            <p><strong>Request ID:</strong> ${requestId}</p>
            <p>You will be notified once your account is approved.</p>
            <button onclick="goToHomePage()" class="home-btn">
                <ion-icon name="home-outline"></ion-icon>
                Return to Homepage
            </button>
        </div>
    `;

  document.querySelector("section").appendChild(messageDiv);
}

// العودة للصفحة الرئيسية
function goToHomePage() {
  window.opener ? window.close() : (window.location.href = "../index.html");
}

// التحقق من حالة الطلب عند تحميل الصفحة
function checkApprovalStatus() {
  const urlParams = new URLSearchParams(window.location.search);
  const approved = urlParams.get("approved");
  const requestId = urlParams.get("requestId");

  if (approved === "true" && requestId) {
    showApprovalSuccessMessage();
  }
}

// إظهار رسالة نجاح الموافقة
function showApprovalSuccessMessage() {
  const form = document.querySelector("form");
  if (form) form.style.display = "none";

  const existingMessage = document.querySelector(".approval-message");
  if (existingMessage) existingMessage.remove();

  const messageDiv = document.createElement("div");
  messageDiv.className = "approval-message";
  messageDiv.innerHTML = `
        <div class="message-content success">
            <ion-icon name="checkmark-circle-outline" class="message-icon"></ion-icon>
            <h2>Registration Approved!</h2>
            <p>Your account has been successfully approved by the administrator.</p>
            <p>You can now login with your credentials.</p>
            <div class="button-group">
                <button onclick="goToHomePage()" class="home-btn">
                    <ion-icon name="home-outline"></ion-icon>
                    Return to Homepage
                </button>
                <button onclick="showLoginForm()" class="login-btn">
                    <ion-icon name="log-in-outline"></ion-icon>
                    Login Now
                </button>
            </div>
        </div>
    `;

  document.querySelector("section").appendChild(messageDiv);
}

// إعادة إظهار فورم اللوجن
function showLoginForm() {
  const message = document.querySelector(".approval-message");
  if (message) message.remove();

  const form = document.querySelector("form");
  if (form) form.style.display = "block";
}

// التهيئة عند تحميل الصفحة
document.addEventListener("DOMContentLoaded", function () {
  checkApprovalStatus();

  // إضافة event listener للفورم
  const form = document.querySelector("form");
  if (form) {
    const role = document.body.dataset.role || "user";
    form.addEventListener("submit", (e) => handleLogin(e, role));
  }
});
