const mongoose = require("mongoose");

const placementSchema = new mongoose.Schema({
  company: { type: String, required: true },
  role: { type: String, required: true },
  description: { type: String, required: true },
  package: String,
  eligibility: String,
  location: String,
  deadline: Date,
  applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Placement", placementSchema);