const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const { Schema } = mongoose;
const { model } = mongoose;
const passportLocalMongoose = require("passport-local-mongoose");

const imageSchema = new mongoose.Schema({
  link: {
    type: String,
    required: true
  },
  fileName: {
    type: String,
    required: true
  }
});

const AdminSchema = Schema({
  name: {
    type: String,
  },
  admin: {
    type: Boolean,
    default: true,
  },
  events: [
    {
      title: {
        type: String,
      },
      start: {
        type: String,
      },
    }
    
    // Add more events here
  ],
  announcements: [
    {
      title: {
        type: String,
        trim: true
      },
      message: {
        type: String,
        trim: true
      },
      image: {
        type: imageSchema,
      },
      createdAt: {
        type: Date,
        immutable: true,
        default: () => Date.now()
      }
    }
  ]
});

AdminSchema.plugin(passportLocalMongoose);

const Admin = model("Admin", AdminSchema);

module.exports = Admin;
