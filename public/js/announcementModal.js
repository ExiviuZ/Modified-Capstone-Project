const addAnnouncement = document.querySelector(".add-announcement");
const closeAnnouncement = document.querySelector(".close-announcement");
const announcementModal = document.querySelector(".announcement-modal");

addAnnouncement.addEventListener("click", (e) => {
  announcementModal.showModal();
  announcementModal.classList.add("active");
});

closeAnnouncement.addEventListener("click", (e) => {
  announcementModal.classList.remove("active");

  announcementModal.close();
});