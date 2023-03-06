const express = require("express");
const cloudinary = require("cloudinary").v2;
const router = express.Router();
const { notLoggedIn, loggedIn, notUser } = require("../middleware");
const { catchAsync } = require("../utils/errorHandler");
const User = require("../model/user");
const passport = require("passport");
const multer = require("multer");
const { profilePictureStorage, idCardStorage } = require("../cloudinary/index");
const Admin = require("../model/admin");
const idCardUpload = multer({ storage: idCardStorage });
const sharp = require('sharp')
const request = require('request-promise-native')
const profilePicUpload = multer({ storage: profilePictureStorage });


router.post(
  "/register",
  catchAsync(async (req, res, next) => {
    try {
      const {
        firstName,
        lastName,
        username,
        gender,
        birthday,
        maritalStatus,
        houseNumber,
        sitio,
        contact,
        password,
      } = req.body;
      const user = new User({
        combName: `${firstName} ${lastName}`,
        firstName,
        lastName,
        gender,
        birthday,
        maritalStatus,
        username,
        contact,
        address: {
          sitio,
          houseNumber,
        },
      });

      const registeredUser = await User.register(user, password);
      await user.save();
      req.login(registeredUser, (err) => {
        if (err) {
          console.log(err)
          return next(err);
        } else {
          req.flash("success", "Welcome To Your Dashboard!");
          return res.redirect(`/user/announcement`);
        }
      });
    }
    catch (err) {
      req.flash("error", err.message);
      res.redirect("/register");
    }
  })
);

router.post(
  "/login",
  (req, res, next) => {
    req.body.username = req.body.username.toLowerCase();
    next();
  },
  passport.authenticate("user", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  async (req, res) => {
    req.flash("success", "Welcome Back  !");
    return res.redirect("/user/announcement");
  }
);

router.get("/profile", notLoggedIn, notUser, async (req, res) => {
  const user = await User.findById(req.user._id);
  res.render("user/profile", {
    title: "Profile || Barangay Mag-Asawang Sapa",
    user,
  });
});

router.post("/profile/:id", notLoggedIn, notUser, async (req, res) => {
  const { id } = req.params;
  console.log('The Submitted Values:')
  console.log(req.body)
  const user = await User.findById(id);
  const {
    firstName,
    lastName,
    houseNumber,
    sitio,
    contact,
    birthday,
    maritalStatus,
    gender,
    vaccineName,
    vaccineDosage,
    boosterName,
    boosterDosage,
  } = req.body;

  user.firstName = firstName;
  user.lastName = lastName;
  user.combName = `${firstName} ${lastName}`;
  user.contact = contact;
  user.address = {
    houseNumber,
    sitio,
  };
  user.birthday = birthday;
  user.maritalStatus = maritalStatus;
  user.gender = gender;

  user.vaccineDosage = vaccineDosage,
  user.vaccineName = (vaccineName === undefined) ? '0' : vaccineName,
  user.boosterName = (boosterName === undefined) ? '0' : boosterName,
  user.boosterDosage = (boosterDosage === undefined) ? '0' : boosterDosage,

  console.log('The Saved Values')
  console.log(user)
  await user.save();
  req.flash("success", "Successfully Updated Information");
  res.redirect("/user/profile");
});

router.get("/profile/edit/:id", notLoggedIn, notUser, async (req, res) => {
  const {id} = req.params
  const user = await User.findById(req.user._id);
  user.household.forEach(member => {
    if(`${member._id}` == id){
      console.log(member)
      res.render("user/editMember", {member})
    }
  })
})
router.post("/profile/edit/:id", notLoggedIn, notUser, async (req, res) => {
  const {id} = req.params
  var {name,birthday,education,maritalStatus,relationship,gender,vaccineDosage,vaccineName, boosterDosage, boosterName} = req.body
  User.updateOne({ _id: req.user._id, "household._id":  id},
{ $set: { 'household.$.name': name, 'household.$.birthday' : birthday, 'household.$.education' : education, 'household.$.maritalStatus' : maritalStatus,  'household.$.relationship' : relationship, 'household.$.gender' : gender, 'household.$.vaccineDosage' : vaccineDosage, 'household.$.vaccineName' : vaccineName = (vaccineName === undefined) ? '0' : vaccineName, 'household.$.boosterDosage' : boosterDosage = (boosterDosage === undefined) ? '0' : boosterDosage , 'household.$.boosterName' : boosterName = (boosterName === undefined) ? '0' : boosterName} },
{ new: true },
(err, doc) => {
    if (err) {
        console.log(err);
    } else {
        console.log(doc);
    }
});

req.flash("success", `Successfully Updated ${name}'s information`);
res.redirect('/user/profile')
  
})

router.delete("/profile/:id", notLoggedIn, notUser, async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(req.user._id);
  console.log(id)
  user.household.pull({ _id: id });
  await user.save()
  req.flash("success", "Successfully Deleted a Member");
  res.redirect('/user/profile#household-list')
})

 //   const user = await User.findById(req.user._id);
    // console.log(req)
    // user.image.push({
    //   url: req.file.path,
    //   fileName: req.fileName,
    // });
    // await user.save();
    // req.flash("success", "Successfully Changed Your Picture");
    // res.redirect("/user/profile");
    router.post(
      "/upload",
      notLoggedIn,
      notUser,
      profilePicUpload.single("image"),
      async (req, res) => {
        try {
          // Resize and crop the image using Sharp
          const imageBuffer = await request.get({ url: req.file.path, encoding: null });
          const buffer = await sharp(imageBuffer)
            .resize({ width: 500, height: 500, fit: 'cover', position: 'center' })
            .toBuffer();
    
          // Upload the cropped image to Cloudinary
          const result = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream({ resource_type: 'image' }, (error, result) => {
              if (error) {
                console.error(error);
                reject(error);
              } else {
                resolve(result);
              }
            }).end(buffer);
          });
    
          // Save the Cloudinary URL and public ID to the user's profile
          const user = await User.findById(req.user._id);
          user.image.push({
            url: result.secure_url,
            fileName: result.public_id,
          });
          await user.save();
    
          // Redirect back to the profile page with a success message
          req.flash("success", "Successfully Changed Your Picture");
          res.redirect("/user/profile");
        } catch (error) {
          console.error(error);
          req.flash("error", "Failed to upload image to Cloudinary");
          return res.redirect("/user/profile");
        }
      }
    );
    

