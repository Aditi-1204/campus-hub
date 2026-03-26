const Placement = require("../models/Placement");

exports.getPlacements = async (req, res) => {
  const jobs = await Placement.find();
  res.json(jobs);
};

exports.createPlacement = async (req, res) => {
  const job = await Placement.create(req.body);
  res.json(job);
};