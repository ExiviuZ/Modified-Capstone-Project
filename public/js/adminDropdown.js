const admin = document.querySelector(".admin");
const dropdown = document.querySelector(".dropdown");

admin.addEventListener("click", (e) => {
  dropdown.classList.toggle("active");
});