router.get("/census", notLoggedIn, notUser, async (req, res) => {
  const user = await User.findById(req.user._id);
  console.log(user);
  res.render("user/census", {
    title: "Census || Barangay Mag-Asawang Sapa",
    user,
  });
});

router.post("/census", notLoggedIn, notUser, async (req, res) => {
  const household = req.body;
  const user = await User.findById(req.user._id);

  household.people.forEach(function (person) {
    person.vaccineName = (person.vaccineName === undefined) ? '0' : person.vaccineName,
    person.boosterName = (person.boosterName === undefined) ? '0' : person.boosterName,
    person.boosterDosage = (person.boosterDosage === undefined) ? '0' : person.boosterDosage,
    user.household.push(person);
  });
  user.answeredCensus = true;
  await user.save();
  // for (member of household) {
  //   user.household.push(member);
  // }

  // user.save();
  req.flash("success", "Successfully Recorded Your Submission!");
  res.redirect("/user/profile");
});

router.post("/census/new", notLoggedIn, notUser, async (req, res) => {
  const newMember = req.body
  const user = await User.findById(req.user._id);
  user.household.push(newMember);
  await user.save()
  req.flash("success", "Successfully Added a New Member");
  res.redirect('/user/profile#household-list')
});


router.get("/announcement", notLoggedIn, notUser, async (req, res) => {
  const admin = await Admin.findOne()

  const announcements = admin.announcements.reverse()

var mappedEvents = admin.events.map(event => {
  return {title: event.title, start: event.start, end: event.end}
})


  res.render("user/announcement", {
    title: "Announcement || Barangay Mag-Asawang Sapa", admin, announcements, mappedEvents
  });
});

module.exports = router;
