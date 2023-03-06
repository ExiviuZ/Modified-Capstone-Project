const user = document.querySelector(".user");
const userDropdown = document.querySelector(".user-dropdown");

user.addEventListener("click", (e) => {
  userDropdown.classList.toggle("active");
});
