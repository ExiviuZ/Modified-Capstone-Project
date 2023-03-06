const mongoose = require("mongoose");
const { Schema } = mongoose;
const { model } = mongoose;

const surveySchema = Schema({});

const Survey = model("Survey", surveySchema);

module.exports = Survey;
