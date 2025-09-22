const form = document.getElementById("myForm");
const popup = document.getElementById("popupOverlay");
const closePopupBtn = document.getElementById("closePopup");

form.addEventListener("submit", function (e) {
  e.preventDefault();
  if (form.checkValidity()) {
    popup.classList.add("active"); // فعل الأنيميشن
    form.reset();
  }
});

closePopupBtn.addEventListener("click", function () {
  popup.classList.remove("active"); // رجعها مخفية
  setTimeout(() => (popup.style.display = "none"), 500);
});

popup.addEventListener("click", function (e) {
  if (e.target === popup) {
    popup.classList.remove("active");
    setTimeout(() => (popup.style.display = "none"), 500);
  }
});
