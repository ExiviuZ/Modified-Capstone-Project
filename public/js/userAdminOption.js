function myfunction() {
  if (validation()) {
    // Calling Validation function.
    //select option value from select tag and storing it in a variable.
    var index = document.querySelector(".selectInput").selectedIndex;
    var actionLink = document.getElementsByTagName("option")[index].value;
    if (actionLink !== "") {
      document.querySelector(".form").action = actionLink;
      document.querySelector(".form").submit();
    } else {
      alert("Please set form action");
    }
  }
}
// Name and Email validation Function.
function validation() {
  var username = document.getElementById("username").value;
  var password = document.getElementById("password").value;
  if (username === "" || password === "") {
    alert("Please fill all fields!");
    return false;
  } else {
    return true;
  }
}
