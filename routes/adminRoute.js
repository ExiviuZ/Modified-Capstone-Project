const express = require("express");
const router = express.Router();
const { notLoggedIn, notAdmin } = require("../middleware");
const User = require("../model/user");
const Admin = require("../model/admin");
const passport = require("passport");
const multer = require('multer')
const {announcementStorage} = require('../cloudinary/index')
const request = require('request-promise-native')
const upload = multer({storage: announcementStorage})
const { ObjectId } = require('mongodb');
const { image } = require("pdfkit");

//Create Admin
//  router.get('/new', async (req,res) => {

//    const user = new Admin({
//      name: "Administrator",
//      username: 'admin'
//    });

//    const registeredUser = await Admin.register(user, 'admin');
//    await user.save();
//    res.send('new admin')
//  })



router.post('/announcement', upload.single('image') ,notLoggedIn, notAdmin, async (req,res) => {
  console.log(req.file.path)
  const admin = await Admin.findOne()

  req.body.image = {
    link: req.file.path,
    fileName: req.file.filename
  }

  admin.announcements.push(req.body)
  await admin.save()
  req.flash('success', "Successfully Added An Announcement")
  res.redirect('/admin/announcement')
})

router.get("/household", notLoggedIn, notAdmin, async (req, res) => {
  if(req.query.sitio){
    console.log("the user is sorting");
    var sorting = true;
    var searching = false;
    const sitioUsers = await User.find({'address.sitio': req.query.sitio, 'verificationStatus': 'verified'})
    return res.render("admin/household", {
      title: "Sorted Households || Barangay Mag-Asawang Sapa",
      sitioUsers,
      sitioPlace: req.query.sitio,
      sorting,
      searching
    });
  }
  if (req.query.name) {
    console.log("the user is searching");
    var searching = true;
    var sorting = false;
    const users = await User.find({
      combName: { $regex: req.query.name.trim(), $options: "i" }, verificationStatus: 'verified'
    })
      .collation({ locale: "en", strength: 2 })
      .sort({ combName: 1 });
    return res.render("admin/household", {
      title: "Searched Households || Barangay Mag-Asawang Sapa",
      users,
      searching,
      sorting
    });
  } else {
    var searching = false;
    var sorting = false;
    const users = await User.find({verificationStatus: 'verified'})
      .collation({ locale: "en", strength: 2 })
      .sort({ combName: 1 });
    return res.render("admin/household", {
      title: "All Households || Barangay Mag-Asawang Sapa",
      users,
      searching,
      sorting
    });
  }
});

router.get('/monthly', notLoggedIn, notAdmin, async (req, res) => {
  const allUser = await User.find({verificationStatus: 'verified'});

  const countPerMonth = [];

  for (const user of allUser) {
    const createdAt = new Date(user.createdAt);
    const month = createdAt.getMonth();
    const year = createdAt.getFullYear();

    const existingMonth = countPerMonth.find(m => m.month === month && m.year === year);

    if (existingMonth) {
      existingMonth.count++;
      const userData = await User.findById(user._id);
      existingMonth.registreesId.push(userData);
    } else {
      const userData = await User.findById(user._id);
      countPerMonth.push({
        month,
        year,
        count: 1,
        registreesId: [userData],
      });
    }
  }

  countPerMonth.sort((a, b) => {
    if (a.year !== b.year) {
      return b.year - a.year;
    } else {
      return b.month - a.month;
    }
  });

    const myObject = {
      converter: function(number){
        const monthNames = [
          "January", "February", "March", "April", "May", "June", "July",
          "August", "September", "October", "November", "December" ]; 
          return monthNames[number]; 
      } 
    }

  res.render('admin/monthly', {title: 'Generate Data || Barangay Mag-Asawang Sapa', countPerMonth, myObject})
});

router.get("/", notLoggedIn, notAdmin, async (req, res) => {
  var residentCount = 0;
  var maleCount = 0;
  var femaleCount = 0;
  const householdCount = await User.count({verificationStatus: 'verified'});
  const registrees = await User.find({verificationStatus:'verified'});
 
  const admin = await Admin.findOne()

  
  // Total Residents
  for (registree of registrees) {
    if (!registree.answeredCensus){
      residentCount += 1;
    } else {
      residentCount += registree.household.length + 1;
    }
  }
  // Count Resident by Gender
  for (registree of registrees) {
    if (!registree.answeredCensus) {
      if (registree.gender == "male") {
        maleCount += 1;
      } else {
        femaleCount += 1;
      }
    } else {
      if (registree.gender == "male") {
        maleCount += 1;
      } else {
        femaleCount += 1;
      }

      for (member of registree.household) {
        if (member.gender == "male") {
          maleCount += 1;
        } else {
          femaleCount += 1;
        }
      }
    }
  }

  res.render("admin/index", {
    title: "Dashboard || Barangay Mag-Asawang Sapa",
    householdCount,
    residentCount,
    femaleCount,
    maleCount,    
  });
});

