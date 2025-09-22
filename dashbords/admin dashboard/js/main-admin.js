// نظام إدارة طلبات التسجيل المعلقة
class AdminRequestManager {
  constructor() {
    this.pendingRequests =
      JSON.parse(localStorage.getItem("pendingRequests")) || [];
    this.init();
  }

  init() {
    this.displayPendingRequests();
    this.setupEventListeners();
  }

  // عرض الطلبات المعلقة
  displayPendingRequests() {
    const container = document.getElementById("requests-container");
    if (!container) return;

    const pendingRequests = this.pendingRequests.filter(
      (req) => req.status === "pending"
    );

    if (pendingRequests.length === 0) {
      container.innerHTML = `
                <div class="no-requests">
                    <i class="fas fa-check-circle"></i>
                    <p>No pending registration requests</p>
                </div>
            `;
      return;
    }

    container.innerHTML = `
            <div class="requests-grid">
                ${pendingRequests
                  .map((request) => this.createRequestCard(request))
                  .join("")}
            </div>
        `;
  }

  // إنشاء بطاقة طلب
  createRequestCard(request) {
    const date = new Date(request.timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    return `
            <div class="request-card" data-id="${request.id}">
                <div class="request-header">
                    <div class="request-type ${request.role}">
                        <i class="fas ${this.getRoleIcon(request.role)}"></i>
                        ${request.role.toUpperCase()}
                    </div>
                    <div class="request-id">#${request.id}</div>
                </div>
                
                <div class="request-body">
                    <div class="user-info">
                        <h4>${
                          request.hospitalName ||
                          `${request.firstName} ${request.lastName}`
                        }</h4>
                        <p><i class="fas fa-envelope"></i> ${request.email}</p>
                        <p><i class="fas fa-phone"></i> ${request.phone}</p>
                    </div>
                    
                    <div class="request-details">
                        <p><strong>Submitted:</strong> ${date}</p>
                        ${
                          request.hospitalName
                            ? `<p><strong>Hospital Name:</strong> ${request.hospitalName}</p>`
                            : `<p><strong>Name:</strong> ${request.firstName} ${request.lastName}</p>`
                        }
                    </div>
                </div>
                
                <div class="request-actions">
                    <button class="btn-approve" onclick="adminManager.approveRequest(${
                      request.id
                    })">
                        <i class="fas fa-check"></i> Approve
                    </button>
                    <button class="btn-reject" onclick="adminManager.rejectRequest(${
                      request.id
                    })">
                        <i class="fas fa-times"></i> Reject
                    </button>
                    <button class="btn-view" onclick="adminManager.viewDetails(${
                      request.id
                    })">
                        <i class="fas fa-eye"></i> Details
                    </button>
                </div>
            </div>
        `;
  }

  // الحصول على أيقونة حسب الدور
  getRoleIcon(role) {
    const icons = {
      user: "fa-user",
      hospital: "fa-hospital",
      pharmacy: "fa-pills",
      admin: "fa-user-shield",
    };
    return icons[role] || "fa-user";
  }

  // الموافقة على الطلب
  approveRequest(requestId) {
    if (
      confirm("Are you sure you want to approve this registration request?")
    ) {
      const requestIndex = this.pendingRequests.findIndex(
        (req) => req.id === requestId
      );

      if (requestIndex !== -1) {
        // تحديث حالة الطلب
        this.pendingRequests[requestIndex].status = "approved";
        this.pendingRequests[requestIndex].approvedAt =
          new Date().toISOString();
        this.pendingRequests[requestIndex].approvedBy = "Admin User";

        // حفظ في localStorage
        localStorage.setItem(
          "pendingRequests",
          JSON.stringify(this.pendingRequests)
        );

        // نقل المستخدم للموافق عليهم
        this.moveToApprovedUsers(this.pendingRequests[requestIndex]);

        // إعادة تحميل العرض
        this.displayPendingRequests();

        // إظهار رسالة نجاح
        this.showNotification("Request approved successfully!", "success");

        // إعادة توجيه المستخدم للصفحة الرئيسية مع رسالة الموافقة
        this.redirectUserToLogin(requestId);
      }
    }
  }

  // رفض الطلب
  rejectRequest(requestId) {
    const reason = prompt("Please enter reason for rejection:");
    if (reason !== null) {
      const requestIndex = this.pendingRequests.findIndex(
        (req) => req.id === requestId
      );

      if (requestIndex !== -1) {
        this.pendingRequests[requestIndex].status = "rejected";
        this.pendingRequests[requestIndex].rejectedAt =
          new Date().toISOString();
        this.pendingRequests[requestIndex].rejectionReason = reason;

        localStorage.setItem(
          "pendingRequests",
          JSON.stringify(this.pendingRequests)
        );
        this.displayPendingRequests();

        this.showNotification("Request rejected successfully!", "error");
      }
    }
  }

  // نقل المستخدم للموافق عليهم
  moveToApprovedUsers(request) {
    const approvedUsers =
      JSON.parse(localStorage.getItem("approvedUsers")) || [];
    approvedUsers.push(request);
    localStorage.setItem("approvedUsers", JSON.stringify(approvedUsers));
  }

  // عرض التفاصيل
  viewDetails(requestId) {
    const request = this.pendingRequests.find((req) => req.id === requestId);
    if (request) {
      const details = `
                Role: ${request.role}
                Email: ${request.email}
                Phone: ${request.phone}
                Name: ${
                  request.hospitalName ||
                  `${request.firstName} ${request.lastName}`
                }
                Submitted: ${new Date(request.timestamp).toLocaleString()}
            `;
      alert(details);
    }
  }

  // إعادة توجيه المستخدم للصفحة الرئيسية
  redirectUserToLogin(requestId) {
    // هنا يمكنك إضافة منطق لإرسال إشارة للمستخدم
    console.log(
      `User with request ${requestId} should be redirected to login page with approval message`
    );
  }

  // إظهار الإشعارات
  showNotification(message, type) {
    // يمكنك استخدام مكتبة إشعارات أو إنشاء إشعار مخصص
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.innerHTML = `
            <i class="fas ${
              type === "success" ? "fa-check-circle" : "fa-exclamation-circle"
            }"></i>
            ${message}
        `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 3000);
  }

  setupEventListeners() {
    // تحديث تلقائي كل 30 ثانية
    setInterval(() => {
      this.displayPendingRequests();
    }, 30000);
  }
}

// تهيئة النظام
const adminManager = new AdminRequestManager();
