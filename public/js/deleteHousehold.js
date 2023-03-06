// Get the modal
var modal = document.getElementById("id01");

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};
var toDelete = "";
function openModal(clicked_id) {
  document.getElementById("id01").style.display = "block";
  toDelete = clicked_id;
}

var deleteForm = document.querySelector(".delete-form");
function deleteHousehold() {
  deleteForm.action = `/admin/household/${toDelete}?_method=DELETE`;
  deleteForm.submit();
}
