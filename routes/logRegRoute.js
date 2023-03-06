const express = require("express");
const router = express.Router();
const { loggedIn } = require("../middleware");

router.get("/register", loggedIn, async (req, res) => {
  res.render("register", { title: "Register || Barangay Mag-Asawang Sapa" });
});

router.get("/login", loggedIn, async (req, res) => {
  res.render("login", { title: "Login || Barangay Mag-Asawang Sapa" });
});

router.get("/logout", async (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "Good Bye!");
    res.redirect("/login");
  });
});

module.exports = router;