router.get('/events', notLoggedIn, notAdmin, async (req, res) => {
  const admin = await Admin.findOne()
  var mappedEvents = admin.events.map(event => {
    return {title: event.title, start: event.start, id: event._id}
  })
  res.json(mappedEvents);
})

router.post(
  "/login",
  (req, res, next) => {
    req.body.username = req.body.username.toLowerCase();
    next();
  },
  passport.authenticate("admin", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  async (req, res) => {
    req.flash("success", "Welcome Back, Admin!");
    res.redirect("/admin/");
  }
);

 router.get('/verification', notLoggedIn, notAdmin, async (req, res) => {

  if(req.query.sitio){
    console.log("the user is sorting");
    console.log(req.query.sitio)
    var sorting = true;
    const toVerifySitioUsers = await User.find({'address.sitio': req.query.sitio, 'verificationStatus': 'pending'})
    console.log(toVerifySitioUsers)
    return res.render("admin/verification", {
      title: "Sorted To Verify Households || Barangay Mag-Asawang Sapa",
      toVerifySitioUsers,
      sitioPlace: req.query.sitio,
      sorting,
    });
  }
   else {
    var sorting = false;
    const unverifiedUsers = await User.find({verificationStatus: 'pending'})
    if(!sorting && !(unverifiedUsers.length < 1)){
      console.log('yes you are correct')
    }
    return res.render("admin/verification", {
      title: "To Verify Households || Barangay Mag-Asawang Sapa",
      unverifiedUsers,
      sorting
    });
  }

 })

 

 
router.get('/covid', notLoggedIn, notAdmin, async (req, res) => {

  if(req.query.sitio){
    console.log("the user is sorting");
    var sorting = true;
    const sitioUsers = await User.find({'address.sitio': req.query.sitio, 'verificationStatus': 'verified'})
    return res.render("admin/covid", {
      title: "Sorted To Generate Households || Barangay Mag-Asawang Sapa",
      sitioUsers,
      sitioPlace: req.query.sitio,
      sorting,
    });
  }
   else {
    var sorting = false;
    const allUser = await User.find({verificationStatus: 'verified'});
    allUser.sort((a, b) => (a.address.sitio > b.address.sitio) ? 1 : -1)
  
      var sitios = {
        'ibabaw': {
          members: [],
          name: 'Ibabaw'
  
        },
        'sulucanI': {
          members: [],
          name: 'Sulucan I'
  
        },
        'sulucanII': {
          members: [],
          name: 'Sulucan II'
        },
        'sulucanIII': {
          members: [],
          name: 'Sulucan III'
        },
        'centro': {
          members: [],
          name: 'Centro'
        },
        'hulo': {
          members: [],
          name: 'Hulo'
        },
        'pulongBocaue': {
          members: [],
          name: 'Pulong Bocaue'
        },
        'putol': {
          members: [],
          name: 'Putol'
        },
        'bancaBanca': {
          members: [],
          name: 'Banca Banca'
        },
        'elPueblo': {
          members: [],
          name: 'El Pueblo'
        },
      }
  
      for(registree of allUser){
        if(registree.address.sitio == 'Ibabaw'){
          sitios.ibabaw.members.push(registree)
        }else if(registree.address.sitio == 'Sulucan I'){
          sitios.sulucanI.members.push(registree)
        }
        else if(registree.address.sitio == 'Sulucan II'){
          sitios.sulucanII.members.push(registree)
        }
        else if(registree.address.sitio == 'Sulucan III'){
          sitios.sulucanIII.members.push(registree)
        }
        else if(registree.address.sitio == 'Centro'){
          sitios.centro.members.push(registree)
        }
        else if(registree.address.sitio == 'Hulo'){
          sitios.hulo.members.push(registree)
        }
        else if(registree.address.sitio == 'Pulong Bocaue'){
          sitios.pulongBocaue.members.push(registree)
        }
        else if(registree.address.sitio == 'Putol'){
          sitios.putol.members.push(registree)
        }
        else if(registree.address.sitio == 'Banca Banca'){
          sitios.bancaBanca.members.push(registree)
        }
        else if(registree.address.sitio == 'El Pueblo'){
          sitios.elPueblo.members.push(registree)
        }
      }


    return res.render("admin/covid", {
      title: "Generate Data || Barangay Mag-Asawang Sapa",
      allUser,
      sorting,
      sitios
    });
  }









 


    // for (let sitio in sitios) {
    //   if (sitios.hasOwnProperty(sitio)) {
    //     console.log(`${sitio}: ${sitios[sitio].members.length}`);
    //   }
    // }

    

  res.render('admin/covid', {title: 'Generate Data || Barangay Mag-Asawang Sapa', sitios})
});


 router.post('/verify/:id', notLoggedIn, notAdmin, async (req, res) => {
  const {id}= req.params
  const {action} = req.query
  const user = await User.findById(id)

  if(!user){
    req.flash('error', 'No User with that ID')
    return res.redirect('/admin/verification')
  }
  const outcome = (action === 'approve') ? 'verified' : 'unverified';
  if(action == 'approve'){
    user.verificationStatus = outcome
    await user.save()
    req.flash('success', 'Approved a household registrant!')
    return res.redirect('/admin/verification')
  }
  else if(action == 'reject'){
    user.verificationStatus = outcome
    await user.save()
    req.flash('error', 'Rejected a household registrant!')
    return res.redirect('/admin/verification')
  }
 })

router.delete('/events/:id', notLoggedIn, notAdmin, async (req, res) => {
  const {id} = req.params
  const admin = await Admin.findOne()
  admin.events.pull({ _id: id });
  await admin.save()
  res.status(200).send()
})

router.delete('/announcement/:id', notLoggedIn, notAdmin, async (req, res) => {
  const {id} = req.params
  const admin = await Admin.findOne()
  admin.announcements.pull({ _id: id });
  await admin.save()
  res.status(200).send()
})

// router.post('/report', notLoggedIn, notAdmin, async (req, res) => {
//   const admin = await Admin.findOne()
//   const{title, start} = req.body

//   const newEvent = {
//     title,
//     start: start,
//     _id: new ObjectId(),
//   }

//   admin.events.push(newEvent)
//   await admin.save()
  
//  res.status(200).json(newEvent);
// })

router.get('/announcement', notLoggedIn, notAdmin, async (req, res) => {
  const admin = await Admin.findOne()
  const announcements = admin.announcements
  res.render('admin/manageAnnouncement', {title: "Manage Announcement || Barangay Mag-Asawang Sapa", announcements})
})

router.get('/report', notLoggedIn, notAdmin, async (req, res) => {
  const admin = await Admin.findOne()
  var ageGroup = {
    "infant": 0,
    "toddler": 0,
    "child": 0,
    "teen": 0,
    "adult": 0,
    "middleAdult": 0,
    "seniorAdult": 0
};
  var religionGroup = {
    "romanCatholic": 0,
    "iglesiaNiCristo": 0,
    "bornAgain": 0,
    "islam": 0,
    "others": 0
};
  var occupationGroup = {
    "privateEmployee": 0,
    "governmentEmployee": 0,
    "unemployed": 0,
    "student": 0,
    "ofw": 0,
    "others": 0
};
var vaccineCount = {
  'pfizer': {
      'firstDoseCount': 0,
      'secondDoseCount': 0,
      'firstBoosterCount': 0,
      'secondBoosterCount': 0
  },
  'janssen': {
      'firstDoseCount': 0,
      'secondDoseCount': 0,
      'firstBoosterCount': 0,
      'secondBoosterCount': 0
  },
  'astrazenica': {
      'firstDoseCount': 0,
      'secondDoseCount': 0,
      'firstBoosterCount': 0,
      'secondBoosterCount': 0
  },
  'coronavac': {
      'firstDoseCount': 0,
      'secondDoseCount': 0,
      'firstBoosterCount': 0,
      'secondBoosterCount': 0
  },
  'sinopharm': {
      'firstDoseCount': 0,
      'secondDoseCount': 0,
      'firstBoosterCount': 0,
      'secondBoosterCount': 0
  },
  'moderna': {
      'firstDoseCount': 0,
      'secondDoseCount': 0,
      'firstBoosterCount': 0,
      'secondBoosterCount': 0
  },
}

const registrees = await User.find({verificationStatus: 'verified'});

// Function to increment vaccine count
for (var i = 0; i < registrees.length; i++) {
  var obj = registrees[i];
  // Check if vaccine name exists in vaccineCount object
  if (vaccineCount.hasOwnProperty(obj.vaccineName)) {
    // Increment vaccine count for primary vaccine
    if(obj.vaccineDosage == '1'){
      vaccineCount[obj.vaccineName]['firstDoseCount'] += 1;
    }
    else {
      vaccineCount[obj.vaccineName]['secondDoseCount'] += 1; 
    }
    
    // Increment vaccine count for booster vaccine, if applicable
    if (vaccineCount.hasOwnProperty(obj.boosterName)) {

      if(obj.boosterDosage == '1'){
        vaccineCount[obj.boosterName]['firstBoosterCount'] += 1;
      }
      else {
        vaccineCount[obj.boosterName]['secondBoosterCount'] += 1; 
      }
    }
  }
  
  // Increment vaccine count for household members
  if(obj.household.length > 0){
    for (var j = 0; j < obj.household.length; j++) {
      var householdMember = obj.household[j];
      // Check if vaccine name exists in vaccineCount object
      if (vaccineCount.hasOwnProperty(householdMember.vaccineName)) {
        if(householdMember.vaccineDosage == '1'){
          vaccineCount[householdMember.vaccineName]['firstDoseCount'] += 1;
        }
        else {
          vaccineCount[householdMember.vaccineName]['secondDoseCount'] += 1; 
        }
        
        if (householdMember.boosterName && vaccineCount.hasOwnProperty(householdMember.boosterName)) {
          if(householdMember.boosterDosage == '1'){
            vaccineCount[householdMember.boosterName]['firstBoosterCount'] += 1;
          }
          else {
            vaccineCount[householdMember.boosterName]['secondBoosterCount'] += 1; 
          }
        }
      }
    }
  }
}

// Function to Calculate Age
function _calculateAge(birthday) {
  // birthday is a date
  var ageDifMs = Date.now() - birthday.getTime();
  var ageDate = new Date(ageDifMs); // miliseconds from epoch
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}
function incrementAgeGroup(obj, age) {
  if (age >= 0 && age <= 1) {
    obj.infant++;
  } else if (age >= 2 && age <= 4) {
    obj.toddler++;
  } else if (age >= 5 && age <= 12) {
    obj.child++;
  } else if (age >= 13 && age <= 19) {
    obj.teen++;
  } else if (age >= 20 && age <= 39) {
    obj.adult++;
  } else if (age >= 40 && age <= 59) {
    obj.middleAdult++;
  } else if (age >= 60) {
    obj.seniorAdult++;
  } else {
    console.log("Invalid age");
  }
}

function incrementReligionGroup(obj, religion) {
  if (religion == 'Roman Catholic') {
    obj.romanCatholic++;
  } else if (religion == 'Iglesia Ni Cristo') {
    obj.iglesiaNiCristo++;
  } else if (religion == 'Born Again') {
    obj.bornAgain++;
  } else if (religion == 'Islam') {
    obj.islam++;
  } else if (religion != 'Roman Catholic' || religion != 'Iglesia Ni Cristo' || religion != 'Born Again' || religion != 'Islam' || religion != "") {
    obj.others++;
  }
}
function incrementOccupationGroup(obj, occupation) {
  if (occupation == 'pe') {
    obj.privateEmployee++;
  } else if (occupation == 'ge') {
    obj.governmentEmployee++;
  } else if (occupation == 'st') {
    obj.student++;
  } else if (occupation == 'ofw') {
    obj.ofw++;
  } else if (occupation == 'ue') {
    obj.unemployed++;
  } else if (occupation != 'pe' || occupation != 'ge' || occupation != 'st' || occupation != 'ue' || occupation == 'ofw' | occupation == '') {
    obj.others++;
  }
}

 // Age Group and Covid Vaccine
 for (registree of registrees) {
  if (!registree.answeredCensus) {
    incrementAgeGroup(ageGroup,_calculateAge(registree.birthday))
    incrementReligionGroup(religionGroup, registree.religion)
    incrementOccupationGroup(occupationGroup, registree.occupation)
  } else {
    incrementReligionGroup(religionGroup, registree.religion)
    incrementAgeGroup(ageGroup,_calculateAge(registree.birthday))
    incrementOccupationGroup(occupationGroup, registree.occupation)

    for(member of registree.household){
      incrementAgeGroup(ageGroup,_calculateAge(member.birthday))
      incrementReligionGroup(religionGroup, member.religion)
    incrementOccupationGroup(occupationGroup, member.occupation)
    }
  }
}

var mappedEvents = admin.events.map(event => {
  return {title: event.title, start: event.start, end: event.end}
})

  res.render('admin/report', {ageGroup,vaccineCount, occupationGroup ,religionGroup,title: "Report || Barangay Mag-Asawang Sapa", mappedEvents})
})


router.get("/household/:id", notLoggedIn, notAdmin, async (req, res) => {
  const { id } = req.params;
  const registree = await User.findById(id);

  function _calculateAge(birthday) {
    // birthday is a date
    var ageDifMs = Date.now() - birthday.getTime();
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }
  if (registree) {
    var age = _calculateAge(registree.birthday);
    return res.render("admin/specificHousehold", {
      title: `${registree.firstName}'s Household || Barangay Mag-Asawang Sapa`,
      registree,
      age,
    });
  } else {
    req.flash("error", "No household found with that ID.");
    return res.redirect("/admin/household");
  }
});

router.delete("/household/:id", notLoggedIn, notAdmin, async (req, res) => {
  const { id } = req.params;
  await User.findByIdAndDelete(id);
  req.flash("success", "Successfully Deleted a Household!!");
  res.redirect("/admin/household");
});

module.exports = router;


