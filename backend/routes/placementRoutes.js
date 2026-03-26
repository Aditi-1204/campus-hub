const express = require("express");
const { getPlacements, createPlacement } = require("../controllers/placementController");

const router = express.Router();

router.get("/", getPlacements);
router.post("/", createPlacement);

module.exports = router;