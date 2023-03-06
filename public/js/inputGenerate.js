const add = document.querySelector(".add");
const minus = document.querySelector(".minus");
const personContainer = document.querySelector(".personContainer");
const form = document.querySelector("form");
const buttons = document.querySelector(".buttons");

var globalCount = 1;

function clone() {
  var cloned = personContainer.cloneNode(true);

  // Name
  cloned
    .querySelector("[data-name]")
    .setAttribute("name", `people[${globalCount + 1}][name]`);
  cloned.querySelector("[data-name]").value = "";

  // Education
  cloned
    .querySelector("[data-education]")
    .setAttribute("name", `people[${globalCount + 1}][education]`);
  cloned.querySelector("[data-education]").selectedIndex = "0";

  // Birthday
  cloned
    .querySelector("[data-birthday]")
    .setAttribute("name", `people[${globalCount + 1}][birthday]`);
  cloned.querySelector("[data-birthday]").value = "";

  // Marital Status
  cloned
    .querySelector("[data-maritalStatus]")
    .setAttribute("name", `people[${globalCount + 1}][maritalStatus]`);
  cloned.querySelector("[data-maritalStatus]").selectedIndex = "0";

  // Relationship
  cloned
    .querySelector("[data-relationship]")
    .setAttribute("name", `people[${globalCount + 1}][relationship]`);
  cloned.querySelector("[data-relationship]").selectedIndex = "0";

  // Vaccine Dosage
  cloned.querySelector("[data-vaccineDosage]").setAttribute("name", `people[${globalCount + 1}][vaccineDosage]`);
  cloned.querySelector("[data-vaccineDosage]").selectedIndex = "0";
  
  // Vaccine Name
  cloned.querySelector("[data-vaccineName]").setAttribute("name", `people[${globalCount + 1}][vaccineName]`);
  cloned.querySelector("[data-vaccineName]").setAttribute("disabled", true);
  cloned.querySelector("[data-vaccineName]").selectedIndex = "0";

  // Booster Dosage
  cloned.querySelector("[data-boosterDosage]").setAttribute("name", `people[${globalCount + 1}][boosterDosage]`);
  cloned.querySelector("[data-boosterDosage]").selectedIndex = "0";
  cloned.querySelector("[data-boosterDosage]").setAttribute("disabled", true);

  // Booster Name
  cloned.querySelector("[data-boosterName]").setAttribute("name", `people[${globalCount + 1}][boosterName]`);
  cloned.querySelector("[data-boosterName]").selectedIndex = "0";
  cloned.querySelector("[data-boosterName]").setAttribute("disabled", true);

  // Gender
  const genderRadio = cloned.querySelectorAll("[data-gender]");

  genderRadio.forEach((radio) => {
    radio.setAttribute("name", `people[${globalCount + 1}][gender]`);
    radio.checked = false;
  });

  // Change Value per Person

  globalCount++;
  return cloned;
}
add.addEventListener("click", (e) => {
  form.insertBefore(clone(), buttons);

  const vaccineDosageTags = document.querySelectorAll("[data-vaccineDosage]");
  const vaccineNameTags = document.querySelectorAll("[data-vaccineName]");
  const boosterDosageTags = document.querySelectorAll("[data-boosterDosage]");
  const boosterNameTags = document.querySelectorAll("[data-boosterName]");

// Add event listeners to all vaccine dosage tags
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
  
});

minus.addEventListener("click", (e) => {
  const generatedFields = form.querySelectorAll(".personContainer");
  if (generatedFields.length > 1) {
    generatedFields[generatedFields.length - 1].remove();
  }
});

// remove.addEventListener('click', (e) => {
//     form.
// })
