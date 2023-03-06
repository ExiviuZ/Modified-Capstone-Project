const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const { Schema } = mongoose;
const { model } = mongoose;
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = Schema({
  admin: {
    type: Boolean,
    default: false,
  },
  image: [
    {
      url: String,
      fileName: String,
    },
  ],
  idImage: [
    {
      url: String,
      fileName: String,
    },
  ],
  faceImage: [
    {
      url: String,
      fileName: String,
    },
  ],
  verified: {
    type: Boolean,
    default: false,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  birthday: {
    type: Date,
    required: true,
  },
  maritalStatus: {
    type: String,
    required: true,
  },
  answeredCensus: {
    type: Boolean,
    default: false,
  },
  combName: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    immutable: true,
    default: () => Date.now()
  },
  vaccineName: {
    type: String,
    default: '0'
  },
  vaccineDosage: {
    type: String,
    default: '0'
  },
  boosterName: {
    type: String,
    default: '0'
  },
  boosterDosage: {
    type: String,
    default: '0'
  },
  household: [
    {
      name: {
        required: true,
        type: String,
      },
      birthday: {
        required: true,
        type: Date,
      },
      education: {
        required: true,
        type: String,
      },
      maritalStatus: {
        required: true,
        type: String,
      },
      relationship: {
        required: true,
        type: String,
      },
      gender: {
        required: true,
        type: String,
      },
      vaccineName: {
        type: String,
      },
      vaccineDosage: {
        type: String,
      },
      boosterName: {
        type: String,
      },
      boosterDosage: {
        type: String,
      },
    },
  ],
  contact: {
    type: String,
    required: true
  },
  address: {
    houseNumber: {
      type: String,
      required: true,
    },
    sitio: {
      type: String,
      required: true,
    },
    barangay: {
      type: String,
      default: 'Mag-asawang Sapa'
    },
    province: {
      type: String,
      default: 'Santa Maria, Bulacan',
    },
  },
});
UserSchema.plugin(uniqueValidator, {
  message: "That {PATH} has already been registered.",
});

UserSchema.pre("save", async function () {
  this.firstName = this.firstName.trim();
  this.lastName = this.lastName.trim();

  this.address.houseNumber = this.address.houseNumber.trim();
  this.address.sitio = this.address.sitio.trim();

  this.username = this.username.toLowerCase();
});

UserSchema.pre("findOneAndUpdate", async function () {
  this.firstName = this.firstName.trim();
  this.lastName = this.lastName.trim();

  this.address.houseNumber = this.address.houseNumber.trim();
  this.address.sitio = this.address.sitio.trim();
});

UserSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});
UserSchema.virtual("fullAddress").get(function () {
  return `${this.address.houseNumber} ${this.address.sitio} ${this.address.barangay}, ${this.address.province}`;
});

UserSchema.plugin(passportLocalMongoose);

const User = model("User", UserSchema);

module.exports = User;
