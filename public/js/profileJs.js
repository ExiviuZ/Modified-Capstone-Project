      var toDelete = "";
      var modal = document.getElementById("id01");
      var deleteForm = document.querySelector(".delete-form");
      const editMembersBtn = document.querySelectorAll('.edit-member')
      const closeMembersBtn = document.querySelectorAll('.close-member-edit')
      const editMembersForm = document.querySelectorAll('.all-edit-member-form')  
      const deleteMembersBtn = document.querySelectorAll('.delete-btn')
      const openModal = document.querySelector('.edit-btn')
      const closeModal = document.querySelector('.close-btn')
      const profileDialog = document.querySelector('.profile-dialog')
      const newMemberDialog = document.querySelector('.new-member-dialog')
      const addAnotherBtn = document.querySelector('.add-another button')
      const closeAnotherBtn = document.querySelector('.close-new-member')
      const userVaccineDosageTag = document.querySelector("[data-userVaccineDosage]");
      const userVaccineNameTag = document.querySelector("[data-userVaccineName]");
      const userBoosterDosageTag = document.querySelector("[data-userBoosterDosage]");
      const userBoosterNameTag = document.querySelector("[data-userBoosterName]");
      const newUserVaccineDosageTag = document.querySelector("[data-newUserVaccineDosage]");
      const newUserVaccineNameTag = document.querySelector("[data-newUserVaccineName]");
      const newUserBoosterDosageTag = document.querySelector("[data-newUserBoosterDosage]");
      const newUserBoosterNameTag = document.querySelector("[data-newUserBoosterName]");
      const vaccineDosageTags = document.querySelectorAll("[data-vaccineDosage]");
      const vaccineNameTags = document.querySelectorAll("[data-vaccineName]");
      const boosterDosageTags = document.querySelectorAll("[data-boosterDosage]");
      const boosterNameTags = document.querySelectorAll("[data-boosterName]");
      const uploadForms = document.querySelectorAll(".form-img");


window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};
function openModalFunc(clicked_id) {
  document.getElementById("id01").style.display = "block";
  toDelete = clicked_id;
}

function deleteHousehold() {
  deleteForm.action = `/user/profile/${toDelete}?_method=DELETE`;
  deleteForm.submit();
}
      uploadForms.forEach((form) => {
        form.querySelector('input[type="file"]').onchange = function () {
          form.submit();
        };
      });

     

      editMembersBtn.forEach((button, index) => {
  button.addEventListener("click", () => {
    editMembersForm[index].showModal()
    editMembersForm[index].classList.add('shown')
    document.querySelector('body').classList.add('modal-active')
  });
});

deleteMembersBtn.forEach((button, index) => {
  button.addEventListener("click", () => {
   
  });
});

closeMembersBtn.forEach((button, index) => {
  button.addEventListener("click", () => {
    editMembersForm[index].close()
    editMembersForm[index].classList.remove('shown')
    document.querySelector('body').classList.remove('modal-active')

  });
});

      

      openModal.addEventListener('click', (e) => {
       profileDialog.showModal()
       profileDialog.classList.add('active')
       document.querySelector('body').classList.add('modal-active')
      })
      closeModal.addEventListener('click', (e) => {
       profileDialog.close()
       profileDialog.classList.remove('active')
       document.querySelector('body').classList.remove('modal-active')

      })


      
      
      if(addAnotherBtn){
        addAnotherBtn.addEventListener('click', function(event) {
         newMemberDialog.showModal()
         newMemberDialog.classList.add('shown')
         document.querySelector('body').classList.add('modal-active')
      })
      closeAnotherBtn.addEventListener('click', function(event) {
         newMemberDialog.close()
         newMemberDialog.classList.remove('shown')
         document.querySelector('body').classList.remove('modal-active')
      })
      }

      

      userVaccineDosageTag.addEventListener("change", () => {
        if (userVaccineDosageTag.value === "0") {
          userVaccineNameTag.disabled = true;
          userBoosterDosageTag.disabled = true;
          userBoosterNameTag.disabled = true;
          userVaccineNameTag.options[0].selected = true
          userBoosterDosageTag.options[0].selected = true
          userBoosterNameTag.options[0].selected = true
        } else if (userVaccineDosageTag.value === "1") {
          userVaccineNameTag.disabled = false;
          userBoosterDosageTag.disabled = true;
          userBoosterNameTag.disabled = true;
        } else if (userVaccineDosageTag.value === "2") {
          userVaccineNameTag.disabled = false;
          userBoosterDosageTag.disabled = false;
          userBoosterNameTag.disabled = false;
        } 
      });

      // Disable boosterDosage and boosterNameTag initially

      
      if(userVaccineDosageTag.value == '0'){
        userVaccineNameTag.disabled = true;
        userBoosterDosageTag.disabled = true;
      userBoosterNameTag.disabled = true;
      }
      

      

      newUserVaccineDosageTag.addEventListener("change", () => {
        if (newUserVaccineDosageTag.value === "0") {
          newUserVaccineNameTag.disabled = true;
          newUserBoosterDosageTag.disabled = true;
          newUserBoosterNameTag.disabled = true;
          newUserVaccineNameTag.options[0].selected = true
          newUserBoosterDosageTag.options[0].selected = true
          newUserBoosterNameTag.options[0].selected = true
        } else if (newUserVaccineDosageTag.value === "1") {
          newUserVaccineNameTag.disabled = false;
          newUserBoosterDosageTag.disabled = true;
          newUserBoosterNameTag.disabled = true;
        } else if (newUserVaccineDosageTag.value === "2") {
          newUserVaccineNameTag.disabled = false;
          newUserBoosterDosageTag.disabled = false;
          newUserBoosterNameTag.disabled = false;
        } 
      });

      newUserVaccineNameTag.disabled = true;
      newUserBoosterDosageTag.disabled = true;
      newUserBoosterNameTag.disabled = true;


      

      vaccineDosageTags.forEach((tag,index) => {
    if (tag.value === "0") {
      vaccineNameTags[index].disabled = true;
      boosterDosageTags[index].disabled = true;
      boosterNameTags[index].disabled = true;
      vaccineNameTags[index].options[0].selected = true
      boosterDosageTags[index].options[0].selected = true
      boosterNameTags[index].options[0].selected = true
    } else if (tag.value === "1") {
      vaccineNameTags[index].disabled = false;
      boosterDosageTags[index].disabled = true;
      boosterNameTags[index].disabled = true;
    } else if (tag.value === "2") {
      vaccineNameTags[index].disabled = false;
      boosterDosageTags[index].disabled = false;
      boosterNameTags[index].disabled = false;
    } 
});

      vaccineDosageTags.forEach((tag,index) => {
  tag.addEventListener("change", function(){
    if (tag.value === "0") {
      vaccineNameTags[index].disabled = true;
      boosterDosageTags[index].disabled = true;
      boosterNameTags[index].disabled = true;
      vaccineNameTags[index].options[0].selected = true
      boosterDosageTags[index].options[0].selected = true
      boosterNameTags[index].options[0].selected = true
    } else if (tag.value === "1") {
      vaccineNameTags[index].disabled = false;
      boosterDosageTags[index].disabled = true;
      boosterNameTags[index].disabled = true;
    } else if (tag.value === "2") {
      vaccineNameTags[index].disabled = false;
      boosterDosageTags[index].disabled = false;
      boosterNameTags[index].disabled = false;
    } 
  });
});
  
